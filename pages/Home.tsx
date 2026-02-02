import React from 'react';
import { Link } from 'react-router-dom';
import { PERIODS } from '../constants';
import { Star, ChevronRight } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-military-900 text-white py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
             <img src="https://picsum.photos/1920/1080?grayscale&blur=2" alt="Hero Background" className="w-full h-full object-cover" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center space-y-6">
          <div className="flex justify-center mb-4">
             <Star className="text-yellow-500 fill-current w-16 h-16 animate-pulse" />
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-yellow-500 drop-shadow-lg">
            SƯ ĐOÀN 324
          </h1>
          <h2 className="text-xl md:text-2xl font-light tracking-widest uppercase border-t border-b border-gray-600 py-2 inline-block">
            Đoàn Ngự Bình - Anh Hùng Lực Lượng Vũ Trang
          </h2>
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto mt-6 font-serif">
            Khám phá hành trình hơn 60 năm xây dựng, chiến đấu và trưởng thành của Sư đoàn 324. 
            Một hành trình viết bằng máu và hoa, góp phần tô thắm trang sử vàng của Quân đội Nhân dân Việt Nam.
          </p>
        </div>
      </div>

      {/* Timeline Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
           <h3 className="text-3xl font-bold text-military-800 font-serif">Các Giai Đoạn Lịch Sử</h3>
           <div className="w-24 h-1 bg-yellow-500 mx-auto mt-4"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {PERIODS.map((period, index) => (
            <Link 
              to={`/period/${period.id}`} 
              key={period.id}
              className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full transform hover:-translate-y-2"
            >
              <div className="relative h-48 overflow-hidden">
                <div className="absolute top-0 left-0 bg-yellow-500 text-military-900 font-bold px-3 py-1 rounded-br-lg z-10 text-sm">
                  Giai đoạn {index + 1}
                </div>
                <img 
                  src={period.image} 
                  alt={period.title} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-3 left-3 text-white">
                  <p className="text-sm font-medium opacity-90">{period.years}</p>
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-1">
                <h4 className="text-xl font-bold text-military-800 mb-3 group-hover:text-yellow-600 transition-colors font-serif">
                  {period.title}
                </h4>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">
                  {period.shortDescription}
                </p>
                <div className="flex items-center text-military-600 font-medium text-sm mt-auto group-hover:translate-x-1 transition-transform">
                   <span>Tìm hiểu thêm</span>
                   <ChevronRight size={16} className="ml-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;