const { createClient } = require('@supabase/supabase-js');

// અહીં તમારી સાચી URL અને Service Role Key મૂકો
const supabase = createClient(
  'https://zfwtavhtopzqdxemearc.supabase.co', 
  'YOUR_SUPABASE_SERVICE_ROLE_KEY_HERE' 
);

export default async function handler(req, res) {
  const { action, key } = req.query;

  if (action === 'validate') {
    if (!key) {
      return res.status(400).json({ status: "error", message: "Key is missing" });
    }

    const { data, error } = await supabase
      .from('keys')
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