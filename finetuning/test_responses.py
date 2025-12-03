#!/usr/bin/env python3
"""
Test chatbot responses for accuracy against known facts.
This script validates that responses don't contain hallucinations.
"""

import json
from pathlib import Path

# Known facts about Roberto that must be accurate
KNOWN_FACTS = {
    "name": "Roberto Arce",
    "role": "Data Scientist",
    "location": "France",
    "current_employer": "Sanofi",
    "employment_year": "2023",
    
    # Education
    "degrees": [
        "MSc Supply Chain",
        "MSc Finance",
        "MSc Management",
        "Bachelor Industrial Engineering"
    ],
    
    # Certifications
    "certifications": [
        "Machine Learning Specialization - Andrew Ng",
        "Deep Learning Specialization - Andrew Ng",
        "Disney Engineering Internship"
    ],
    
    # Technical skills
    "languages": ["Python", "JavaScript", "Vue.js", "SQL"],
    "ml_frameworks": ["scikit-learn", "TensorFlow", "PyTorch", "XGBoost", "LightGBM"],
    "databases": ["PostgreSQL", "MongoDB", "Redis"],
    "cloud": ["AWS", "Google Cloud", "Azure"],
    
    # Projects
    "projects": [
        "Configurable ML Pipeline",
        "Pipeline Performance Benchmark",
        "LLM-Powered Web Scraper",
        "Churn Model",
        "Dynamic DBT Table Creation",
        "Sales Funnel EDA"
    ]
}

# Test questions and expected keywords in responses
TEST_CASES = [
    {
        "question": "Who are you?",
        "must_contain": ["Roberto", "Data Scientist", "France"],
        "must_not_contain": ["I don't know", "I cannot"]
    },
    {
        "question": "What is your educational background?",
        "must_contain": ["MSc", "Bachelor", "Industrial Engineering"],
        "must_not_contain": ["PhD", "Harvard", "MIT"]  # Things Roberto doesn't have
    },
    {
        "question": "Where do you work?",
        "must_contain": ["Sanofi", "2023"],
        "must_not_contain": ["Google", "Amazon", "Microsoft"]
    },
    {
        "question": "What programming languages do you use?",
        "must_contain": ["Python"],
        "must_not_contain": ["Rust", "Go", "Haskell"]  # Not mentioned in profile
    },
    {
        "question": "Tell me about your Disney experience",
        "must_contain": ["Disney", "Orlando", "internship"],
        "must_not_contain": ["Disneyland Paris", "California"]
    }
]

def validate_response(response: str, test_case: dict) -> dict:
    """Validate a response against test case criteria."""
    results = {
        "question": test_case["question"],
        "passed": True,
        "errors": []
    }
    
    response_lower = response.lower()
    
    # Check must_contain
    for keyword in test_case.get("must_contain", []):
        if keyword.lower() not in response_lower:
            results["passed"] = False
            results["errors"].append(f"Missing required keyword: '{keyword}'")
    
    # Check must_not_contain (potential hallucinations)
    for keyword in test_case.get("must_not_contain", []):
        if keyword.lower() in response_lower:
            results["passed"] = False
            results["errors"].append(f"Contains hallucinated content: '{keyword}'")
    
    return results

def run_tests(responses: dict) -> dict:
    """Run all test cases against provided responses."""
    all_results = {
        "total": len(TEST_CASES),
        "passed": 0,
        "failed": 0,
        "details": []
    }
    
    for test_case in TEST_CASES:
        question = test_case["question"]
        response = responses.get(question, "")
        
        if not response:
            result = {
                "question": question,
                "passed": False,
                "errors": ["No response provided"]
            }
        else:
            result = validate_response(response, test_case)
        
        all_results["details"].append(result)
        
        if result["passed"]:
            all_results["passed"] += 1
        else:
            all_results["failed"] += 1
    
    return all_results

def print_report(results: dict):
    """Print a formatted test report."""
    print("\n" + "=" * 60)
    print("CHATBOT RESPONSE VALIDATION REPORT")
    print("=" * 60)
    
    print(f"\nTotal tests: {results['total']}")
    print(f"Passed: {results['passed']} ✅")
    print(f"Failed: {results['failed']} ❌")
    print(f"Pass rate: {results['passed']/results['total']*100:.1f}%")
    
    print("\n" + "-" * 60)
    print("DETAILED RESULTS")
    print("-" * 60)
    
    for detail in results["details"]:
        status = "✅ PASS" if detail["passed"] else "❌ FAIL"
        print(f"\n{status}: {detail['question']}")
        
        if detail["errors"]:
            for error in detail["errors"]:
                print(f"  - {error}")

def main():
    """Run validation tests."""
    print("Chatbot Response Validator")
    print("-" * 40)
    
    # Load training data for reference
    script_dir = Path(__file__).parent
    training_data_path = script_dir / "training_data.json"
    
    if training_data_path.exists():
        with open(training_data_path, 'r', encoding='utf-8') as f:
            training_data = json.load(f)
        
        # Create responses dict from training data
        responses = {}
        for conv in training_data.get("conversations", []):
            responses[conv["input"]] = conv["output"]
        
        # Map test questions to closest training data questions
        test_responses = {
            "Who are you?": responses.get("Who is Roberto?", ""),
            "What is your educational background?": responses.get("What is your educational background?", ""),
            "Where do you work?": responses.get("Where do you currently work?", ""),
            "What programming languages do you use?": responses.get("What programming languages do you know?", ""),
            "Tell me about your Disney experience": responses.get("Tell me about your Disney internship", "")
        }
        
        results = run_tests(test_responses)
        print_report(results)
    else:
        print(f"Training data not found at {training_data_path}")
        print("Run generate_training_data.py first to create training data.")

if __name__ == "__main__":
    main()

