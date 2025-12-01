import React, { useState } from 'react';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Lock, Mail, User } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage('確認メールを送信しました');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate('/');
      }
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center p-6">
      <div className="max-w-md w-full mx-auto">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-500 rounded-2xl mx-auto flex items-center justify-center text-white text-2xl font-bold shadow-lg mb-4">
            ID
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isSignUp ? 'アカウント作成' : 'おかえりなさい'}
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            {isSignUp ? 'ファン登録してポイントを貯めよう' : 'ログインしてカードを確認'}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8">
          <form onSubmit={handleAuth} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {message && (
              <div className="p-3 bg-red-50 text-red-500 text-sm rounded-lg text-center">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold shadow-lg shadow-gray-900/20 hover:bg-black hover:shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              {loading ? 'Loading...' : (isSignUp ? 'Create Account' : 'Sign In')}
              {!loading && <ArrowRight size={20} />}
            </button>
          </form>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-gray-500 text-sm hover:text-gray-900 font-medium"
          >
            {isSignUp ? 'すでにアカウントをお持ちですか？' : 'アカウントをお持ちでない場合'}
          </button>
        </div>
        
        {!isSignUp && (
            <div className="mt-8 text-center border-t border-gray-200 pt-8">
                <a href="/admin/login" className="text-xs text-gray-400 hover:text-gray-600 flex items-center justify-center gap-1">
                    <User size={12} />
                    運営関係者はこちら
                </a>
            </div>
        )}
      </div>
    </div>
  );
}
