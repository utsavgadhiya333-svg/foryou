const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://sakhfcumtkkgxuwiyqzk.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNha2hmY3VtdGtrZ3h1d2l5cXprIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDEwNDU4MywiZXhwIjoyMDk5NjgwNTgzfQ.PFA7ACXpV8XGU6Ic8WDwG6A2AHC0UP0iCRQJC9jfbw0'
);

module.exports = async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { action, key } = req.query;

  try {
    // ✅ Test Connection
    if (action === 'test') {
      const { data, error } = await supabase
        .from('key')
        .select('*')
        .limit(1);

      if (error) {
        return res.status(500).json({ 
          status: "error", 
          message: "Database error",
          details: error.message 
        });
      }

      return res.status(200).json({ 
        status: "success", 
        message: "Connected to Supabase!",
        data: data 
      });
    }

    // ✅ Validate Key
    if (action === 'validate') {
      if (!key) {
        return res.status(400).json({ status: "error", message: "Key is missing" });
      }

      const { data, error } = await supabase
        .from('key')
        .select('*')
        .eq('key', key)
        .single();

      if (error) {
        return res.status(500).json({ 
          status: "error", 
          message: "Database error",
          details: error.message 
        });
      }

      if (data) {
        return res.status(200).json({ 
          status: "success", 
          message: "Key is valid",
          data: data 
        });
      } else {
        return res.status(401).json({ status: "error", message: "Invalid key" });
      }
    }

    return res.status(400).json({ status: "error", message: "Invalid action" });

  } catch (err) {
    console.error("Server Error:", err);
    return res.status(500).json({ 
      status: "error", 
      message: "Internal server error",
      details: err.message 
    });
  }
};