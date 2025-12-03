import { pipeline, env } from "@xenova/transformers";
import { ragSystem } from "./ragSystem.js";

// Configure transformers.js to use HuggingFace Hub
env.allowLocalModels = false;
env.useBrowserCache = true;

class LocalLLM {
  constructor() {
    this.generator = null;
    this.isInitialized = false;
    this.isLoading = false;

    this.config = {
      // distilgpt2 is small and reliable
      modelName: "Xenova/distilgpt2",
      maxNewTokens: 80,
      temperature: 0.3,
      doSample: true,
      topK: 50,
      repetitionPenalty: 1.2,
    };
  }

  async initialize() {
    if (this.isInitialized || this.isLoading) return;

    this.isLoading = true;
    console.log("[LLM] Initializing...", this.config.modelName);

    try {
      await ragSystem.initialize();
      console.log("[LLM] RAG system ready");

      console.log("[LLM] Loading model from HuggingFace Hub...");
      this.generator = await pipeline("text-generation", this.config.modelName);

      this.isInitialized = true;
      this.isLoading = false;
      console.log("[LLM] Model loaded successfully!");
    } catch (error) {
      console.error("[LLM] Failed to initialize:", error);
      this.isLoading = false;
      throw error;
    }
  }

  async generateResponse(userQuery) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      console.log("[LLM] Processing query:", userQuery);

      const searchResults = await ragSystem.search(userQuery, 3);
      const context = this.buildContext(searchResults);

      console.log("[LLM] Context found");

      // Simple prompt for distilgpt2 (not instruction-tuned)
      const prompt = `About Roberto Arce: ${context}\n\nQuestion: ${userQuery}\nAnswer:`;

      console.log("[LLM] Generating...");

      const outputs = await this.generator(prompt, {
        max_new_tokens: this.config.maxNewTokens,
        temperature: this.config.temperature,
        do_sample: this.config.doSample,
        top_k: this.config.topK,
        repetition_penalty: this.config.repetitionPenalty,
      });

      console.log("[LLM] Raw output:", outputs);

      const response = this.extractResponse(outputs[0].generated_text, prompt);
      console.log("[LLM] Final response:", response);

      return response;
    } catch (error) {
      console.error("[LLM] Generation error:", error);
      // Fallback to RAG-only response
      return this.getFallbackResponse(userQuery);
    }
  }

  buildContext(searchResults) {
    if (!searchResults || searchResults.length === 0) {
      return "Data Scientist at Sanofi, France. Expert in Python, ML, data visualization.";
    }

    const contextParts = searchResults
      .filter((r) => r.relevanceScore > 2)
      .map((r) => {
        return r.content
          .replace(/^(Project|Project Description|Technologies used):\s*/i, "")
          .replace(/^#+\s+/gm, "")
          .replace(/\*\*Q:.*?\*\*\s*A:\s*/g, "")
          .replace(/\*\*/g, "")
          .substring(0, 200)
          .trim();
      })
      .slice(0, 2);

    if (contextParts.length === 0) {
      return "Data Scientist at Sanofi, France. Expert in Python, ML, data visualization.";
    }

    return contextParts.join(" ").substring(0, 400);
  }

  extractResponse(generatedText, prompt) {
    let response = generatedText;

    // Remove the prompt
    if (response.startsWith(prompt)) {
      response = response.substring(prompt.length);
    }

    // Find answer after "Answer:"
    const answerIndex = response.indexOf("Answer:");
    if (answerIndex !== -1) {
      response = response.substring(answerIndex + 7);
    }

    // Clean up
    response = response
      .split("\n")[0] // Take first line only
      .replace(/Question:.*$/g, "")
      .replace(/About Roberto.*$/g, "")
      .trim();

    if (!response || response.length < 10) {
      return this.getFallbackResponse("");
    }

    return response;
  }

  async getFallbackResponse(query) {
    // Use RAG results directly as fallback
    try {
      const results = await ragSystem.search(query, 1);
      if (results.length > 0 && results[0].relevanceScore > 3) {
        let content = results[0].content
          .replace(/^(Project|Project Description|Technologies used):\s*/i, "")
          .replace(/^#+\s+/gm, "")
          .replace(/\*\*Q:.*?\*\*\s*A:\s*/g, "")
          .replace(/\*\*/g, "")
          .trim();
        return content.substring(0, 300);
      }
    } catch (e) {
      console.error("[LLM] Fallback error:", e);
    }
    return "I'm Roberto Arce, a Data Scientist at Sanofi in France. I specialize in Python, machine learning, and data visualization. What would you like to know about my background or projects?";
  }

  getModelInfo() {
    return {
      modelName: this.config.modelName,
      isInitialized: this.isInitialized,
      isLoading: this.isLoading,
    };
  }
}

export const localLLM = new LocalLLM();
