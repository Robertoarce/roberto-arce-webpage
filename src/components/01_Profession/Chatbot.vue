<template>
  <div class="h-screen bg-gray-700 p-2 sm:p-4 md:p-6 lg:p-10 flex flex-col overflow-auto">
    <!-- WIP Badge -->
    <div class="flex justify-center mb-4">
      <div class="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/20 border border-yellow-500/50 rounded-full">
        <span class="relative flex h-3 w-3">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
        </span>
        <span class="text-yellow-300 text-sm font-medium">🚧 WIP - The LLM is Hallucinating, needs to be fine-tuned. - DistilGPT2 (LLM running in browser)</span>
      </div>
    </div>

    <!-- Messages Container -->
    <div
      ref="messagesContainer"
      class="flex-1 overflow-y-auto space-y-2 sm:space-y-4 mb-4 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl ml-2 sm:ml-4 md:ml-8 lg:ml-20"
    >
      <!-- Message Bubbles -->
      <div
        v-for="(message, index) in messages"
        :key="index"
        :class="[
          'flex flex-col',
          'rounded-lg p-4',
          message.type === 'user' ? 'bg-blue-600 ml-auto' : 'bg-gray-800',
          'max-w-[80%]',
          'transition-all duration-200 ease-in-out',
          'hover:shadow-lg'
        ]"
      >
        <div class="flex items-start gap-2 sm:gap-3">
          <div
            :class="[
              'w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded-full flex-shrink-0',
              message.type === 'user' ? 'bg-blue-700' : 'bg-gray-600',
              'transition-colors duration-200'
            ]"
          >
            <span class="text-xs sm:text-sm">{{ message.type === "user" ? "🥸" : "🤖" }}</span>
          </div>
          <div class="text-white break-words whitespace-pre-wrap text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl">
            {{ message.text }}
          </div>
        </div>
        <div class="text-gray-400 text-xs sm:text-sm mt-1 sm:mt-2 self-end">
          {{ formatTimestamp(message.timestamp) }}
        </div>
      </div>

      <!-- Loading Indicator -->
      <div
        v-if="isLoading"
        class="flex flex-col rounded-lg p-2 sm:p-4 bg-gray-800 max-w-[80%] animate-pulse"
      >
        <div class="flex items-start gap-2 sm:gap-3">
          <div class="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-gray-600 flex-shrink-0">
            <span class="text-xs sm:text-sm">🤖</span>
          </div>
          <div class="flex space-x-1 sm:space-x-2">
            <span
              v-for="i in 3"
              :key="i"
              class="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full animate-bounce"
              :style="{ animationDelay: `${(i - 1) * 100}ms` }"
            ></span>
          </div>
        </div>
      </div>

      <!-- LLM Initialization Status -->
      <div
        v-if="!llmInitialized && !isLoading && messages.length === 0"
        class="flex flex-col rounded-lg p-2 sm:p-4 bg-blue-900 max-w-[80%]"
      >
        <div class="flex items-start gap-2 sm:gap-3">
          <div class="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-blue-700 flex-shrink-0">
            <span class="text-xs sm:text-sm">🤖</span>
          </div>
          <div class="text-white">
            <div class="font-semibold text-sm sm:text-base">Initializing AI Assistant...</div>
            <div class="text-xs sm:text-sm text-blue-200 mt-1">
              Loading DistilGPT2 model. First load may take ~30 seconds...
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Input Area -->
    <div class="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-auto pb-4 sm:pb-8 md:pb-12 lg:pb-20 relative ml-2 sm:ml-4 md:ml-8 lg:ml-20">
      <textarea
        v-model="userInput"
        @keydown="handleKeyDown"
        placeholder="Type your message... (Cmd/Ctrl + Enter to send)"
        :disabled="isLoading"
        class="flex-1 rounded-lg bg-gray-800 text-white text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl placeholder-gray-400 p-2 sm:p-3 md:p-4 
               focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none
               transition-all duration-200 ease-in-out
               disabled:opacity-50 disabled:cursor-not-allowed"
        :rows="isMobile ? 2 : 3"
      ></textarea>
      <button
        @click="sendMessage"
        :disabled="isLoading || !userInput.trim()"
        class="px-3 sm:px-4 md:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg 
               hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed 
               focus:outline-none focus:ring-2 focus:ring-blue-500
               transition-all duration-200 ease-in-out
               flex items-center justify-center min-w-[80px] sm:min-w-[100px]
               text-xs sm:text-sm md:text-base"
      >
        {{ isLoading ? 'Sending...' : 'Send' }}
      </button>
    </div>
  </div>
</template>

<script>
import { localLLM } from '../../utils/localLLM.js';

export default {
  name: "ChatInterface",
  data() {
    return {
      messages: [],
      userInput: "",
      isLoading: false,
      errorMessage: null,
      llmInitialized: false,
      isMobile: false
    };
  },

  methods: {
    checkMobile() {
      this.isMobile = window.innerWidth < 640;
    },

    handleKeyDown(event) {
      // Send on Cmd+Enter (Mac) or Ctrl+Enter (Windows/Linux) or Shift+Enter
      if (event.key === "Enter" && (event.metaKey || event.ctrlKey || event.shiftKey) && !this.isLoading) {
        event.preventDefault();
        this.sendMessage();
      }
    },

    async sendMessage() {
      if (!this.userInput.trim() || this.isLoading) return;

      const userMessage = {
        type: "user",
        text: this.userInput.trim(),
        timestamp: new Date(),
      };

      this.messages.push(userMessage);
      const messageText = this.userInput.trim();
      this.userInput = "";
      this.isLoading = true;
      this.errorMessage = null;

      try {
        // Initialize LLM if not already done
        if (!this.llmInitialized) {
          await this.initializeLLM();
        }

        // Generate response using local LLM
        const response = await localLLM.generateResponse(messageText);
        
        this.messages.push({
          type: "bot",
          text: response,
          timestamp: new Date(),
        });
      } catch (error) {
        console.error("Error:", error);
        
        // Use error response if LLM fails
        this.messages.push({
          type: "bot",
          text: "I'm sorry, I'm having trouble processing your request right now. Please try again later.",
          timestamp: new Date(),
        });
      } finally {
        this.isLoading = false;
        this.$nextTick(() => {
          this.scrollToBottom();
        });
      }
    },

    async initializeLLM() {
      try {
        await localLLM.initialize();
        this.llmInitialized = true;
        
        // Add welcome message if this is the first initialization
        if (this.messages.length === 0) {
          this.messages.push({
            type: "bot",
            text: "Hello! I'm Roberto's AI assistant powered by DistilGPT2 running in your browser. I can tell you about his background, skills, projects, and experience. What would you like to know?",
            timestamp: new Date(),
          });
        }
      } catch (error) {
        console.error("Failed to initialize LLM:", error);
        this.errorMessage = "Failed to initialize AI assistant. Please try again later.";
      }
    },

    scrollToBottom() {
      const container = this.$refs.messagesContainer;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    },

    formatTimestamp(timestamp) {
      return new Intl.DateTimeFormat("default", {
        hour: "numeric",
        minute: "numeric",
      }).format(timestamp);
    },
  },

  watch: {
    messages: {
      handler() {
        this.$nextTick(() => {
          this.scrollToBottom();
        });
      },
      deep: true
    }
  },

  mounted() {
    this.checkMobile();
    this.scrollToBottom();
    // Initialize LLM in the background
    this.initializeLLM();
    
    // Add resize listener for mobile detection
    window.addEventListener('resize', this.checkMobile);
  },

  beforeUnmount() {
    window.removeEventListener('resize', this.checkMobile);
  }
};

</script>
