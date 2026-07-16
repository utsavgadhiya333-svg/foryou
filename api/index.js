const { createClient } = require('@supabase/supabase-js');

// આ તમારા પ્રોજેક્ટની સાચી URL અને તમારી નવી જનરેટ કરેલી Service Role Key છે
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

    // ડેટાબેઝમાંથી કી તપાસો
    const { data, error } = await supabase
      .from('key_data')
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