import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PERIODS } from '../constants';
import { PeriodContent, QuizQuestion, ScoreRecord } from '../types';
import AudioPlayer from '../components/AudioPlayer';
import QuizModal from '../components/QuizModal';
import { ArrowLeft, Award, BookOpen, UserCheck, Calendar, Image as ImageIcon } from 'lucide-react';

const PeriodDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const period = PERIODS.find(p => p.id === id);

  const [content, setContent] = useState<PeriodContent | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  // Initialize Data
  useEffect(() => {
    if (!period) return;

    // Load static content directly
    if (period.staticContent) {
      setContent(period.staticContent);
    }

    // Load static quiz questions directly
    if (period.staticQuiz && period.staticQuiz.length > 0) {
        // Shuffle and take 10 random questions for replayability
        const shuffled = [...period.staticQuiz].sort(() => 0.5 - Math.random());
        setQuizQuestions(shuffled.slice(0, 10));
    }
  }, [id, period]); 

  const handleQuizStart = () => {
    if (quizQuestions.length === 0) {
        alert("Hiện chưa có bộ câu hỏi cho giai đoạn này.");
        return;
    }
    setIsQuizOpen(true);
  };

  const handleQuizComplete = (score: number) => {
    if (!period) return;
    
    // Save to local storage
    const newRecord: ScoreRecord = {
      periodId: period.id,
      periodName: period.title,
      score: score,
      total: quizQuestions.length,
      date: new Date().toLocaleDateString('vi-VN')
    };

    const existingScores = JSON.parse(localStorage.getItem('historyScores') || '[]');
    localStorage.setItem('historyScores', JSON.stringify([...existingScores, newRecord]));
  };

  if (!period) {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-800">Không tìm thấy giai đoạn này</h2>
                <button onClick={() => navigate('/')} className="mt-4 text-blue-600 hover:underline">Về trang chủ</button>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-military-50 pb-20">
      {/* Header Image */}
      <div className="relative h-64 md:h-80 w-full">
        <img 
            src={period.image} 
            alt={period.title} 
            className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-military-900/60 flex items-center justify-center flex-col text-white p-4 text-center">
            <h1 className="text-3xl md:text-5xl font-serif font-bold mb-2 text-yellow-400">{period.title}</h1>
            <div className="flex items-center space-x-2 bg-black/30 px-4 py-1 rounded-full">
                <Calendar size={18} />
                <span className="text-lg">{period.years}</span>
            </div>
        </div>
        <button 
            onClick={() => navigate('/')}
            className="absolute top-6 left-6 bg-white/10 hover:bg-white/20 backdrop-blur-md p-2 rounded-full text-white transition-colors border border-white/20"
        >
            <ArrowLeft size={24} />
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
        <div className="bg-white rounded-xl shadow-xl p-6 md:p-10">
            
            {/* Actions Bar */}
            <div className="flex flex-wrap gap-4 items-center justify-between border-b border-gray-100 pb-6 mb-6">
                <div className="flex items-center space-x-2 text-military-700 font-medium">
                    <BookOpen size={20} />
                    <span>Tài liệu lịch sử</span>
                </div>
                <div className="flex space-x-3 items-center">
                     {/* Audio Player Logic */}
                     {period.audioUrl && (
                         <AudioPlayer audioSrc={period.audioUrl} />
                     )}

                     <button 
                        onClick={handleQuizStart}
                        className="flex items-center space-x-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full transition-colors font-medium shadow-md shadow-yellow-200"
                     >
                        <UserCheck size={18} />
                        <span>Thi nhận thức</span>
                     </button>
                </div>
            </div>

            {/* Content Area */}
            {content ? (
                <div className="space-y-8">
                    <div className="prose prose-lg max-w-none text-gray-700 font-serif leading-relaxed text-justify">
                        {content.fullText.split('\n').map((paragraph, idx) => {
                            if (!paragraph.trim()) return null;
                            const isFirst = idx === 0;
                            return (
                                <p key={idx} className={`mb-4 ${isFirst ? 'first-letter:text-5xl first-letter:font-bold first-letter:text-military-700 first-letter:mr-3 first-letter:float-left' : ''}`}>
                                    {paragraph}
                                </p>
                            );
                        })}
                    </div>

                    {content.keyEvents.length > 0 && (
                        <div className="bg-orange-50 rounded-xl p-6 border border-orange-100">
                            <h3 className="text-xl font-bold text-orange-800 mb-4 flex items-center">
                                <Award className="mr-2" /> Sự kiện tiêu biểu
                            </h3>
                            <ul className="space-y-3">
                                {content.keyEvents.map((event, idx) => (
                                    <li key={idx} className="flex items-start">
                                        <div className="min-w-6 mt-1.5 mr-3">
                                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                        </div>
                                        <span className="text-gray-800">{event}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    
                    {/* Image Gallery */}
                    {period.gallery && period.gallery.length > 0 && (
                        <div className="mt-8 border-t border-gray-100 pt-8">
                            <h3 className="text-xl font-bold text-military-800 mb-6 flex items-center">
                                <ImageIcon className="mr-2" /> Hình ảnh tư liệu
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {period.gallery.map((imgUrl, idx) => (
                                    <div key={idx} className="relative group overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow">
                                        <img 
                                            src={imgUrl} 
                                            alt={`Tư liệu ${period.title} - ${idx + 1}`}
                                            className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-center py-10 text-gray-500">
                    Nội dung đang được cập nhật...
                </div>
            )}
        </div>
      </div>

      <QuizModal 
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        questions={quizQuestions}
        isLoading={false}
        onComplete={handleQuizComplete}
      />
    </div>
  );
};

export default PeriodDetail;