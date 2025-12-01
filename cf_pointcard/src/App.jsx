import React, { useEffect, useState, useRef } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import UserRewards from './pages/user/Rewards';
import AdminRewards from './pages/admin/Rewards';
import { supabase } from './supabase';
import { OfflineDB } from './offlineDB';
import { Navbar, BottomNav } from './components/Layout';
import { QrCode, CheckCircle2, Wifi, WifiOff, User, Scan as ScanIcon, X } from 'lucide-react';
import QRCode from 'react-qr-code';
import { Html5QrcodeScanner } from 'html5-qrcode';

function AdminDashboard({ user, handleLogout }) {
    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            <Navbar user={user} role="admin" onLogout={handleLogout} />
            <div className="max-w-md mx-auto p-6 pt-24">
                <div className="bg-black text-white p-6 rounded-2xl shadow-xl mb-8 relative overflow-hidden">
                    <div className="relative z-10">
                        <p className="text-gray-400 text-xs font-bold tracking-wider uppercase mb-1">Admin Console</p>
                        <h1 className="text-2xl font-bold mb-4">運営管理画面</h1>
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                            <User size={16} />
                            {user.email}
                        </div>
                    </div>
                    <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-gray-800 rounded-full opacity-50 blur-2xl"></div>
                </div>
                
                <h2 className="text-lg font-bold text-gray-800 mb-4 px-1">Menu</h2>
                <div className="grid gap-4">
                    <Link to="/scan" className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-all active:scale-[0.98]">
                        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                            <QrCode size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">ポイント付与</h3>
                            <p className="text-xs text-gray-500">QRコード読取またはID入力</p>
                        </div>
                    </Link>
                    <Link to="/admin/rewards" className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-all active:scale-[0.98]">
                        <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
                            <QrCode size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">景品管理</h3>
                            <p className="text-xs text-gray-500">交換アイテムの追加・削除</p>
                        </div>
                    </Link>
                </div>
            </div>
            <BottomNav role="admin" />
        </div>
    );
}

function UserHome({ user, handleLogout }) {
    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            <Navbar user={user} role="user" onLogout={handleLogout} />
            <div className="max-w-md mx-auto p-6 pt-24 text-center">
                <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 mb-8 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 to-pink-500"></div>
                    <h2 className="text-gray-400 text-xs font-bold tracking-widest uppercase mb-6">Member ID</h2>
                    <div className="bg-white p-4 rounded-xl inline-block mb-6 shadow-inner border border-gray-100">
                        <div style={{ height: "auto", margin: "0 auto", maxWidth: 150, width: "100%" }}>
                            <QRCode
                                size={256}
                                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                value={user.id}
                                viewBox={`0 0 256 256`}
                            />
                        </div>
                    </div>
                    <p className="text-xs text-gray-400 mb-2">Your ID Code</p>
                    <div className="font-mono text-lg font-bold text-gray-800 bg-gray-50 py-2 px-4 rounded-lg break-all select-all">
                        {user.id}
                    </div>
                    <p className="text-xs text-gray-400 mt-4">
                        スタッフにこの画面を提示してください
                    </p>
                </div>

                <div className="grid gap-4">
                    <Link to="/rewards" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-2xl shadow-lg flex items-center justify-between px-6 hover:opacity-90 transition-all active:scale-[0.98]">
                        <div className="text-left">
                            <p className="text-xs font-bold opacity-80 uppercase">Exchange</p>
                            <p className="font-bold text-lg">景品と交換する</p>
                        </div>
                        <div className="bg-white/20 p-2 rounded-full">
                            <QrCode size={24} />
                        </div>
                    </Link>
                </div>
            </div>
            <BottomNav role="user" />
        </div>
    );
}

function useUser() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
        setRole(profile?.role || 'user');
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    };
    fetchUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (!session) { setUser(null); setRole(null); }
    });
    return () => subscription.unsubscribe();
  }, []);
  return { user, role, loading };
}

const AdminRoute = ({ children, role, loading }) => {
  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400 text-sm">Checking permissions...</div>;
  if (role !== 'admin') return <Navigate to="/" replace />;
  return children;
};

