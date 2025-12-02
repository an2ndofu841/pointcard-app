import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabase';
import { Navbar, BottomNav } from '../../components/Layout';
import { Ticket, Gift, AlertCircle } from 'lucide-react';

export default function Rewards({ user }) {
  const [rewards, setRewards] = useState([]);
  const [userPoints, setUserPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [exchanging, setExchanging] = useState(null);

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    // 1. ユーザーの総ポイント数を計算（簡易版：トランザクションの合計）
    const { data: transactions } = await supabase
        .from('point_transactions')
        .select('points_change')
        // .eq('user_id', user.id) // 本来はuser_card経由だが、簡易的に全トランザクションから計算（RLSで自分のしか取れない前提）
        // 実際には user_cards テーブルの current_points を見るのが正しい
    
    // user_cardsからポイント取得
    const { data: userCards } = await supabase
        .from('user_cards')
        .select('current_points')
        .eq('user_id', user.id);
        
    const totalPoints = userCards?.reduce((sum, card) => sum + card.current_points, 0) || 0;
    setUserPoints(totalPoints);

    // 2. 景品一覧を取得
    const { data: rewardsData } = await supabase
        .from('rewards') // まだテーブルがないので作成が必要
        .select('*')
        .order('points_required', { ascending: true });
    
    setRewards(rewardsData || []);
    setLoading(false);
  };

  const handleExchange = async (reward) => {
    if (!window.confirm(`${reward.title}と交換しますか？\n消費ポイント: ${reward.points_required}pt`)) return;
    
    setExchanging(reward.id);
    
    // 交換処理
    // 1. ポイント減算 (Transaction追加)
    const { error } = await supabase
        .from('point_transactions')
        .insert({
            points_change: -reward.points_required,
            description: `景品交換: ${reward.title}`,
            // user_card_id: ... どのカードから引くか？本来は選択させる
        });

    if (error) {
        alert('交換に失敗しました: ' + error.message);
    } else {
        alert('交換しました！スタッフに画面を提示してください。');
        fetchData(); // 更新
    }
    setExchanging(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
        <Navbar user={user} role="user" onLogout={() => {}} /> {/* Logoutは親から渡すべきだが省略 */}
        
        <div className="max-w-md mx-auto p-6 pt-24">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6 flex justify-between items-center">
                <div>
                    <p className="text-xs text-gray-400 font-bold uppercase">Current Points</p>
                    <p className="text-3xl font-bold text-purple-600">{userPoints} <span className="text-sm text-gray-400">pt</span></p>
                </div>
                <Ticket size={32} className="text-purple-200" />
            </div>

            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Gift size={20} />
                景品交換
            </h2>

            <div className="grid gap-4">
                {loading ? <p>Loading...</p> : rewards.length === 0 ? (
                    <div className="p-8 text-center text-gray-400 bg-white rounded-xl border border-dashed border-gray-200">
                        <AlertCircle className="mx-auto mb-2 opacity-50" />
                        <p>交換できる景品がまだありません</p>
                    </div>
                ) : (
                    rewards.map(reward => (
                        <div key={reward.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                            <div>
                                <h3 className="font-bold text-gray-900">{reward.title}</h3>
                                <p className="text-xs text-gray-500">{reward.description}</p>
                                <p className="text-sm font-bold text-purple-600 mt-1">{reward.points_required} pt</p>
                            </div>
                            <button 
                                onClick={() => handleExchange(reward)}
                                disabled={userPoints < reward.points_required || exchanging === reward.id}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                                    userPoints >= reward.points_required 
                                    ? 'bg-gray-900 text-white hover:bg-black shadow-lg' 
                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                }`}
                            >
                                {exchanging === reward.id ? '...' : '交換'}
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
        <BottomNav role="user" />
    </div>
  );
}

