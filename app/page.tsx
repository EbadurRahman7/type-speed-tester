'use client'

import React, { useState, useEffect, useRef } from 'react';
import { Clock, RotateCcw, Award } from 'lucide-react';

const TypingSpeedTester = () => {
  const [text, setText] = useState("The quick brown fox jumps over the lazy dog. This is a sample text to test your typing speed and accuracy. Keep typing to improve your skills and measure your words per minute.");
  const [userInput, setUserInput] = useState("");
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const inputRef = useRef(null);

  // Timer effect
  useEffect(() => {
    let interval = null;
    if (isStarted && timeLeft > 0 && !isFinished) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsFinished(true);
            setIsStarted(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isStarted, timeLeft, isFinished]);

  // Calculate WPM and accuracy
  useEffect(() => {
    if (userInput.length > 0) {
      const words = userInput.trim().split(' ').length;
      const timeElapsed = (60 - timeLeft) / 60;
      const currentWpm = timeElapsed > 0 ? Math.round(words / timeElapsed) : 0;
      setWpm(currentWpm);

      // Calculate accuracy
      let correctChars = 0;
      for (let i = 0; i < userInput.length; i++) {
        if (userInput[i] === text[i]) {
          correctChars++;
        }
      }
      const currentAccuracy = userInput.length > 0 ? Math.round((correctChars / userInput.length) * 100) : 100;
      setAccuracy(currentAccuracy);
    }
  }, [userInput, timeLeft, text]);

  const startTest = () => {
    setIsStarted(true);
    setIsFinished(false);
    setUserInput("");
    setTimeLeft(60);
    setWpm(0);
    setAccuracy(100);
    inputRef.current?.focus();
  };

  const resetTest = () => {
    setIsStarted(false);
    setIsFinished(false);
    setUserInput("");
    setTimeLeft(60);
    setWpm(0);
    setAccuracy(100);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    
    if (!isStarted && value.length > 0) {
      startTest();
    }
    
    setUserInput(value);
    
    // Check if test is complete
    if (value.length >= text.length) {
      setIsFinished(true);
      setIsStarted(false);
    }
  };

  const renderText = () => {
    return text.split('').map((char, index) => {
      let className = 'text-gray-500';
      
      if (index < userInput.length) {
        className = userInput[index] === char ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100';
      } else if (index === userInput.length) {
        className = 'text-gray-800 bg-blue-200';
      }
      
      return (
        <span key={index} className={`${className} px-0.5 rounded`}>
          {char}
        </span>
      );
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Typing Speed Tester</h1>
          <p className="text-gray-600">Test your typing speed and accuracy</p>
        </div>

        {/* Stats Bar */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center justify-center p-4 bg-blue-50 rounded-lg">
              <Clock className="w-6 h-6 text-blue-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Time Left</p>
                <p className="text-2xl font-bold text-blue-600">{timeLeft}s</p>
              </div>
            </div>
            
            <div className="flex items-center justify-center p-4 bg-green-50 rounded-lg">
              <Award className="w-6 h-6 text-green-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">WPM</p>
                <p className="text-2xl font-bold text-green-600">{wpm}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-center p-4 bg-purple-50 rounded-lg">
              <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center mr-3">
                <span className="text-white text-xs font-bold">%</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Accuracy</p>
                <p className="text-2xl font-bold text-purple-600">{accuracy}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Text Display */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="text-lg leading-relaxed font-mono p-4 bg-gray-50 rounded-lg border-2 border-gray-200 min-h-32">
            {renderText()}
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <textarea
            ref={inputRef}
            value={userInput}
            onChange={handleInputChange}
            disabled={isFinished}
            placeholder={isStarted ? "Keep typing..." : "Start typing to begin the test..."}
            className="w-full h-32 p-4 text-lg border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none resize-none text-gray-600 font-mono"
          />
        </div>

        {/* Control Buttons */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={startTest}
            disabled={isStarted}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
          >
            Start Test
          </button>
          
          <button
            onClick={resetTest}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>

        {/* Results */}
        {isFinished && (
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Test Complete!</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600">Final Speed</p>
                <p className="text-3xl font-bold text-green-600">{wpm} WPM</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-600">Final Accuracy</p>
                <p className="text-3xl font-bold text-purple-600">{accuracy}%</p>
              </div>
            </div>
            <p className="mt-4 text-gray-600">
              {wpm >= 40 ? "Excellent typing speed! 🎉" : 
               wpm >= 25 ? "Good job! Keep practicing to improve. 👍" : 
               "Keep practicing to improve your speed. 💪"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TypingSpeedTester;