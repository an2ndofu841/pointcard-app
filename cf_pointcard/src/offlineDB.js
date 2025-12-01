import Dexie from 'dexie';

// Dexieデータベースの定義
export const db = new Dexie('OfflinePointDB');

db.version(1).stores({
  transactions: '++id, userId, points, timestamp, synced' // synced: 0=未同期, 1=同期済
});

// データベースアクセスクラス
export const OfflineDB = {
  // トランザクションを追加
  async addTransaction(userId, points) {
    return await db.transactions.add({
      userId,
      points,
      timestamp: new Date().toISOString(),
      synced: 0
    });
  },

  // 未同期のトランザクションを取得
  async getUnsyncedTransactions() {
    return await db.transactions.where('synced').equals(0).toArray();
  },

  // 同期完了としてマーク
  async markAsSynced(id) {
    return await db.transactions.update(id, { synced: 1 });
  }
};

