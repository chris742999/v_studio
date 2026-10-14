
import { createClient } from "@supabase/supabase-js";
import { pool } from "./db.js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

const supabase =
  supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      })
    : null;

export async function authenticateUser(req, res, next) {
  try {
    if (!supabase) {
      return res.status(500).json({
        error: "Authentication is not configured.",
      });
    }

    const authorization = req.headers.authorization;

    if (!authorization?.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Authentication required.",
      });
    }

    const token = authorization.slice(7).trim();

    if (!token) {
      return res.status(401).json({
        error: "Authentication token is missing.",
      });
    }

    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      return res.status(401).json({
        error: "Invalid or expired authentication token.",
      });
    }

    req.user = data.user;
    next();
  } catch (error) {
    console.error("Authentication failed:", error.message);

    return res.status(500).json({
      error: "Unable to verify authentication.",
    });
  }
}

export async function requireAdmin(req, res, next) {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        error: "Authentication required.",
      });
    }

    const result = await pool.query(
      `SELECT id, role
       FROM public.admin_users
       WHERE auth_user_id = $1
       LIMIT 1`,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(403).json({
        error: "Administrator access required.",
      });
    }

    req.admin = result.rows[0];
    next();
  } catch (error) {
    console.error("Admin authorization failed:", error.message);

    return res.status(500).json({
      error: "Unable to verify administrator access.",
    });
  }
}
