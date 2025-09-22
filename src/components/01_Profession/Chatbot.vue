<template>
  <div class="h-screen bg-gray-700 p-10 flex flex-col overflow-auto">
    <!-- Messages Container -->
    <div
      ref="messagesContainer"
      class="flex-1 overflow-y-auto space-y-4 mb-4 text-2xl ml-20"
    >
    <!-- WIP Sign -->
    <div class="ml-20 mb-4">
      <div class="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg shadow-lg border-2 border-yellow-300 p-3 relative overflow-hidden w-64">
        <!-- Animated background pattern -->
        <div class="absolute inset-0 opacity-20">
          <div class="absolute top-1 left-1 w-2 h-2 bg-yellow-200 rounded-full animate-bounce"></div>
          <div class="absolute top-2 right-2 w-1 h-1 bg-orange-200 rounded-full animate-bounce" style="animation-delay: 0.5s;"></div>
          <div class="absolute bottom-1 left-3 w-1 h-1 bg-yellow-200 rounded-full animate-bounce" style="animation-delay: 1s;"></div>
          <div class="absolute bottom-2 right-1 w-1 h-1 bg-orange-200 rounded-full animate-bounce" style="animation-delay: 1.5s;"></div>
        </div>
        
        <!-- Main content -->
        <div class="relative z-10 flex items-center justify-center space-x-2">
          <!-- Animated WIP icon -->
          <div class="flex items-center justify-center">
            <div class="relative">
              <!-- Rotating gear -->
              <div class="w-6 h-6 border-2 border-yellow-800 rounded-full animate-spin">
                <div class="absolute top-0.5 left-0.5 w-1 h-1 bg-yellow-800 rounded-full"></div>
                <div class="absolute top-0.5 right-0.5 w-1 h-1 bg-yellow-800 rounded-full"></div>
                <div class="absolute bottom-0.5 left-0.5 w-1 h-1 bg-yellow-800 rounded-full"></div>
                <div class="absolute bottom-0.5 right-0.5 w-1 h-1 bg-yellow-800 rounded-full"></div>
              </div>
              <!-- Center dot -->
              <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-yellow-800 rounded-full"></div>
            </div>
          </div>
          
          <!-- Text content -->
          <div class="text-center">
            <div class="text-yellow-900 text-sm font-bold">⚠️ WIP ⚠️</div>
            <div class="text-yellow-800 text-xs">The model is not trained yet, so it's allucinating</div>
          </div>
        </div>
      </div>
    </div>
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
        <div class="flex items-start gap-3">
          <div
            :class="[
              'w-8 h-8 flex items-center justify-center rounded-full',
              message.type === 'user' ? 'bg-blue-700' : 'bg-gray-600',
              'transition-colors duration-200'
            ]"
          >
            {{ message.type === "user" ? "🥸" : "🤖" }}
          </div>
          <div class="text-white break-words whitespace-pre-wrap text-2xl">
            {{ message.text }}
          </div>
        </div>
        <div class="text-gray-400 text-sm mt-2 self-end">
          {{ formatTimestamp(message.timestamp) }}
        </div>
      </div>

      <!-- Loading Indicator -->
      <div
        v-if="isLoading"
        class="flex flex-col rounded-lg p-4 bg-gray-800 max-w-[80%] animate-pulse"
      >
        <div class="flex items-start gap-3">
          <div class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-600">
            🤖
          </div>
          <div class="flex space-x-2">
            <span
              v-for="i in 3"
              :key="i"
              class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
              :style="{ animationDelay: `${(i - 1) * 100}ms` }"
            ></span>
          </div>
        </div>
      </div>

      <!-- LLM Initialization Status -->
      <div
        v-if="!llmInitialized && !isLoading && messages.length === 0"
        class="flex flex-col rounded-lg p-4 bg-blue-900 max-w-[80%]"
      >
        <div class="flex items-start gap-3">
          <div class="w-8 h-8 flex items-center justify-center rounded-full bg-blue-700">
            🤖
          </div>
          <div class="text-white">
            <div class="font-semibold">Initializing AI Assistant...</div>
            <div class="text-sm text-blue-200 mt-1">
              Loading Roberto's knowledge base and AI model. This may take a moment on first load.
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Input Area -->
    <div class="flex gap-4 mt-auto pb-20 relative ml-20">
      <textarea
        v-model="userInput"
        @keydown="handleKeyDown"
        placeholder="Type your message... (Shift + Enter to send)"
        :disabled="isLoading"
        class="flex-1 rounded-lg bg-gray-800 text-white md:text-2xl placeholder-gray-400 p-4 
               focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none
               transition-all duration-200 ease-in-out
               disabled:opacity-50 disabled:cursor-not-allowed"
        rows="3"
      ></textarea>
      <button
        @click="sendMessage"
        :disabled="isLoading || !userInput.trim()"
        class="px-6 py-2 bg-blue-600 text-white rounded-lg 
               hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed 
               focus:outline-none focus:ring-2 focus:ring-blue-500
               transition-all duration-200 ease-in-out
               flex items-center justify-center min-w-[100px]"
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
      llmInitialized: false
    };
  },

  methods: {
    handleKeyDown(event) {
      if (event.key === "Enter" && event.shiftKey && !this.isLoading) {
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
        
        // Use fallback response if LLM fails
        const fallbackResponse = localLLM.getFallbackResponse(messageText);
        this.messages.push({
          type: "bot",
          text: fallbackResponse,
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
            text: "Hello! I'm Roberto's AI assistant. I can tell you about his background, skills, projects, and experience in data science and machine learning. What would you like to know?",
            timestamp: new Date(),
          });
        }
      } catch (error) {
        console.error("Failed to initialize LLM:", error);
        this.errorMessage = "Failed to initialize AI assistant. Using fallback responses.";
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

  async mounted() {
    this.scrollToBottom();
    // Initialize LLM in the background
    this.initializeLLM();
  }
};
</script>