const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');

const app = express();
const port = 8080;

const supabaseUrl = 'https://hvbgvqsuilpkehyhbjsc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2Ymd2cXN1aWxwa2VoeWhianNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1ODUzNjksImV4cCI6MjA4MDE2MTM2OX0.TBvoHS52-baNKt5iWfEtvZnJPxj1j3cZsoSv6PZhnss';
const supabase = createClient(supabaseUrl, supabaseKey);

app.use(express.static('public'));

app.get('/api/cards', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('point_cards')
      .select('*');
    
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Expressのバージョンとpath-to-regexpのバージョンの不整合を避けるため、
// 正規表現オブジェクトを直接渡すか、最新の書き方に合わせる
app.get(/^(?!\/api).+/, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${port}`);
});
