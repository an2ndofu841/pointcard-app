const { createClient } = require('@supabase/supabase-js');
require('dotenv').config(); // 環境変数読み込み

const supabaseUrl = 'https://hvbgvqsuilpkehyhbjsc.supabase.co';
// admin作成にはservice_roleキーが必要ですが、クライアント側には公開できません。
// ここでは開発用スクリプトとして、anonキーを使って通常のサインアップを行い、
// その後、SQLエディタで手動で権限付与してもらう形を取るか、
// または「誰でも最初はadminになれる」バックドアを作るかですが、
// 最も安全で確実なのは「通常のサインアップ」→「SQLで権限変更」の流れをスクリプト化することです。

// ただし、今回はNode.jsスクリプトから管理者を作成しようとしていますが、
// SupabaseのService Role Keyがないと、プログラムから勝手にデータを書き換える（roleをadminにする）ことはできません（RLSのため）。

console.log(`
=========================================
管理者アカウント作成手順
=========================================

セキュリティ上、クライアントアプリから勝手に管理者を作成することはできません。
以下の手順で作成してください。

1. アプリの画面 (http://localhost:8080/login) から、
   新しいメールアドレス（例: admin@example.com）で「登録」を行ってください。

2. SupabaseのSQL Editor (https://supabase.com/dashboard/project/hvbgvqsuilpkehyhbjsc/sql) で
   以下のSQLを実行してください。

   UPDATE profiles
   SET role = 'admin'
   WHERE email = 'admin@example.com'; -- 登録したメールアドレス

=========================================
`);

