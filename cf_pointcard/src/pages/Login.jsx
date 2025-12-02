import React, { useState } from 'react';
import { supabase } from '../supabase';
import { ArrowRight, Lock, Mail, User } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [message, setMessage] = useState('');
  
  // デバッグ用ログ
  const [debugLogs, setDebugLogs] = useState([]);
  const addLog = (msg) => setDebugLogs(prev => [...prev, `${new Date().toLocaleTimeString()} ${msg}`]);

  const handleAuth = async () => {
    if (!email || !password) {
        setMessage('メールアドレスとパスワードを入力してください');
        return;
    }

    setLoading(true);
    setMessage('');
    setDebugLogs([]); // ログクリア
    addLog('処理開始: ボタンクリック');

    try {
      if (isSignUp) {
        addLog('SignUp処理開始');
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        addLog('SignUp成功');
        setMessage('確認メールを送信しました');
      } else {
        addLog('SignIn処理開始: supabase呼び出し');
        
        // タイムアウト付きでSignInを実行
        const signInPromise = supabase.auth.signInWithPassword({ email, password });
        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000));

        try {
            const { error } = await Promise.race([signInPromise, timeoutPromise]);
            if (error) throw error;
            addLog('SignIn成功: 応答あり');
        } catch (err) {
            if (err.message === 'Timeout') {
                addLog('SignInタイムアウト: 強制確認へ');
            } else {
                throw err;
            }
        }

        addLog('セッション確認中...');
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
            addLog('セッションあり: 遷移を実行します');
            setMessage('ログイン成功！遷移します...');
            setTimeout(() => {
                addLog('window.location.href = "/" 実行');
                window.location.href = '/';
            }, 500);
        } else {
            addLog('エラー: セッションが取得できません');
            throw new Error('ログインに失敗しました（セッションなし）');
        }
      }
    } catch (error) {
      addLog(`エラー発生: ${error.message}`);
      setMessage(error.message);
    } finally {
      setLoading(false);
      addLog('処理終了(finally)');
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
            {isSignUp ? 'アカウント作成' : 'おかえりなさい v1.0.2'}
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            {isSignUp ? 'ファン登録してポイントを貯めよう' : 'ログインしてカードを確認'}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-gray-500 uppercase mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold text-gray-500 uppercase mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {message && (
              <div className="p-3 bg-red-50 text-red-500 text-sm rounded-lg text-center">
                {message}
              </div>
            )}

            {/* デバッグログ表示エリア（無条件表示・赤帯） */}
            <div style={{
                position: 'fixed', top: 0, left: 0, width: '100%', background: 'red', color: 'white',
                padding: '10px', zIndex: 99999, fontSize: '14px', fontWeight: 'bold'
            }}>
                DEBUG MODE: v1.0.3<br/>
                LOGS: {debugLogs.length}件<br/>
                {debugLogs.map((log, i) => <div key={i}>{log}</div>)}
            </div>

            <button
              type="button"
              onClick={handleAuth}
              disabled={loading}
              className="relative z-50 w-full bg-gray-900 text-white py-4 rounded-xl font-bold shadow-lg shadow-gray-900/20 hover:bg-black hover:shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              {loading ? 'Loading...' : (isSignUp ? 'Create Account' : 'Sign In')}
              {!loading && <ArrowRight size={20} />}
            </button>
          </div>
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
