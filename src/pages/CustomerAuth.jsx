
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "./CustomerAuth.css";

export default function CustomerAuth() {
  const navigate = useNavigate();

const [mode, setMode] = useState(
  window.location.pathname === "/login" ? "signin" : "signup"
);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const cleanEmail = email.trim().toLowerCase();

      if (mode === "signup") {
        const { data, error: signupError } =
          await supabase.auth.signUp({
            email: cleanEmail,
            password,
            options: {
              data: {
                full_name: fullName.trim(),
                phone: phone.trim(),
              },
            },
          });

        if (signupError) throw signupError;

        if (!data.user) {
          throw new Error("Account creation failed. Please try again.");
        }

        if (!data.session) {
          setMessage(
            "Account created. Check your email to confirm your account, then sign in."
          );
          setMode("signin");
          return;
        }

        const { error: profileError } = await supabase
          .from("customers")
          .upsert(
            {
              auth_user_id: data.user.id,
              full_name: fullName.trim(),
              email: cleanEmail,
              phone: phone.trim() || null,
            },
            { onConflict: "auth_user_id" }
          );

        if (profileError) {
          console.error(
            "Customer profile creation failed:",
            profileError.message
          );

          throw new Error(
            "Your account was created, but your customer profile could not be saved. Please contact the studio before trying to register again."
          );
        }

        navigate("/customer", { replace: true });
        return;
      }

      const { data, error: signinError } =
        await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

      if (signinError) throw signinError;

      if (!data.user) {
        throw new Error("Sign in failed. Please try again.");
      }

      const { data: profile, error: profileError } = await supabase
        .from("customers")
        .select("id")
        .eq("auth_user_id", data.user.id)
        .maybeSingle();

      if (profileError) throw profileError;

      if (!profile) {
        setError(
          "Your login works, but no customer profile exists for this account. Please contact the studio for assistance."
        );
        await supabase.auth.signOut();
        return;
      }

      navigate("/customer", { replace: true });
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="customer-auth-page">
      <section className="customer-auth-card">
        <Link to="/" className="customer-auth-brand">
          VISIONARY <span>STUDIOS</span>
        </Link>

        <p className="customer-auth-eyebrow">
          YOUR PERSONAL STUDIO EXPERIENCE
        </p>

        <h1>
          {mode === "signup" ? "Create your account" : "Welcome back"}
        </h1>

        <p className="customer-auth-description">
          {mode === "signup"
            ? "Create an account to manage your photography sessions."
            : "Sign in to access your customer dashboard."}
        </p>

        {error && (
          <div className="customer-auth-message error" role="alert">
            {error}
          </div>
        )}

        {message && (
          <div className="customer-auth-message success" role="status">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {mode === "signup" && (
            <>
              <label htmlFor="fullName">Full name</label>
              <input
                id="fullName"
                type="text"
                autoComplete="name"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                required
                maxLength={150}
                placeholder="Your full name"
              />

              <label htmlFor="phone">Phone number (optional)</label>
              <input
                id="phone"
                type="tel"
                autoComplete="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                maxLength={30}
                placeholder="+254..."
              />
            </>
          )}

          <label htmlFor="email">Email address</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            maxLength={255}
            placeholder="you@example.com"
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            autoComplete={
              mode === "signup" ? "new-password" : "current-password"
            }
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={6}
            placeholder="At least 6 characters"
          />

          <button type="submit" disabled={loading}>
            {loading
              ? "Please wait..."
              : mode === "signup"
                ? "Create account"
                : "Sign in"}
          </button>
        </form>

        <p className="customer-auth-switch">
          {mode === "signup"
            ? "Already have an account?"
            : "New to Visionary Studios?"}{" "}
          <button
            type="button"
            onClick={() => {
              setMode(mode === "signup" ? "signin" : "signup");
              setError("");
              setMessage("");
            }}
          >
            {mode === "signup" ? "Sign in" : "Create an account"}
          </button>
        </p>
      </section>
    </main>
  );
}
