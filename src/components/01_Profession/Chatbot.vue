<template>
  <div class="h-screen bg-gray-700 p-10 flex flex-col overflow-auto">
    <!-- Messages Container -->
    <div
      ref="messagesContainer"
      class="flex-1 overflow-y-auto space-y-4 mb-4 text-2xl"
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
    </div>

    <!-- Input Area -->
    <div class="flex gap-4 mt-auto pb-20 relative">
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
export default {
  name: "ChatInterface",
  data() {
    return {
      messages: [],
      userInput: "",
      isLoading: false,
      apiUrl: "http://localhost:8000/chat",
      apiKey: "i-know-i-will-forget-this-key",
      errorMessage: null
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
        const response = await fetch(this.apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-API-Key": this.apiKey,
            Accept: "application/json",
          },
          body: JSON.stringify({ inputs: messageText }),
        });

        if (!response.ok) {
          throw new Error(`Server responded with ${response.status}`);
        }

        const data = await response.json();
        
        this.messages.push({
          type: "bot",
          text: data.generated_text,
          timestamp: new Date(),
        });
      } catch (error) {
        console.error("Error:", error);
        this.messages.push({
          type: "bot",
          text: "Sorry, I can't answer... the server is not connected. \nAsk Roberto to plug me in! 🙄",
          timestamp: new Date(),
        });
      } finally {
        this.isLoading = false;
        this.$nextTick(() => {
          this.scrollToBottom();
        });
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
    this.scrollToBottom();
  }
};
</script>