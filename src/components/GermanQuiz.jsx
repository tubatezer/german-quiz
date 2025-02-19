"use client";
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { AlertCircle, CheckCircle, ArrowLeft, ArrowRight, List, BookOpen, Bookmark, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx";
import grammarQuestions from '@/data/grammar.json';
import vocabularyQuestions from '@/data/vocabulary.json';

const GermanQuiz = () => {
  const categories = {
    grammar: "Grammatik",
    vocabulary: "Wortschatz",
    expressions: "Redewendungen",
    situations: "Alltagssituationen",
    reading: "Leseverstehen"
  };

  const [questions, setQuestions] = useState({
    grammar: grammarQuestions.grammar,
    vocabulary: vocabularyQuestions.vocabulary,
    expressions: [],
    situations: [],
    reading: []
  });

  const [currentCategory, setCurrentCategory] = useState('grammar');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [showQuestionList, setShowQuestionList] = useState(false);
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState({});
  const [studyMode, setStudyMode] = useState('quiz');

  const currentQuestions = questions[currentCategory];

  const handleAnswerSelect = (answer) => {
    const newUserAnswers = {
      ...userAnswers,
      [`${currentCategory}-${currentQuestion}`]: answer
    };
    setUserAnswers(newUserAnswers);
    setShowResult(true);
    
    if (!userAnswers[`${currentCategory}-${currentQuestion}`] && 
        answer === currentQuestions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
  };

  const goToPrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
      setShowResult(userAnswers[`${currentCategory}-${currentQuestion - 1}`] !== undefined);
    }
  };

  const goToNext = () => {
    if (currentQuestion < currentQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setShowResult(userAnswers[`${currentCategory}-${currentQuestion + 1}`] !== undefined);
    }
  };

  const handleFinishTest = () => {
    console.log("Test completed with score:", score);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setUserAnswers({});
    setShowResult(false);
    setScore(0);
  };

  const handleCategoryChange = (category) => {
    setCurrentCategory(category);
    resetQuiz();
  };

  const toggleBookmark = () => {
    setBookmarkedQuestions({
      ...bookmarkedQuestions,
      [`${currentCategory}-${currentQuestion}`]: !bookmarkedQuestions[`${currentCategory}-${currentQuestion}`]
    });
  };

  const QuestionList = () => (
    <div className="fixed inset-0 bg-white z-50 overflow-auto p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Question Overview</h2>
          <Button variant="ghost" onClick={() => setShowQuestionList(false)}>
            <X className="h-6 w-6" />
          </Button>
        </div>
        
        {Object.entries(categories).map(([catKey, catName]) => (
          questions[catKey]?.length > 0 && (
            <div key={catKey} className="mb-6">
              <h3 className="text-lg font-semibold mb-2">{catName}</h3>
              <div className="grid grid-cols-1 gap-2">
                {questions[catKey].map((q, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    className={`text-left justify-start h-auto py-2 px-4 border border-slate-200 ${
                      userAnswers[`${catKey}-${idx}`] ? 'border-green-500' : ''
                    } ${bookmarkedQuestions[`${catKey}-${idx}`] ? 'bg-yellow-50' : ''}`}
                    onClick={() => {
                      setCurrentCategory(catKey);
                      setCurrentQuestion(idx);
                      setShowQuestionList(false);
                    }}
                  >
                    <span className="mr-2">{idx + 1}.</span>
                    <span className="truncate">{q.question.slice(0, 50)}...</span>
                  </Button>
                ))}
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">German B1 Level Quiz</CardTitle>
        <CardDescription>
          {Object.entries(questions).reduce((total, [category, questionList]) => total + questionList.length, 0)} Questions - {categories[currentCategory]}
        </CardDescription>
        
        <div className="flex gap-2 mb-4">
          <Button
            variant={studyMode === 'quiz' ? 'default' : 'outline'}
            onClick={() => setStudyMode('quiz')}
            className="flex-1 border border-slate-200"
          >
            <BookOpen className="mr-2 h-4 w-4" /> Quiz Mode
          </Button>
          <Button
            variant={studyMode === 'study' ? 'default' : 'outline'}
            onClick={() => setStudyMode('study')}
            className="flex-1 border border-slate-200"
          >
            <List className="mr-2 h-4 w-4" /> Study Mode
          </Button>
        </div>
        
        <div className="flex gap-2 mb-4">
          <Button 
            variant="outline" 
            onClick={() => setShowQuestionList(true)}
            className="flex-1 border border-slate-200"
          >
            <List className="mr-2 h-4 w-4" /> Show All Questions
          </Button>
          <Button 
            variant="outline" 
            onClick={toggleBookmark}
            className={`flex-1 border border-slate-200 ${bookmarkedQuestions[`${currentCategory}-${currentQuestion}`] ? 'bg-yellow-50' : ''}`}
          >
            <Bookmark className="mr-2 h-4 w-4" /> 
            {bookmarkedQuestions[`${currentCategory}-${currentQuestion}`] ? 'Bookmarked' : 'Bookmark'}
          </Button>
        </div>

        <Select value={currentCategory} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-full border border-slate-200">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(categories).map(([key, value]) => (
              questions[key]?.length > 0 && (
                <SelectItem key={key} value={key}>{value}</SelectItem>
              )
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="text-lg font-medium flex justify-between items-center">
            <span>Question {currentQuestion + 1} of {currentQuestions?.length || 0}</span>
            <span>Score: {score}</span>
          </div>
          
          {currentQuestions && currentQuestions[currentQuestion] && (
            <>
              <div className="text-xl mb-4">
                {currentQuestions[currentQuestion].question}
              </div>

              <div className="space-y-3">
                {currentQuestions[currentQuestion].options.map((option, index) => (
                  <Button
                    key={index}
                    onClick={() => !showResult && handleAnswerSelect(option)}
                    className={`w-full justify-start text-left h-auto py-3 px-4 border ${
                      showResult
                        ? option === currentQuestions[currentQuestion].correctAnswer
                          ? 'bg-green-500 hover:bg-green-600 border-green-600 text-white'
                          : option === userAnswers[`${currentCategory}-${currentQuestion}`]
                          ? 'bg-red-500 hover:bg-red-600 border-red-600 text-white'
                          : 'bg-white hover:bg-slate-50 border-slate-200'
                        : 'bg-white hover:bg-slate-50 border-slate-200'
                    }`}
                    disabled={showResult}
                    variant="outline"
                  >
                    {option}
                    {showResult && option === currentQuestions[currentQuestion].correctAnswer && (
                      <CheckCircle className="ml-2 h-5 w-4" />
                    )}
                    {showResult && option === userAnswers[`${currentCategory}-${currentQuestion}`] && 
                     option !== currentQuestions[currentQuestion].correctAnswer && (
                      <AlertCircle className="ml-2 h-5 w-4" />
                    )}
                  </Button>
                ))}
              </div>

              {showResult && (
                <div className="mt-4 space-y-4">
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="font-medium">Explanation:</p>
                    <p>{currentQuestions[currentQuestion].explanation}</p>
                  </div>
                </div>
              )}
            </>
          )}

          <div className="flex gap-4 mt-4">
            <Button 
              onClick={goToPrevious}
              disabled={currentQuestion === 0}
              className="flex-1 border border-slate-200"
              variant="outline"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Previous
            </Button>
            <Button 
              onClick={goToNext}
              disabled={!currentQuestions || currentQuestion === currentQuestions.length - 1}
              className="flex-1 border border-slate-200"
              variant="outline"
            >
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <Button 
            onClick={handleFinishTest}
            className="w-full mt-4 border border-slate-200"
            variant="default"
          >
            Finish Test
          </Button>
        </div>
      </CardContent>
      {showQuestionList && <QuestionList />}
    </Card>
  );
};

export default GermanQuiz;