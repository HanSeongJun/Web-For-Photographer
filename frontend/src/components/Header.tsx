import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Left Section - Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-black">
              WebFroPhto
            </Link>
          </div>

          {/* Center Section - Navigation */}
          <nav className="hidden md:flex space-x-8 absolute left-1/2 transform -translate-x-1/2">
            <Link to="/map" className="text-gray-700 hover:text-black transition-colors">
              지도
            </Link>
            <Link to="/best" className="text-gray-700 hover:text-black transition-colors">
              포토스팟
            </Link>
            <Link to="/weather" className="text-gray-700 hover:text-black transition-colors">
              날씨
            </Link>
          </nav>

          {/* Right Section - Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-2 rounded-full border border-blue-200">
                  {user?.profileImageUrl ? (
                    <img 
                      src={user.profileImageUrl} 
                      alt="프로필" 
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">
                        {user?.nickname?.charAt(0) || 'U'}
                      </span>
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-500">안녕하세요!</span>
                    <span className="text-sm font-medium text-gray-800">
                      {user?.nickname}님
                    </span>
                  </div>
                </div>
                <Link to="/mypage" className="btn-secondary">
                  마이페이지
                </Link>
                <button onClick={handleLogout} className="btn-primary">
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-secondary">
                  로그인
                </Link>
                <Link to="/signup" className="btn-primary">
                  회원가입
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg border border-gray-200 hover:bg-gray-50"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <Link to="/map" className="text-gray-700 hover:text-black transition-colors">
                지도
              </Link>
              <Link to="/best" className="text-gray-700 hover:text-black transition-colors">
                포토스팟
              </Link>
              <Link to="/weather" className="text-gray-700 hover:text-black transition-colors">
                날씨
              </Link>
            </nav>
            <div className="mt-4 pt-4 border-t border-gray-200">
              {isAuthenticated ? (
                <div className="flex flex-col space-y-4">
                  <span className="text-gray-700 text-center">
                    안녕하세요, {user?.nickname}님!
                  </span>
                  <Link to="/mypage" className="btn-secondary text-center">
                    마이페이지
                  </Link>
                  <button onClick={handleLogout} className="btn-primary w-full">
                    로그아웃
                  </button>
                </div>
              ) : (
                <div className="flex space-x-4">
                  <Link to="/login" className="btn-secondary flex-1 text-center">
                    로그인
                  </Link>
                  <Link to="/signup" className="btn-primary flex-1 text-center">
                    회원가입
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
