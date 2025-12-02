import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hvbgvqsuilpkehyhbjsc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2Ymd2cXN1aWxwa2VoeWhianNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1ODUzNjksImV4cCI6MjA4MDE2MTM2OX0.TBvoHS52-baNKt5iWfEtvZnJPxj1j3cZsoSv6PZhnss';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true, // セッションを永続化する（デフォルトtrueだが明示）
    autoRefreshToken: true, // トークンを自動更新する
    detectSessionInUrl: true // URLリダイレクト後のセッション復元を有効化
  }
});
