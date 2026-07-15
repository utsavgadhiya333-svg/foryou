const { createClient } = require('@supabase/supabase-js');

// આ તમારા પ્રોજેક્ટની કાયમી વિગતો છે
const supabase = createClient(
  'https://zfwtavhtopzqdxemearc.supabase.co', 
  'sb_publishable_QBPWSQW1JsM0JDHfIEOV2g_LjYw6wwW' 
  // નોંધ: મેં અહીં placeholder મૂક્યું છે, તમારી વાસ્તવિક sb_secret_ કી આની જગ્યાએ મૂકજો.
);

export default async function handler(req, res) {
  const { action, key } = req.query;

  // જો action 'validate' હોય તો જ કી ચેક કરો
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