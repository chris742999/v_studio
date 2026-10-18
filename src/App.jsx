
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
import CustomerDashboard from "./pages/CustomerDashboard";
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

        const response = await fetch("/api/admin/bookings", {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        if (!response.ok) {
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

function ProtectedCustomerRoute() {
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    let active = true;

    async function checkCustomerAccess() {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error || !session) {
          if (active) setAuthorized(false);
          return;
        }

        // The backend will verify the customer's role and account ownership
        // when we connect the customer APIs.
        if (active) setAuthorized(true);
      } catch (error) {
        console.error("Customer access check failed:", error);
        if (active) setAuthorized(false);
      } finally {
        if (active) setChecking(false);
      }
    }

    checkCustomerAccess();

    return () => {
      active = false;
    };
  }, []);

  if (checking) {
    return <div className="admin-access-loading">Verifying customer access...</div>;
  }

  return authorized ? (
    <CustomerDashboard />
  ) : (
    <Navigate to="/login" replace />
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public website */}
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/contact" element={<Contact />} />

        {/* Existing admin login and protected dashboard */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<ProtectedAdminRoute />} />

        {/* Customer dashboard */}
        <Route
          path="/customer"
          element={<ProtectedCustomerRoute />}
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
