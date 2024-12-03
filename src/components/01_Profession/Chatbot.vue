<template>
  <div class="h-screen bg-gray-700 p-10 flex flex-col overflow-auto">
    <div
      ref="messagesContainer"
      class="flex-1 overflow-y-auto space-y-4 mb-4 text-2xl"
    >
      <div
        v-for="(message, index) in messages"
        :key="index"
        :class="[
          'flex flex-col',
          'rounded-lg p-4',
          message.type === 'user' ? 'bg-blue-600 ml-auto' : 'bg-gray-800',
          'max-w-[80%]',
        ]"
      >
        <div class="flex items-start gap-3">
          <div
            class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-600"
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

      <!-- Loading indicator -->
      <div
        v-if="isLoading"
        class="flex flex-col rounded-lg p-4 bg-gray-800 max-w-[80%]"
      >
        <div class="flex items-start gap-3">
          <div
            class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-600"
          >
            🤖
          </div>
          <div class="flex space-x-2">
            <span
              class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
            ></span>
            <span
              class="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"
            ></span>
            <span
              class="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"
            ></span>
          </div>
        </div>
      </div>
    </div>

    <div class="flex gap-4 mt-auto pb-20">
      <textarea
        v-model="userInput"
        @keydown="handleKeyDown"
        placeholder="Type your message... (Shift + Enter to send)"
        :disabled="isLoading"
        class="flex-1 rounded-lg bg-gray-800 text-white md:text-2xl placeholder-gray-400 p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        rows="3"
        id="nothing"
      ></textarea>
      <button
        @click="sendMessage"
        :disabled="isLoading || !userInput.trim()"
        class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Send
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
      // apiUrl: "http://92.170.11.112:8000/chat",
      apiKey: "i-know-i-will-forget-this-key",
    };
  },

  methods: {
    handleKeyDown(event) {
      if (event.key === "Enter" && event.shiftKey) {
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

      try {
        const payload = {
          inputs: messageText,
        };
        console.log("Sending request with payload:", payload);
        console.log("Stringified payload:", JSON.stringify(payload));

        const response = await fetch(this.apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-API-Key": this.apiKey,
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
        });

        console.log("Response status:", response.status);

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Full error response:", errorText);
          const errorData = JSON.parse(errorText);
          console.error("Parsed error data:", errorData);
          throw new Error(`Failed to get response: ${errorText}`);
        }

        const data = await response.json();
        console.log("Successful response data:", data);

        this.messages.push({
          type: "bot",
          text: data.generated_text,
          timestamp: new Date(),
        });
      } catch (error) {
        console.error("Detailed error:", error);
        this.messages.push({
          type: "bot",
          text: "Sorry, I can't answer... the server is not connected. \n Ask Roberto to plug-me in! 🙄",
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
      container.scrollTop = container.scrollHeight;
    },

    formatTimestamp(timestamp) {
      return new Intl.DateTimeFormat("default", {
        hour: "numeric",
        minute: "numeric",
      }).format(timestamp);
    },
  },
};
</script>
