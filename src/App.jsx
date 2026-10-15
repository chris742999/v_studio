
import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Home from "./pages/Home";
import Services from "./pages/Services";
import Booking from "./pages/Booking";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import { supabase } from "./lib/supabase";

function ProtectedAdminRoute() {
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    let active = true;

    async function checkAdminAccess() {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error || !session) {
          if (active) setAuthorized(false);
          return;
        }

        // The backend checks whether this account is an administrator.
        const response = await fetch("/api/admin/bookings", {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        if (!response.ok) {
          await supabase.auth.signOut();
          if (active) setAuthorized(false);
          return;
        }

        if (active) setAuthorized(true);
      } catch (error) {
        console.error("Admin access check failed:", error);
        if (active) setAuthorized(false);
      } finally {
        if (active) setChecking(false);
      }
    }

    checkAdminAccess();

    return () => {
      active = false;
    };
  }, []);

  if (checking) {
    return <div className="admin-access-loading">Verifying admin access...</div>;
  }

  return authorized ? <AdminDashboard /> : <Navigate to="/admin/login" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<ProtectedAdminRoute />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
