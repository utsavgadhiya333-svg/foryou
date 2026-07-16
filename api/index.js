const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://sakhfcumtkkgxuwiyqzk.supabase.co', 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNha2hmY3VtdGtrZ3h1d2l5cXprIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDI2OTAyNX0.t9Nl48GkSj2bC32G5Gj2W6K83xO3_j9gYnN_y23V8kM' 
);

export default async function handler(req, res) {
  const { action, key } = req.query;

  if (action === 'validate') {
    if (!key) {
      return res.status(400).json({ status: "error", message: "Key is missing" });
    }

    const keyNumber = parseInt(key);

    const { data, error } = await supabase
      .from('key')
      .select('*')
      .eq('key', keyNumber)
      .single();

    if (data) {
      return res.status(200).json({ status: "success", message: "Key is valid" });
    } else {
      return res.status(401).json({ status: "error", message: "Invalid key" });
    }
  }

  return res.status(400).json({ status: "error", message: "Invalid action" });
}
