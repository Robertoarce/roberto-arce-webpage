import { pipeline } from '@xenova/transformers';
import { ragSystem } from './ragSystem.js';

class LocalLLM {
  constructor() {
    this.pipe = null;
    this.isInitialized = false;
    this.isLoading = false;
    
    // LLM Configuration Settings
    this.config = {
      // Model settings
      modelName: 'Xenova/distilgpt2',
      quantized: true,
      revision: 'main',
      cacheDir: './models',
      
      // Generation parameters
      maxNewTokens: 100,
      temperature: 0.0,
      doSample: false,
      repetitionPenalty: 1.3,
      topP: 0.5,
      topK: 20,
      
      // Context settings
      maxContextLength: 2000,
      contextOverlap: 200
    };
  }

  async initialize() {
    if (this.isInitialized || this.isLoading) return;
    
    this.isLoading = true;
    console.log('Initializing local LLM...');
    
    try {
      // Using a small, efficient model for client-side inference
      this.pipe = await pipeline('text-generation', this.config.modelName, {
        quantized: this.config.quantized,
        revision: this.config.revision,
        cache_dir: this.config.cacheDir
      });
      
      this.isInitialized = true;
      this.isLoading = false;
      console.log('Local LLM initialized successfully!');
    } catch (error) {
      console.error('Failed to initialize LLM:', error);
      this.isLoading = false;
      throw error;
    }
  }

  async generateResponse(userQuery) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      // Initialize RAG system if not already done
      await ragSystem.initialize();
      
      // Generate context from RAG system
      const context = await ragSystem.generateContext(userQuery);
      
      // Create a prompt that includes context and user query
      const prompt = `${context}\n\nIMPORTANT: Only answer based on the information provided above. Do not make up or assume any information not explicitly mentioned. If you don't know something, say "I don't have that information in my knowledge base."\n\nUser: ${userQuery}\nRoberto:`;
      
      // Generate response using the local model
      const result = await this.pipe(prompt, {
        max_new_tokens: this.config.maxNewTokens,
        temperature: this.config.temperature,
        do_sample: this.config.doSample,
        pad_token_id: this.pipe.tokenizer.eos_token_id,
        repetition_penalty: this.config.repetitionPenalty,
        top_p: this.config.topP,
        top_k: this.config.topK
      });

      // Extract the response (remove the prompt from the generated text)
      let response = result[0].generated_text;
      const assistantIndex = response.lastIndexOf("Roberto:");
      if (assistantIndex !== -1) {
        response = response.substring(assistantIndex + "Roberto:".length).trim();
      }

      // Clean up the response
      response = this.cleanResponse(response);
      
      return response;
    } catch (error) {
      console.error('Error generating response:', error);
      return "I'm sorry, I'm having trouble processing your request right now. Please try again later.";
    }
  }

  cleanResponse(response) {
    // Remove any remaining prompt artifacts
    response = response.replace(/User:.*$/gm, '').trim();
    response = response.replace(/Roberto:.*$/gm, '').trim();
    response = response.replace(/IMPORTANT:.*$/gm, '').trim();
    
    // Remove incomplete sentences at the end
    const sentences = response.split(/[.!?]+/);
    if (sentences.length > 1) {
      const lastSentence = sentences[sentences.length - 1].trim();
      if (lastSentence.length < 10) {
        response = sentences.slice(0, -1).join('.') + '.';
      }
    }
    
    // If response is too short or seems incomplete, provide a fallback
    if (response.length < 20) {
      return "I don't have enough information to answer that question. Please ask about Roberto's background, skills, projects, or experience.";
    }
    
    return response || "I'm Roberto's AI assistant. I can help you learn about Roberto's background, skills, projects, and experience. What would you like to know?";
  }

  // Configuration management methods
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    console.log('LLM configuration updated:', this.config);
  }

  getConfig() {
    return { ...this.config };
  }

  // Reset to default configuration
  resetConfig() {
    this.config = {
      modelName: 'Xenova/distilgpt2',
      quantized: true,
      revision: 'main',
      cacheDir: './models',
      maxNewTokens: 100,
      temperature: 0.0,
      doSample: false,
      repetitionPenalty: 1.3,
      topP: 0.5,
      topK: 20,
      maxContextLength: 2000,
      contextOverlap: 200
    };
    console.log('LLM configuration reset to defaults');
  }


}

// Create a singleton instance
export const localLLM = new LocalLLM();
