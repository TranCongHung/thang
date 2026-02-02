import React, { useEffect, useState } from 'react';
import { ScoreRecord } from '../types';
import { Trophy, Medal, Calendar, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Leaderboard: React.FC = () => {
  const [scores, setScores] = useState<ScoreRecord[]>([]);

  useEffect(() => {
    const data = localStorage.getItem('historyScores');
    if (data) {
      setScores(JSON.parse(data).reverse()); // Newest first
    }
  }, []);

  const clearHistory = () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa toàn bộ lịch sử thi?")) {
        localStorage.removeItem('historyScores');
        setScores([]);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
            <div className="inline-block p-4 rounded-full bg-yellow-100 mb-4">
                <Trophy className="w-12 h-12 text-yellow-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Bảng Vàng Thành Tích</h1>
            <p className="mt-2 text-gray-600">Lịch sử kết quả thi nhận thức các giai đoạn</p>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Danh sách kết quả gần đây
            </h3>
            {scores.length > 0 && (
                <button 
                    onClick={clearHistory}
                    className="text-red-600 hover:text-red-800 text-sm flex items-center"
                >
                    <Trash2 size={16} className="mr-1" /> Xóa lịch sử
                </button>
            )}
          </div>
          
          {scores.length === 0 ? (
            <div className="p-10 text-center text-gray-500">
                <p>Chưa có dữ liệu thi.</p>
                <Link to="/" className="text-military-600 font-medium hover:underline mt-2 inline-block">
                    Quay lại trang chủ để tham gia tìm hiểu
                </Link>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {scores.map((record, index) => {
                const percentage = (record.score / record.total) * 100;
                let rankColor = 'text-gray-500';
                if (percentage === 100) rankColor = 'text-yellow-500';
                else if (percentage >= 80) rankColor = 'text-gray-400'; // silver-ish
                else if (percentage >= 50) rankColor = 'text-orange-400'; // bronze-ish

                return (
                  <li key={index}>
                    <div className="px-4 py-4 sm:px-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className={`mr-4 ${rankColor}`}>
                                <Medal size={28} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-military-700 truncate">
                                    {record.periodName}
                                </p>
                                <p className="flex items-center text-xs text-gray-500 mt-1">
                                    <Calendar size={12} className="mr-1" />
                                    {record.date}
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                {record.score} / {record.total}
                            </div>
                            <span className="text-xs text-gray-400 mt-1">
                                {percentage.toFixed(0)}% Chính xác
                            </span>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;