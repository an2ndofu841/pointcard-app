import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabase';
import { Navbar, BottomNav } from '../../components/Layout';
import { Plus, Trash2 } from 'lucide-react';

export default function AdminRewards({ user }) {
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [points, setPoints] = useState(10);
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchRewards();
  }, []);

  const fetchRewards = async () => {
    const { data } = await supabase.from('rewards').select('*').order('points_required');
    setRewards(data || []);
    setLoading(false);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('rewards').insert({
        title,
        description,
        points_required: points
    });
    
    if (!error) {
        setTitle('');
        setDescription('');
        setPoints(10);
        fetchRewards();
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('削除しますか？')) return;
    await supabase.from('rewards').delete().eq('id', id);
    fetchRewards();
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
        <Navbar user={user} role="admin" onLogout={() => {}} />
        
        <div className="max-w-md mx-auto p-6 pt-24">
            <h1 className="text-2xl font-bold mb-6">景品管理</h1>

            {/* 追加フォーム */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                    <Plus size={18} />
                    新規追加
                </h3>
                <form onSubmit={handleAdd} className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">景品名</label>
                        <input 
                            className="w-full border p-2 rounded-lg mt-1"
                            value={title} onChange={e => setTitle(e.target.value)} required
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">必要ポイント</label>
                        <input 
                            type="number" className="w-full border p-2 rounded-lg mt-1"
                            value={points} onChange={e => setPoints(Number(e.target.value))} required
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">説明</label>
                        <input 
                            className="w-full border p-2 rounded-lg mt-1"
                            value={description} onChange={e => setDescription(e.target.value)}
                        />
                    </div>
                    <button className="w-full bg-black text-white py-3 rounded-xl font-bold">追加する</button>
                </form>
            </div>

            {/* 一覧 */}
            <div className="space-y-4">
                {rewards.map(reward => (
                    <div key={reward.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                        <div>
                            <h4 className="font-bold">{reward.title}</h4>
                            <p className="text-sm text-purple-600 font-bold">{reward.points_required} pt</p>
                        </div>
                        <button 
                            onClick={() => handleDelete(reward.id)}
                            className="p-2 text-red-400 hover:bg-red-50 rounded-full"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
        <BottomNav role="admin" />
    </div>
  );
}

