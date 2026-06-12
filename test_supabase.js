import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bumalccojyksnjyiujre.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1bWFsY2Nvanlrc25qeWl1aXJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyOTU0NDMsImV4cCI6MjA5Njg3MTQ0M30.W_gla06GYhZqOQUueZuJW1ABjAsz2vA5h4Hl677ieG0';
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log('Testing institutions...');
  const res1 = await supabase.from('institutions').select('*');
  console.log('res1:', res1);

  console.log('Testing settings...');
  const res2 = await supabase.from('settings').select('*').eq('id', 1).single();
  console.log('res2:', res2);
}

test();
