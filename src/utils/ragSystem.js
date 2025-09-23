// RAG (Retrieval-Augmented Generation) System for Roberto's Personal Website
// This system combines roberto.txt and repositories.js data for intelligent retrieval

import fetchRepositoriesData from '/src/data/repositories.js';

class RAGSystem {
  constructor() {
    this.robertoText = '';
    this.repositoriesData = [];
    this.isInitialized = false;
    this.chunks = [];
  }

  async initialize() {
    if (this.isInitialized) return;
    
    try {
      // Load Roberto's text data
      await this.loadRobertoText();
      
      // Load repositories data
      this.repositoriesData = await fetchRepositoriesData();
      
      // Create searchable chunks
      this.createChunks();
      
      this.isInitialized = true;
      console.log('RAG System initialized successfully');
    } catch (error) {
      console.error('Failed to initialize RAG system:', error);
      throw error;
    }
  }

  async loadRobertoText() {
    try {
      const response = await fetch('/src/data/roberto.txt');
      this.robertoText = await response.text();
    } catch (error) {
      console.error('Failed to load roberto.txt:', error);
      throw error;
    }
  }

  createChunks() {
    this.chunks = [];
    
    // Split roberto.txt into meaningful chunks
    const robertoChunks = this.splitTextIntoChunks(this.robertoText);
    robertoChunks.forEach((chunk, index) => {
      this.chunks.push({
        id: `roberto_${index}`,
        content: chunk,
        source: 'roberto.txt',
        type: 'biography'
      });
    });

    // Add repository data as chunks
    this.repositoriesData.forEach((repo, index) => {
      // Create chunks for title and description
      this.chunks.push({
        id: `repo_title_${index}`,
        content: `Project: ${repo.title}`,
        source: 'repositories.js',
        type: 'project_title',
        metadata: repo
      });

      // Create chunk for description (clean HTML)
      const cleanDescription = repo.description
        .replace(/<[^>]*>/g, '') // Remove HTML tags
        .replace(/&nbsp;/g, ' ') // Replace &nbsp; with space
        .replace(/\s+/g, ' ') // Replace multiple spaces with single space
        .trim();
      
      this.chunks.push({
        id: `repo_desc_${index}`,
        content: `Project Description: ${cleanDescription}`,
        source: 'repositories.js',
        type: 'project_description',
        metadata: repo
      });

      // Create chunk for technologies
      if (repo.technologies && repo.technologies.length > 0) {
        this.chunks.push({
          id: `repo_tech_${index}`,
          content: `Technologies used: ${repo.technologies.join(', ')}`,
          source: 'repositories.js',
          type: 'project_technologies',
          metadata: repo
        });
      }
    });
  }

  splitTextIntoChunks(text, chunkSize = 500, overlap = 50) {
    const chunks = [];
    const lines = text.split('\n');
    let currentChunk = '';
    
    for (const line of lines) {
      // If adding this line would exceed chunk size, save current chunk
      if (currentChunk.length + line.length > chunkSize && currentChunk.length > 0) {
        chunks.push(currentChunk.trim());
        currentChunk = line + ' ';
      } else {
        currentChunk += line + ' ';
      }
    }
    
    // Add the last chunk if it has content
    if (currentChunk.trim().length > 0) {
      chunks.push(currentChunk.trim());
    }
    
    return chunks;
  }

  calculateRelevanceScore(query, chunk) {
    const queryLower = query.toLowerCase();
    const contentLower = chunk.content.toLowerCase();
    
    let score = 0;
    const queryWords = queryLower.split(/\s+/).filter(word => word.length > 2);
    
    // Exact phrase match (highest score)
    if (contentLower.includes(queryLower)) {
      score += 10;
    }
    
    // Individual word matches
    queryWords.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      const matches = contentLower.match(regex);
      if (matches) {
        score += matches.length * 2;
      }
      
      // Partial word matches
      if (contentLower.includes(word)) {
        score += 1;
      }
    });
    
    // Boost score for certain types
    if (chunk.type === 'project_title') {
      score += 3;
    } else if (chunk.type === 'project_description') {
      score += 2;
    } else if (chunk.type === 'biography') {
      score += 1;
    }
    
    return score;
  }

  async search(query, maxResults = 5) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const results = this.chunks.map(chunk => ({
      ...chunk,
      relevanceScore: this.calculateRelevanceScore(query, chunk)
    }))
    .filter(result => result.relevanceScore > 0)
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, maxResults);

    return results;
  }

  async generateContext(query) {
    const searchResults = await this.search(query, 5);
    
    let context = "You are Roberto Arce's personal assistant. Here's the information you can use to answer questions:\n\n";
    
    if (searchResults.length === 0) {
      context += "No specific information found for this query. You should say you don't have that information.\n";
    } else {
      searchResults.forEach((result, index) => {
        context += `${index + 1}. `;
        
        if (result.type === 'project_title') {
          context += `Project: ${result.content}\n`;
        } else if (result.type === 'project_description') {
          context += `${result.content}\n`;
        } else if (result.type === 'project_technologies') {
          context += `${result.content}\n`;
        } else if (result.type === 'biography') {
          context += `${result.content}\n`;
        } else {
          context += `${result.content}\n`;
        }
      });
    }
    
    context += "\nRULES:\n";
    context += "- ONLY use the information provided above\n";
    context += "- Do NOT make up or assume any information\n";
    context += "- If you don't know something, say 'I don't have that information in my knowledge base'\n";
    context += "- Keep responses concise and factual\n";
    context += "- If asked about topics not related to Roberto, redirect to his background, skills, or projects\n";
    context += "- When mentioning projects, include relevant technologies and key features\n";
    
    return context;
  }

  // Get all available data for debugging
  async getAllData() {
    if (!this.isInitialized) {
      await this.initialize();
    }
    
    return {
      robertoText: this.robertoText,
      repositoriesData: this.repositoriesData,
      chunks: this.chunks,
      totalChunks: this.chunks.length
    };
  }

  // Search specifically in repositories
  async searchRepositories(query) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const queryLower = query.toLowerCase();
    return this.repositoriesData.filter(repo => {
      const titleMatch = repo.title.toLowerCase().includes(queryLower);
      const descMatch = repo.description.toLowerCase().includes(queryLower);
      const techMatch = repo.technologies.some(tech => 
        tech.toLowerCase().includes(queryLower)
      );
      
      return titleMatch || descMatch || techMatch;
    });
  }

  // Search specifically in Roberto's text
  async searchRobertoText(query) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const queryLower = query.toLowerCase();
    const textLower = this.robertoText.toLowerCase();
    
    if (textLower.includes(queryLower)) {
      // Find the relevant section
      const lines = this.robertoText.split('\n');
      const relevantLines = lines.filter(line => 
        line.toLowerCase().includes(queryLower)
      );
      
      return relevantLines.join('\n');
    }
    
    return null;
  }

  // Debug method to get statistics
  getStats() {
    return {
      isInitialized: this.isInitialized,
      totalChunks: this.chunks.length,
      robertoTextLength: this.robertoText.length,
      repositoriesCount: this.repositoriesData.length,
      chunkTypes: this.chunks.reduce((acc, chunk) => {
        acc[chunk.type] = (acc[chunk.type] || 0) + 1;
        return acc;
      }, {})
    };
  }

  // Test method to verify the system works
  async testSearch(query) {
    console.log(`Testing search for: "${query}"`);
    const results = await this.search(query, 3);
    console.log('Search results:', results);
    return results;
  }
}

// Create a singleton instance
export const ragSystem = new RAGSystem();

// Export the class for testing
export { RAGSystem };
