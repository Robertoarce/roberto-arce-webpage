#!/usr/bin/env python3
"""
Generate training data from roberto.txt for fine-tuning or reference.
This script extracts Q&A pairs and creates structured training data.
"""

import json
import re
from pathlib import Path

def extract_qa_pairs(text: str) -> list:
    """Extract Q&A pairs from the roberto.txt content."""
    qa_pairs = []
    
    # Find the conversation examples section
    qa_pattern = r'\*\*Q: (.+?)\*\*\nA: (.+?)(?=\n\n\*\*Q:|\Z)'
    matches = re.findall(qa_pattern, text, re.DOTALL)
    
    for question, answer in matches:
        qa_pairs.append({
            "input": question.strip(),
            "output": answer.strip()
        })
    
    return qa_pairs

def extract_sections(text: str) -> dict:
    """Extract main sections from roberto.txt."""
    sections = {}
    
    # Match ## headers and their content
    section_pattern = r'## ([^\n]+)\n(.*?)(?=\n## |\Z)'
    matches = re.findall(section_pattern, text, re.DOTALL)
    
    for title, content in matches:
        sections[title.strip()] = content.strip()
    
    return sections

def create_training_data(roberto_path: str, output_path: str):
    """Create training data JSON from roberto.txt."""
    
    # Read roberto.txt
    with open(roberto_path, 'r', encoding='utf-8') as f:
        text = f.read()
    
    # Extract Q&A pairs
    qa_pairs = extract_qa_pairs(text)
    
    # Extract sections for context
    sections = extract_sections(text)
    
    # Create training data structure
    training_data = {
        "metadata": {
            "source": "roberto.txt",
            "description": "Q&A pairs for Roberto's personal assistant chatbot",
            "version": "1.0",
            "qa_count": len(qa_pairs),
            "section_count": len(sections)
        },
        "conversations": qa_pairs,
        "sections": sections
    }
    
    # Write to output file
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(training_data, f, indent=2, ensure_ascii=False)
    
    print(f"Generated training data with {len(qa_pairs)} Q&A pairs")
    print(f"Sections found: {list(sections.keys())}")
    return training_data

def main():
    # Paths
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    roberto_path = project_root / "src" / "data" / "roberto.txt"
    output_path = script_dir / "extracted_training_data.json"
    
    if not roberto_path.exists():
        print(f"Error: {roberto_path} not found")
        return
    
    training_data = create_training_data(str(roberto_path), str(output_path))
    print(f"\nTraining data saved to: {output_path}")

if __name__ == "__main__":
    main()

