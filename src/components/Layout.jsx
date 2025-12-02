import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, LogOut, QrCode, User, WalletCards } from 'lucide-react';

export function Navbar({ user, role, onLogout }) {
  if (!user) return null;

  return (
    <nav className="bg-white border-b border-gray-100 fixed top-0 w-full z-50">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold">
            ID
          </div>
          <span className="font-bold text-gray-800">IdolPoint</span>
        </div>

        <div className="flex items-center gap-4">
          {role === 'admin' && (
            <Link to="/scan" className="p-2 text-gray-600 hover:bg-gray-50 rounded-full">
              <QrCode size={20} />
            </Link>
          )}
          <button 
            onClick={onLogout} 
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
}

export function BottomNav({ role }) {
  return (
    <div className="fixed bottom-0 w-full bg-white border-t border-gray-100 pb-safe">
      <div className="flex justify-around max-w-4xl mx-auto">
        <Link to="/" className="flex flex-col items-center py-3 px-4 text-gray-600 hover:text-purple-600">
          <User size={24} />
          <span className="text-[10px] mt-1 font-medium">マイページ</span>
        </Link>
        {role === 'admin' ? (
          <Link to="/scan" className="flex flex-col items-center py-3 px-4 text-gray-600 hover:text-purple-600">
            <div className="bg-purple-600 text-white p-3 rounded-full -mt-8 shadow-lg border-4 border-white">
              <QrCode size={24} />
            </div>
            <span className="text-[10px] mt-1 font-medium">スキャン</span>
          </Link>
        ) : (
          <Link to="/cards" className="flex flex-col items-center py-3 px-4 text-gray-600 hover:text-purple-600">
            <WalletCards size={24} />
            <span className="text-[10px] mt-1 font-medium">カード</span>
          </Link>
        )}
        <div className="flex flex-col items-center py-3 px-4 text-gray-300">
          <LayoutDashboard size={24} />
          <span className="text-[10px] mt-1 font-medium">メニュー</span>
        </div>
      </div>
    </div>
  );
}

