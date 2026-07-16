const { createClient } = require('@supabase/supabase-js');

// અહીં તમારી સાચી URL અને Service Role Key મૂકો
const supabase = createClient(
  'https://zfwtavhtopzqdxemearc.supabase.co', 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNha2hmY3VtdGtrZ3h1d2l5cXprIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDEwNDU4MywiZXhwIjoyMDk5NjgwNTgzfQ.PFA7ACXpV8XGU6Ic8WDwG6A2AHC0UP0iCRQJC9jfbw0' 
);

export default async function handler(req, res) {
  const { action, key } = req.query;

  if (action === 'validate') {
    if (!key) {
      return res.status(400).json({ status: "error", message: "Key is missing" });
    }

    const { data, error } = await supabase
      .from('key')
      .select('*')
      .eq('key', key)
      .single();

    if (data) {
      return res.status(200).json({ status: "success", message: "Key is valid" });
    } else {
      return res.status(401).json({ status: "error", message: "Invalid key" });
    }
  }

  return res.status(400).json({ status: "error", message: "Invalid action" });
}