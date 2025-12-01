import { createClient } from '@supabase/supabase-js';

// 環境変数を使いたいが、今はハードコードで確実に動かす
const supabaseUrl = 'https://hvbgvqsuilpkehyhbjsc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2Ymd2cXN1aWxwa2VoeWhianNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1ODUzNjksImV4cCI6MjA4MDE2MTM2OX0.TBvoHS52-baNKt5iWfEtvZnJPxj1j3cZsoSv6PZhnss';

export const supabase = createClient(supabaseUrl, supabaseKey);