function Scan() {
    const [userId, setUserId] = useState('');
    const [points, setPoints] = useState(1);
    const [status, setStatus] = useState('');
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [showScanner, setShowScanner] = useState(false);
  
    useEffect(() => {
        const handleOnline = () => { setIsOnline(true); syncOfflineData(); };
        const handleOffline = () => setIsOnline(false);
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        if (navigator.onLine) syncOfflineData();
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    useEffect(() => {
        if (showScanner) {
            const scanner = new Html5QrcodeScanner(
                "reader", 
                { fps: 10, qrbox: { width: 250, height: 250 } },
                false
            );
            scanner.render((decodedText) => {
                setUserId(decodedText);
                setShowScanner(false);
                scanner.clear();
            }, (error) => {
                // console.warn(error); // Scanning...
            });

            return () => {
                scanner.clear().catch(error => console.error("Failed to clear scanner", error));
            };
        }
    }, [showScanner]);

    const syncOfflineData = async () => {
        const unsynced = await OfflineDB.getUnsyncedTransactions();
        if (unsynced.length > 0) {
            setStatus(`同期中... (${unsynced.length}件)`);
            for (const tx of unsynced) {
                await supabase.from('point_transactions').insert({
                    description: `オフライン付与: ${tx.points}pt`,
                    points_change: tx.points,
                });
                await OfflineDB.markAsSynced(tx.id);
            }
            setStatus('同期完了');
            setTimeout(() => setStatus(''), 2000);
        }
    };
  
    const handleGrant = async (e) => {
      e.preventDefault();
      if (!userId) return;
      setStatus('処理中...');

      if (navigator.onLine) {
          const { error } = await supabase.from('point_transactions').insert({
                description: `ポイント付与: ${points}pt`,
                points_change: points,
            });
          if (error) setStatus('エラー: ' + error.message);
          else {
              setStatus(`${points}pt 付与完了 (オンライン)`);
              setUserId('');
          }
      } else {
          await OfflineDB.addTransaction(userId, points);
          setStatus(`${points}pt 保存完了 (オフライン)`);
          setUserId('');
      }
    };
  
    return (
      <div className="min-h-screen bg-gray-50 pb-24">
        <div className="bg-white border-b border-gray-100 px-6 py-4 pt-12 flex justify-between items-center sticky top-0 z-10">
            <h2 className="font-bold text-lg">ポイント付与</h2>
            <div className={`flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full ${isOnline ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {isOnline ? <Wifi size={14} /> : <WifiOff size={14} />}
                {isOnline ? 'ONLINE' : 'OFFLINE'}
            </div>
        </div>
        
        <div className="p-6 max-w-md mx-auto">
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                
                {showScanner ? (
                    <div className="mb-6">
                        <div id="reader" className="rounded-xl overflow-hidden"></div>
                        <button 
                            onClick={() => setShowScanner(false)}
                            className="w-full mt-2 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold flex items-center justify-center gap-2"
                        >
                            <X size={18} />
                            スキャンを閉じる
                        </button>
                    </div>
                ) : (
                    <button 
                        onClick={() => setShowScanner(true)}
                        className="w-full mb-6 py-4 bg-black text-white rounded-xl font-bold shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                        <ScanIcon size={20} />
                        カメラでQRを読み取る
                    </button>
                )}

                <form onSubmit={handleGrant} className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">User ID</label>
                        <input
                            type="text"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            placeholder="IDを入力またはスキャン"
                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono text-lg"
                            required
                        />
                    </div>
                    
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Points</label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 5, 10].map(pt => (
                                <button
                                    key={pt}
                                    type="button"
                                    onClick={() => setPoints(pt)}
                                    className={`flex-1 py-2 rounded-lg font-bold transition-all ${points === pt ? 'bg-purple-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                >
                                    {pt}
                                </button>
                            ))}
                        </div>
                        <input
                            type="number"
                            value={points}
                            onChange={(e) => setPoints(Number(e.target.value))}
                            className="w-full mt-3 p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 font-bold text-center text-xl"
                            min="1"
                            required
                        />
                    </div>

                    <button type="submit" className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-black active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                        <CheckCircle2 size={20} />
                        ポイントを付与する
                    </button>
                </form>
            </div>

            {status && (
                <div className="mt-4 p-4 bg-blue-50 text-blue-700 rounded-xl text-center text-sm font-bold animate-fade-in">
                    {status}
                </div>
            )}
            
            <Link to="/" className="block text-center mt-8 text-gray-400 text-sm hover:text-gray-600">
                キャンセルして戻る
            </Link>
        </div>
      </div>
    );
}

export default function App() {
  const { user, role, loading } = useUser();

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400 text-sm">Loading...</div>;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
            !user ? <Login /> : 
            (role === 'admin' ? <AdminDashboard user={user} handleLogout={handleLogout} /> : <UserHome user={user} handleLogout={handleLogout} />)
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/scan" element={
            <AdminRoute role={role} loading={loading}><Scan /></AdminRoute>
        } />
        <Route path="/rewards" element={ user ? <UserRewards user={user} /> : <Navigate to="/" /> } />
        <Route path="/admin/rewards" element={
            <AdminRoute role={role} loading={loading}><AdminRewards user={user} /></AdminRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}
