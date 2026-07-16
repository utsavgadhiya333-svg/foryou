const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://sakhfcumtkkgxuwiyqzk.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNha2hmY3VtdGtrZ3h1d2l5cXprIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDEwNDU4MywiZXhwIjoyMDk5NjgwNTgzfQ.PFA7ACXpV8XGU6Ic8WDwG6A2AHC0UP0iCRQJC9jfbw0'
);

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { action, key } = req.query;

  // ✅ Test Connection
  if (action === 'test') {
    try {
      const { data, error } = await supabase
        .from('key')
        .select('*')
        .limit(1);

      if (error) {
        console.error("Supabase Error:", error);
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

    } catch (err) {
      console.error("Server Error:", err);
      return res.status(500).json({ 
        status: "error", 
        message: "Internal server error",
        details: err.message 
      });
    }
  }

  // ✅ Validate Key
  if (action === 'validate') {
    if (!key) {
      return res.status(400).json({ status: "error", message: "Key is missing" });
    }

    try {
      const { data, error } = await supabase
        .from('key')
        .select('*')
        .eq('key', key)
        .single();

      if (error) {
        console.error("Supabase Error:", error);
        return res.status(500).json({ 
          status: "error", 
          message: "Database error",
          details: error.message 
        });
      }

      if (data) {
        // Check expiry
        let isValid = true;
        let reason = "valid";

        if (data.expiry) {
          const expiryDate = new Date(data.expiry);
          const today = new Date();
          if (expiryDate < today) {
            isValid = false;
            reason = "expired";
          }
        }

        // Check device limit (max 2)
        const devices = data.devices || [];
        if (devices.length >= 2) {
          isValid = false;
          reason = "max_devices";
        }

        if (isValid) {
          return res.status(200).json({ 
            status: "success", 
            message: "Key is valid",
            data: data 
          });
        } else {
          return res.status(401).json({ 
            status: "error", 
            message: "Invalid key",
            reason: reason 
          });
        }
      } else {
        return res.status(401).json({ status: "error", message: "Invalid key" });
      }

    } catch (err) {
      console.error("Server Error:", err);
      return res.status(500).json({ 
        status: "error", 
        message: "Internal server error",
        details: err.message 
      });
    }
  }

  // ✅ Add Key
  if (action === 'add') {
    const { key, expiry } = req.query;

    if (!key) {
      return res.status(400).json({ status: "error", message: "Key is missing" });
    }

    try {
      const { data, error } = await supabase
        .from('key')
        .insert([
          { 
            key: key, 
            expiry: expiry || null, 
            devices: [],
            status: 'active'
          }
        ]);

      if (error) {
        console.error("Insert Error:", error);
        return res.status(500).json({ status: "error", message: "Failed to add key" });
      }

      return res.status(200).json({ status: "success", message: "Key added successfully" });

    } catch (err) {
      console.error("Server Error:", err);
      return res.status(500).json({ status: "error", message: "Internal server error" });
    }
  }

  // ✅ Delete Key
  if (action === 'delete') {
    const { key } = req.query;

    if (!key) {
      return res.status(400).json({ status: "error", message: "Key is missing" });
    }

    try {
      const { data, error } = await supabase
        .from('key')
        .delete()
        .eq('key', key);

      if (error) {
        console.error("Delete Error:", error);
        return res.status(500).json({ status: "error", message: "Failed to delete key" });
      }

      return res.status(200).json({ status: "success", message: "Key deleted successfully" });

    } catch (err) {
      console.error("Server Error:", err);
      return res.status(500).json({ status: "error", message: "Internal server error" });
    }
  }

  // ✅ Register Device
  if (action === 'register') {
    const { key, deviceId } = req.query;

    if (!key || !deviceId) {
      return res.status(400).json({ status: "error", message: "Key or Device ID missing" });
    }

    try {
      const { data, error } = await supabase
        .from('key')
        .select('*')
        .eq('key', key)
        .single();

      if (error || !data) {
        return res.status(404).json({ status: "error", message: "Key not found" });
      }

      let devices = data.devices || [];
      
      if (devices.includes(deviceId)) {
        return res.status(200).json({ status: "success", message: "Device already registered" });
      }

      if (devices.length >= 2) {
        return res.status(400).json({ status: "error", message: "Max devices reached (2)" });
      }

      devices.push(deviceId);

      const { error: updateError } = await supabase
        .from('key')
        .update({ devices: devices })
        .eq('key', key);

      if (updateError) {
        console.error("Update Error:", updateError);
        return res.status(500).json({ status: "error", message: "Failed to register device" });
      }

      return res.status(200).json({ 
        status: "success", 
        message: "Device registered successfully",
        devices: devices 
      });

    } catch (err) {
      console.error("Server Error:", err);
      return res.status(500).json({ status: "error", message: "Internal server error" });
    }
  }

  return res.status(400).json({ status: "error", message: "Invalid action" });
}