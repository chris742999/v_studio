
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Camera, LockKeyhole } from "lucide-react";
import { supabase } from "../lib/supabase";
import "./AdminLogin.css";

function ChangePassword() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (password.length < 12) {
      setError("Your new password must contain at least 12 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("The passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) throw sessionError;

      if (!session) {
        navigate("/login", { replace: true });
        return;
      }

      const response = await fetch(
        "http://localhost:3001/api/auth/change-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ password }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to change your password.");
      }

      setSuccess("Password updated. Please sign in again.");

      await supabase.auth.signOut();

      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1500);
    } catch (err) {
      setError(err.message || "Unable to change your password.");
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
            ACCOUNT SECURITY
          </span>

          <h1>Set a new password.</h1>
          <p>
            For your security, replace your temporary password before
            continuing to your dashboard.
          </p>
        </div>

        <form className="admin-login-form" onSubmit={handleSubmit}>
          <label htmlFor="new-password">New password</label>
          <input
            id="new-password"
            type="password"
            autoComplete="new-password"
            placeholder="At least 12 characters"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            minLength={12}
            required
          />

          <label htmlFor="confirm-password">Confirm new password</label>
          <input
            id="confirm-password"
            type="password"
            autoComplete="new-password"
            placeholder="Enter your new password again"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            minLength={12}
            required
          />

          {error && (
            <p className="admin-login-error" role="alert">
              {error}
            </p>
          )}

          {success && (
            <p role="status">
              {success}
            </p>
          )}

          <button
            className="admin-login-submit"
            type="submit"
            disabled={loading}
          >
            {loading ? "Updating password..." : "Update password"}
          </button>
        </form>

        <p className="admin-login-footer">
          Keep your password private and never share it with anyone.
        </p>
      </section>
    </main>
  );
}

export default ChangePassword;
