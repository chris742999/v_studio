
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Camera,
  Eye,
  EyeOff,
  LockKeyhole,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import "./AdminLogin.css";

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (signInError) {
        throw signInError;
      }

      if (!data.session) {
        throw new Error(
          "Login succeeded, but no session was created."
        );
      }

      const user = data.session.user;

      // Customers using a temporary password must change it first.
      if (user.app_metadata?.must_change_password === true) {
        navigate("/change-password", { replace: true });
        return;
      }

      const headers = {
        Authorization: `Bearer ${data.session.access_token}`,
      };

      // First, check whether the account is an administrator.
      const adminResponse = await fetch("/api/admin/bookings", {
        headers,
      });

      if (adminResponse.ok) {
        navigate("/admin", { replace: true });
        return;
      }

      if (
        adminResponse.status !== 401 &&
        adminResponse.status !== 403
      ) {
        throw new Error(
          "Unable to verify your account permissions. Please try again."
        );
      }

      // If not an admin, verify the customer account through the backend.
      const customerResponse = await fetch(
        "/api/auth/customer-session",
        { headers }
      );

      const customerResult = await customerResponse.json();

      if (!customerResponse.ok) {
        if (
          customerResult.code === "PASSWORD_CHANGE_REQUIRED"
        ) {
          navigate("/change-password", { replace: true });
          return;
        }

        throw new Error(
          customerResult.error ||
            "This account is not authorized to access the customer dashboard."
        );
      }

      navigate("/customer", { replace: true });
    } catch (err) {
      setError(
        err.message === "Invalid login credentials"
          ? "Incorrect email or password."
          : err.message ||
            "Unable to sign in. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="admin-login-page">
      <section className="admin-login-card">
        <a href="/" className="admin-login-brand">
          <span className="admin-login-logo">
            <Camera size={24} />
          </span>

          <span>
            <strong>VISIONARY</strong>
            <small>STUDIOS</small>
          </span>
        </a>

        <div className="admin-login-heading">
          <span className="admin-login-eyebrow">
            <LockKeyhole size={14} />
            SECURE ACCOUNT ACCESS
          </span>

          <h1>Welcome back.</h1>
          <p>Sign in to manage your studio and bookings.</p>
        </div>

        <form
          className="admin-login-form"
          onSubmit={handleSubmit}
        >
          <label htmlFor="admin-email">Email address</label>
          <input
            id="admin-email"
            type="email"
            autoComplete="username"
            placeholder="Enter your email address"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label htmlFor="admin-password">Password</label>

          <div className="admin-login-password">
            <input
              id="admin-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword((visible) => !visible)
              }
              aria-label={
                showPassword ? "Hide password" : "Show password"
              }
            >
              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>

          {error && (
            <p className="admin-login-error" role="alert">
              {error}
            </p>
          )}

          <button
            className="admin-login-submit"
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in to dashboard"}
          </button>
        </form>

        <p className="admin-login-footer">
          Authorized Visionary Studios accounts only.
        </p>
      </section>
    </main>
  );
}

export default AdminLogin;
