import React, { useState } from 'react';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // 権限チェック
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (profile?.role !== 'admin') {
        await supabase.auth.signOut();
        throw new Error('このアカウントには管理者権限がありません。');
      }

      // 強制的に管理ダッシュボード（App.jsxで分岐）へ
      // リロードすることでApp.jsxの権限チェックを確実に走らせる
      window.location.href = '/'; 
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-xl">
        <div className="text-center mb-8">
            <h1 className="text-xl font-bold text-gray-600">STAFF ONLY</h1>
            <h2 className="text-3xl font-bold mt-2">運営管理ログイン</h2>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="admin-email" className="block text-sm font-bold text-gray-700 mb-1">管理者ID (Email)</label>
            <input
              id="admin-email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 outline-none"
              required
            />
          </div>
          <div>
            <label htmlFor="admin-password" className="block text-sm font-bold text-gray-700 mb-1">パスワード</label>
            <input
              id="admin-password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 outline-none"
              required
            />
          </div>

          {message && <p className="text-red-500 text-sm font-bold">{message}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white font-bold py-3 rounded hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {loading ? '認証中...' : '管理画面へログイン'}
          </button>
        </form>
        <div className="mt-6 text-center">
            <a href="/" className="text-sm text-gray-400 hover:text-gray-600">← ユーザー画面へ戻る</a>
        </div>
      </div>
    </div>
  );
}
