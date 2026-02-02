import React, { useState } from 'react';
import { QuizQuestion } from '../types';
import { CheckCircle, XCircle, Trophy, ArrowRight, RefreshCw, X } from 'lucide-react';

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: QuizQuestion[];
  onComplete: (score: number) => void;
  isLoading: boolean;
}

const QuizModal: React.FC<QuizModalProps> = ({ isOpen, onClose, questions, onComplete, isLoading }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showResult, setShowResult] = useState(false);

  if (!isOpen) return null;

  const handleAnswer = (idx: number) => {
    if (isAnswered) return;
    setSelectedAnswer(idx);
    setIsAnswered(true);
    
    if (idx === questions[currentIdx].correctAnswer) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(p => p + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
      onComplete(selectedAnswer === questions[currentIdx].correctAnswer ? score + 1 : score);
    }
  };

  const resetQuiz = () => {
      setCurrentIdx(0);
      setScore(0);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setShowResult(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-military-800 p-4 flex justify-between items-center text-white">
          <h2 className="text-xl font-bold flex items-center">
            <Trophy className="mr-2 text-yellow-400" /> 
            Thi Nhận Thức
          </h2>
          <button onClick={onClose} className="hover:text-red-400">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <RefreshCw className="animate-spin text-military-600" size={48} />
              <p className="text-lg text-gray-600">Đang khởi tạo bộ câu hỏi từ AI...</p>
            </div>
          ) : showResult ? (
            <div className="text-center py-8 space-y-6">
              <div className="inline-block p-6 rounded-full bg-yellow-100 mb-4">
                 <Trophy size={64} className="text-yellow-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Kết quả của bạn</h3>
              <p className="text-4xl font-black text-military-700">{score} / {questions.length}</p>
              
              <div className="flex justify-center space-x-4">
                <button onClick={onClose} className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                  Đóng
                </button>
                 {/* Optional: Retry logic could be added here */}
              </div>
            </div>
          ) : questions.length > 0 ? (
            <div className="space-y-6">
              <div className="flex justify-between text-sm text-gray-500 uppercase tracking-wider font-semibold">
                <span>Câu hỏi {currentIdx + 1}/{questions.length}</span>
                <span>Điểm: {score}</span>
              </div>
              
              <h3 className="text-xl font-medium text-gray-900 leading-relaxed">
                {questions[currentIdx].question}
              </h3>

              <div className="space-y-3">
                {questions[currentIdx].options.map((option, idx) => {
                  let btnClass = "w-full text-left p-4 rounded-lg border-2 transition-all ";
                  if (isAnswered) {
                    if (idx === questions[currentIdx].correctAnswer) {
                      btnClass += "bg-green-100 border-green-500 text-green-800";
                    } else if (idx === selectedAnswer) {
                      btnClass += "bg-red-100 border-red-500 text-red-800";
                    } else {
                      btnClass += "bg-gray-50 border-gray-200 opacity-50";
                    }
                  } else {
                    btnClass += "bg-white border-gray-200 hover:border-military-500 hover:bg-military-50";
                  }

                  return (
                    <button 
                      key={idx}
                      disabled={isAnswered}
                      onClick={() => handleAnswer(idx)}
                      className={btnClass}
                    >
                      <div className="flex items-center">
                         <span className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 font-bold mr-3 text-sm">
                             {String.fromCharCode(65 + idx)}
                         </span>
                         <span className="flex-1">{option}</span>
                         {isAnswered && idx === questions[currentIdx].correctAnswer && <CheckCircle size={20} className="text-green-600 ml-2" />}
                         {isAnswered && idx === selectedAnswer && idx !== questions[currentIdx].correctAnswer && <XCircle size={20} className="text-red-600 ml-2" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {isAnswered && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100 animate-in fade-in slide-in-from-bottom-2">
                    <p className="font-semibold text-blue-800 text-sm mb-1">Giải thích:</p>
                    <p className="text-blue-900">{questions[currentIdx].explanation}</p>
                </div>
              )}
            </div>
          ) : (
             <div className="text-center text-red-500">
                Không thể tải câu hỏi. Vui lòng thử lại.
             </div>
          )}
        </div>

        {/* Footer */}
        {!showResult && !isLoading && questions.length > 0 && (
           <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end">
              <button 
                onClick={handleNext}
                disabled={!isAnswered}
                className="flex items-center space-x-2 px-6 py-2 bg-military-700 text-white rounded-lg hover:bg-military-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <span>{currentIdx === questions.length - 1 ? 'Hoàn thành' : 'Câu tiếp theo'}</span>
                <ArrowRight size={18} />
              </button>
           </div>
        )}
      </div>
    </div>
  );
};

export default QuizModal;