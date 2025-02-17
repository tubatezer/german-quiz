"use client";
import React, { useState } from 'react';
import questions from '@/data/questions.json';

export default function GermanQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const category = 'grammar'; // We'll start with grammar questions
  const currentQuestions = questions[category];

  const handleAnswer = (answer) => {
    if (answer === currentQuestions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
    setShowResult(true);
  };

  const nextQuestion = () => {
    setShowResult(false);
    if (currentQuestion < currentQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">German B1 Quiz</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-lg mb-4">{currentQuestions[currentQuestion].question}</p>
        
        <div className="space-y-2">
          {currentQuestions[currentQuestion].options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(option)}
              disabled={showResult}
              className="w-full p-3 text-left rounded border hover:bg-gray-100 disabled:opacity-50"
            >
              {option}
            </button>
          ))}
        </div>

        {showResult && (
          <div className="mt-4">
            <p className="font-bold">
              {currentQuestions[currentQuestion].explanation}
            </p>
            <button
              onClick={nextQuestion}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Next Question
            </button>
          </div>
        )}

        <div className="mt-4">
          Score: {score} / {currentQuestion + 1}
        </div>
      </div>
    </div>
  );
}