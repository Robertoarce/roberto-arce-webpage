// Test file for RAG System
// This can be used to test the RAG system functionality

import { ragSystem } from './ragSystem.js';

export async function testRAGSystem() {
  console.log('Testing RAG System...');
  
  try {
    // Initialize the system
    await ragSystem.initialize();
    
    // Get stats
    const stats = ragSystem.getStats();
    console.log('RAG System Stats:', stats);
    
    // Test searches
    const testQueries = [
      'machine learning',
      'Docker',
      'Python',
      'projects',
      'education',
      'Sanofi'
    ];
    
    for (const query of testQueries) {
      console.log(`\n--- Testing query: "${query}" ---`);
      const results = await ragSystem.testSearch(query);
      console.log(`Found ${results.length} results`);
    }
    
    // Test context generation
    console.log('\n--- Testing context generation ---');
    const context = await ragSystem.generateContext('Tell me about Roberto\'s projects');
    console.log('Generated context:', context.substring(0, 500) + '...');
    
    console.log('\nRAG System test completed successfully!');
    
  } catch (error) {
    console.error('RAG System test failed:', error);
  }
}

// Export for use in browser console
window.testRAGSystem = testRAGSystem;
