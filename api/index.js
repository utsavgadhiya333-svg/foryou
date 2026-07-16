const { createClient } = require('@supabase/supabase-js');

// તમારી સાચી URL અને Service Role Key અહીં મૂકો
const supabase = createClient(
  'https://sakhfcumtkkgxuwiyqzk.supabase.co', 
  'તમારી_નવી_SERVICE_ROLE_KEY_અહીં_મૂકો' 
);

export default async function handler(req, res) {
  const { action, key } = req.query;

  if (action === 'validate') {
    if (!key) {
      return res.status(400).json({ status: "error", message: "Key is missing" });
    }

    // URL માંથી મળેલી key ને નંબર (Integer) માં ફેરવો
    const keyNumber = parseInt(key);

    // ડેટાબેઝમાંથી કી તપાસો
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
