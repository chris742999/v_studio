import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  UserPlus,
  Copy,
  Check,
  Eye,
  EyeOff,
} from "lucide-react";import { supabase } from "../lib/supabase";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Camera,
  Settings,
  Bell,
  Search,
  Menu,
  TrendingUp,
  Clock3,
  CheckCircle2,
  Banknote,
  ArrowUpRight,
  Heart,
  GraduationCap,
  Cake,
  Briefcase,
  Package,
  Aperture,
  Film,
  Mail,
  Phone,
  MapPin,
  Shield,
  LogOut,
  BellRing,
  Star,
  XCircle,
  RefreshCw,
  X,
  ChevronRight,
  Inbox,
} from "lucide-react";
import "./AdminDashboard.css";

/* ------------------------------------------------------------------ */
/* Static data                                                         */
/* ------------------------------------------------------------------ */

const navigation = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Bookings", icon: CalendarDays },
  { label: "Customers", icon: Users },
  { label: "Services", icon: Camera },
  { label: "Settings", icon: Settings },
];

const serviceCatalog = [
  {
    name: "Wedding Photography",
    price: 35000,
    icon: Heart,
    color: "cyan",
    description: "Full-day coverage with edited gallery.",
  },
  {
    name: "Graduation Photography",
    price: 12000,
    icon: GraduationCap,
    color: "violet",
    description: "Studio and on-location graduation portraits.",
  },
  {
    name: "Birthday Photography",
    price: 15000,
    icon: Cake,
    color: "blue",
    description: "Coverage for milestone celebrations.",
  },
  {
    name: "Studio Portraits",
    price: 8000,
    icon: Camera,
    color: "green",
    description: "Indoor portrait sessions with studio lighting.",
  },
  {
    name: "Corporate Photography",
    price: 20000,
    icon: Briefcase,
    color: "cyan",
    description: "Team, executive and brand event coverage.",
  },
  {
    name: "Product Photography",
    price: 18000,
    icon: Package,
    color: "violet",
    description: "Clean e-commerce and catalogue product shots.",
  },
  {
    name: "Drone Photography",
    price: 25000,
    icon: Aperture,
    color: "blue",
    description: "Aerial photography and cinematic drone footage.",
  },
  {
    name: "Videography",
    price: 40000,
    icon: Film,
    color: "green",
    description: "Cinematic filming, editing and highlight reels.",
  },
];

const servicePrices = serviceCatalog.reduce((prices, service) => {
  prices[service.name] = service.price;
  return prices;
}, {});

const notificationOptions = [
  {
    key: "newBooking",
    label: "New booking requests",
    description: "Get alerted the moment a customer submits a booking.",
  },
  {
    key: "statusReminder",
    label: "Upcoming shoot reminders",
    description: "A reminder 24 hours before every confirmed session.",
  },
  {
    key: "weeklySummary",
    label: "Weekly studio summary",
    description: "A Monday digest of bookings, customers and revenue.",
  },
  {
    key: "marketing",
    label: "Product updates",
    description: "Occasional news about new Visionary Studios tools.",
  },
];

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const statusKey = (status) =>
  (status || "unknown").toLowerCase().replace(/\s+/g, "-");

const formatKsh = (amount) =>
  `KSh ${Number(amount || 0).toLocaleString("en-KE")}`;

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(`${String(value).slice(0, 10)}T00:00:00`);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const formatBookingDate = (booking) =>
  formatDate(booking.preferred_date || booking.booking_date);

const initials = (value) => {
  const parts = String(value || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);

  if (parts.length === 0) return "?";

  return parts.map((part) => part[0]).join("").toUpperCase();
};

const bookingKey = (booking, index = 0) =>
  booking?.id ||
  booking?.booking_id ||
  `${booking?.email || booking?.full_name || "booking"}-${index}`;

/* ------------------------------------------------------------------ */
/* Shared pieces                                                       */
/* ------------------------------------------------------------------ */

function EmptyState({ icon: Icon, title, children }) {
  return (
    <div className="admin-empty-state">
      <div className="admin-empty-icon">
        <Icon size={27} />
      </div>
      <h3>{title}</h3>
      <p>{children}</p>
    </div>
  );
}

function PageHeader({ eyebrow, title, description, children }) {
  return (
    <section className="admin-bookings-panel admin-page-header">
      <div className="admin-panel-header">
        <div>
          {eyebrow && <span className="admin-page-eyebrow">{eyebrow}</span>}
          <h2>{title}</h2>
          <p>{description}</p>
        </div>

        {children && <div className="admin-page-actions">{children}</div>}
      </div>
    </section>
  );
}

function BookingTable({ rows, onSelect, onStatusChange, updatingBookingId }) {
  return (
    <div className="admin-bookings-table-wrap">
      <table className="admin-bookings-table">
        <colgroup>
          <col style={{ width: "27%" }} />
          <col style={{ width: "18%" }} />
          <col style={{ width: "14%" }} />
          <col style={{ width: "13%" }} />
          <col style={{ width: "12%" }} />
          <col style={{ width: "16%" }} />
        </colgroup>

        <thead>
          <tr>
            <th>Customer</th>
            <th>Service</th>
            <th>Date</th>
            <th className="admin-col-right">Amount</th>
            <th className="admin-col-center">Status</th>
            <th className="admin-col-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((booking, index) => {
            const name =
              booking.full_name || booking.name || "Unnamed customer";

            return (
              <tr key={bookingKey(booking, index)}>
                <td>
                  <div className="admin-customer-cell">
                    <span className="admin-customer-avatar">
                      {initials(name)}
                    </span>

                    <div className="admin-customer-meta">
                      <strong>{name}</strong>
                      <span>
                        {booking.email || booking.phone || "No contact details"}
                      </span>
                    </div>
                  </div>
                </td>

                <td>
                  <span className="admin-service-cell">
                    {booking.service || "—"}
                  </span>
                </td>

                <td>
                  <span className="admin-date-cell">
                    {formatBookingDate(booking)}
                  </span>
                </td>

                <td className="admin-col-right">
                  <span className="admin-amount">
                    {formatKsh(servicePrices[booking.service] || 0)}
                  </span>
                </td>

                <td className="admin-col-center">
                  <span
                    className={`admin-booking-status ${statusKey(
                      booking.status
                    )}`}
                  >
                    {booking.status || "Unknown"}
                  </span>
                </td>

                <td className="admin-col-right">
                  <div className="admin-booking-actions">
                    <button
                      type="button"
                      className="admin-row-button"
                      onClick={() => onSelect(booking)}
                    >
                      Details
                    </button>

                    <select
                      aria-label={`Update status for ${name}`}
                      value={booking.status?.toLowerCase() || "pending"}
                      disabled={updatingBookingId !== null}
                      onChange={(event) =>
                        onStatusChange(booking, event.target.value)
                      }
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Dashboard                                                           */
/* ------------------------------------------------------------------ */

function AdminDashboard() {
  const tiltRef = useRef(null);
  const mountedRef = useRef(true);
  const notificationRef = useRef(null);
  const searchInputRef = useRef(null);

  const [adminName, setAdminName] = useState("Admin");
  const [adminEmail, setAdminEmail] = useState("");

  const [bookings, setBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);
  const [bookingsError, setBookingsError] = useState("");

  const [activeSection, setActiveSection] = useState("Overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [customerSearch, setCustomerSearch] = useState("");
    // Create customer account
  const [showCreateCustomer, setShowCreateCustomer] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    full_name: "",
    email: "",
    phone: "",
  });
  const [creatingCustomer, setCreatingCustomer] = useState(false);
  const [createCustomerError, setCreateCustomerError] = useState("");
  const [createCustomerSuccess, setCreateCustomerSuccess] = useState("");
  const [temporaryPassword, setTemporaryPassword] = useState("");
  const [showTemporaryPassword, setShowTemporaryPassword] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [updatingBookingId, setUpdatingBookingId] = useState(null);
  const [actionMessage, setActionMessage] = useState("");
  const [actionError, setActionError] = useState("");

  const [notificationSettings, setNotificationSettings] = useState({
    newBooking: true,
    statusReminder: true,
    weeklySummary: false,
    marketing: false,
  });

  /* ---------------------------------------------------------------- */
  /* Navigation                                                       */
  /* ---------------------------------------------------------------- */

  const goTo = useCallback((section) => {
    setActiveSection(section);
    setSidebarOpen(false);
    setNotificationsOpen(false);
    setSearchOpen(false);

    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  /* ---------------------------------------------------------------- */
  /* Data loading                                                     */
  /* ---------------------------------------------------------------- */

  const loadBookings = useCallback(async () => {
    setBookingsLoading(true);
    setBookingsError("");

    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) throw sessionError;

      if (!session?.access_token) {
        throw new Error("Your session has expired. Please log in again.");
      }

      const response = await fetch("/api/admin/bookings", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to load bookings.");
      }

      if (!mountedRef.current) return;

      setBookings(Array.isArray(data.bookings) ? data.bookings : []);
    } catch (error) {
      if (!mountedRef.current) return;

      setBookingsError(error.message || "Unable to load bookings.");
    } finally {
      if (mountedRef.current) {
        setBookingsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    loadBookings();

    return () => {
      mountedRef.current = false;
    };
  }, [loadBookings]);

  // Load the logged-in administrator's details.
  useEffect(() => {
    let cancelled = false;

    async function loadAdmin() {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error) throw error;
        if (!user || cancelled) return;

        const name =
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.email?.split("@")[0] ||
          "Admin";

        setAdminName(name);
        setAdminEmail(user.email || "");
      } catch (error) {
        console.error("Unable to load administrator:", error.message);
      }
    }

    loadAdmin();

    return () => {
      cancelled = true;
    };
  }, []);

  // Visual effect: make the hero camera respond to cursor movement.
  useEffect(() => {
    const el = tiltRef.current;

    if (!el) return undefined;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }

    const clamp = (n) => Math.max(-1, Math.min(1, n));

    const onMove = (e) => {
      const r = el.getBoundingClientRect();

      const nx = clamp((e.clientX - (r.left + r.width / 2)) / 420);
      const ny = clamp((e.clientY - (r.top + r.height / 2)) / 320);

      el.style.setProperty("--tilt-y", `${nx * 20}deg`);
      el.style.setProperty("--tilt-x", `${-ny * 14}deg`);
    };

    const reset = () => {
      el.style.setProperty("--tilt-y", "0deg");
      el.style.setProperty("--tilt-x", "0deg");
    };

    window.addEventListener("pointermove", onMove);
    document.documentElement.addEventListener("pointerleave", reset);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", reset);
    };
  }, []);

  // Close the notification dropdown when clicking anywhere else.
  useEffect(() => {
    if (!notificationsOpen) return undefined;

    const onPointerDown = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener("pointerdown", onPointerDown);

    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [notificationsOpen]);

  // Focus the search field as soon as the palette opens.
  useEffect(() => {
    if (!searchOpen) return undefined;

    const timer = setTimeout(() => searchInputRef.current?.focus(), 40);

    return () => clearTimeout(timer);
  }, [searchOpen]);

  // Keyboard shortcuts: ⌘K / Ctrl+K opens search, Escape closes overlays.
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setSearchOpen(false);
        setNotificationsOpen(false);
        setSelectedBooking(null);
        return;
      }

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  /* ---------------------------------------------------------------- */
  /* Derived statistics                                               */
  /* ---------------------------------------------------------------- */

  const totalBookings = bookings.length;

  const pendingBookings = bookings.filter(
    (booking) => booking.status?.toLowerCase() === "pending"
  ).length;

  const confirmedBookings = bookings.filter(
    (booking) => booking.status?.toLowerCase() === "confirmed"
  ).length;

  const completedBookings = bookings.filter(
    (booking) => booking.status?.toLowerCase() === "completed"
  ).length;

  const cancelledBookings = bookings.filter(
    (booking) => booking.status?.toLowerCase() === "cancelled"
  ).length;

  const totalCustomers = new Set(
    bookings
      .map((booking) => booking.email?.trim().toLowerCase())
      .filter(Boolean)
  ).size;

  const totalRevenue = bookings
    .filter((booking) => booking.status?.toLowerCase() === "completed")
    .reduce(
      (total, booking) => total + (servicePrices[booking.service] || 0),
      0
    );

  const averageBookingValue = completedBookings
    ? Math.round(totalRevenue / completedBookings)
    : 0;

  const completionRate = totalBookings
    ? Math.round((completedBookings / totalBookings) * 100)
    : 0;

  /* ---------------------------------------------------------------- */
  /* Customers derived from bookings                                  */
  /* ---------------------------------------------------------------- */

  const customers = useMemo(() => {
    const map = new Map();

    bookings.forEach((booking) => {
      const email = booking.email?.trim().toLowerCase();
      const key =
        email ||
        booking.phone?.trim() ||
        booking.full_name?.trim().toLowerCase();

      if (!key) return;

      const status = (booking.status || "pending").toLowerCase();
      const value = servicePrices[booking.service] || 0;

      if (!map.has(key)) {
        map.set(key, {
          id: key,
          name: booking.full_name || booking.name || "Unnamed customer",
          email: booking.email || "—",
          phone: booking.phone || "—",
          bookings: 0,
          completed: 0,
          pending: 0,
          spent: 0,
          lastDate: null,
        });
      }

      const customer = map.get(key);

      customer.bookings += 1;

      if (status === "completed") {
        customer.completed += 1;
        customer.spent += value;
      }

      if (status === "pending") {
        customer.pending += 1;
      }

      const dateValue =
        booking.preferred_date ||
        booking.booking_date ||
        booking.created_at ||
        null;

      if (
        dateValue &&
        (!customer.lastDate ||
          new Date(dateValue).getTime() > new Date(customer.lastDate).getTime())
      ) {
        customer.lastDate = dateValue;
      }
    });

    return Array.from(map.values()).sort(
      (a, b) => b.spent - a.spent || b.bookings - a.bookings
    );
  }, [bookings]);

  const repeatCustomers = customers.filter(
    (customer) => customer.bookings > 1
  ).length;

  const filteredCustomers = useMemo(() => {
    const search = customerSearch.trim().toLowerCase();

    if (!search) return customers;

    return customers.filter((customer) =>
      [customer.name, customer.email, customer.phone].some((value) =>
        String(value || "").toLowerCase().includes(search)
      )
    );
  }, [customers, customerSearch]);

  /* ---------------------------------------------------------------- */
  /* Service performance                                              */
  /* ---------------------------------------------------------------- */

  const serviceStats = useMemo(
    () =>
      serviceCatalog.map((service) => {
        const matching = bookings.filter(
          (booking) => booking.service === service.name
        );

        const completed = matching.filter(
          (booking) => booking.status?.toLowerCase() === "completed"
        ).length;

        return {
          ...service,
          bookings: matching.length,
          completed,
          revenue: completed * service.price,
        };
      }),
    [bookings]
  );

  const topServices = useMemo(
    () =>
      serviceStats
        .filter((service) => service.bookings > 0)
        .sort((a, b) => b.bookings - a.bookings || b.revenue - a.revenue),
    [serviceStats]
  );

  /* ---------------------------------------------------------------- */
  /* Filtered bookings                                                */
  /* ---------------------------------------------------------------- */

  const filteredBookings = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return bookings.filter((booking) => {
      const matchesSearch = [
        booking.full_name,
        booking.email,
        booking.phone,
        booking.service,
      ].some((value) => String(value || "").toLowerCase().includes(search));

      const matchesStatus =
        statusFilter === "all" ||
        booking.status?.toLowerCase() === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [bookings, searchTerm, statusFilter]);

  /* ---------------------------------------------------------------- */
  /* Live notifications                                               */
  /* ---------------------------------------------------------------- */

  const notifications = useMemo(() => {
    const now = Date.now();
    const weekAhead = now + 7 * 24 * 60 * 60 * 1000;
    const items = [];

    bookings.forEach((booking, index) => {
      const status = (booking.status || "pending").toLowerCase();
      const name = booking.full_name || booking.name || "A customer";
      const id = bookingKey(booking, index);

      if (status === "pending") {
        items.push({
          id: `pending-${id}`,
          tone: "pending",
          icon: Clock3,
          order: 0,
          title: "New booking request",
          message: `${name} requested ${
            booking.service || "a session"
          } · ${formatBookingDate(booking)}`,
          booking,
        });
        return;
      }

      if (status === "confirmed") {
        const raw = booking.preferred_date || booking.booking_date;
        const time = raw ? new Date(raw).getTime() : NaN;

        if (!Number.isNaN(time) && time >= now - 86400000 && time <= weekAhead) {
          items.push({
            id: `upcoming-${id}`,
            tone: "confirmed",
            icon: BellRing,
            order: 1,
            title: "Upcoming shoot",
            message: `${name} · ${booking.service || "Session"} · ${formatBookingDate(
              booking
            )}`,
            booking,
          });
        }
      }
    });

    return items.sort((a, b) => a.order - b.order).slice(0, 7);
  }, [bookings]);

  /* ---------------------------------------------------------------- */
  /* Global search results                                            */
  /* ---------------------------------------------------------------- */

  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) return [];

    return bookings
      .filter((booking) =>
        [
          booking.full_name,
          booking.name,
          booking.email,
          booking.phone,
          booking.service,
          booking.status,
        ].some((value) => String(value || "").toLowerCase().includes(query))
      )
      .slice(0, 8);
  }, [bookings, searchQuery]);

  const sectionMatches = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) return [];

    return navigation.filter((item) =>
      item.label.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  /* ---------------------------------------------------------------- */
  /* Actions                                                          */
  /* ---------------------------------------------------------------- */

  async function updateBookingStatus(booking, newStatus) {
    if (!booking?.id || updatingBookingId !== null) return;

    const confirmed = window.confirm(
      newStatus === "cancelled"
        ? "Are you sure you want to cancel this booking?"
        : `Change this booking's status to ${newStatus}?`
    );

    if (!confirmed) return;

    setUpdatingBookingId(booking.id);
    setActionMessage("");
    setActionError("");

    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) throw sessionError;

      if (!session?.access_token) {
        throw new Error("Your session has expired. Please log in again.");
      }

      const response = await fetch(`/api/admin/bookings/${booking.id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to update booking status.");
      }

      setBookings((currentBookings) =>
        currentBookings.map((item) =>
          item.id === booking.id ? { ...item, status: data.booking.status } : item
        )
      );

      setSelectedBooking((current) =>
        current?.id === booking.id
          ? { ...current, status: data.booking.status }
          : current
      );

      setActionMessage(`Booking status updated to ${data.booking.status}.`);
    } catch (error) {
      setActionError(error.message || "Unable to update booking.");
    } finally {
      setUpdatingBookingId(null);
    }
  }

  function viewCustomerBookings(customer) {
    setSearchTerm(
      customer.email && customer.email !== "—" ? customer.email : customer.name
    );
    setStatusFilter("all");
    goTo("Bookings");
  }

  function toggleNotification(key) {
    setNotificationSettings((current) => ({
      ...current,
      [key]: !current[key],
    }));
  }

  function openBookingFromSearch(booking) {
    setSelectedBooking(booking);
    setSearchOpen(false);
    setSearchQuery("");
  }

  async function handleSignOut() {
    const confirmed = window.confirm("Sign out of the admin workspace?");

    if (!confirmed) return;

    await supabase.auth.signOut();
    window.location.href = "/";
  }

  /* ---------------------------------------------------------------- */
  /* Shared renderers                                                 */
  /* ---------------------------------------------------------------- */

  const renderBookingsBody = (rows, emptyTitle, emptyMessage) => {
    if (bookingsLoading) {
      return (
        <EmptyState icon={Clock3} title="Loading bookings…">
          We're retrieving your studio's latest booking requests.
        </EmptyState>
      );
    }

    if (bookingsError) {
      return (
        <EmptyState icon={CalendarDays} title="Bookings couldn't be loaded">
          Check the error above and confirm that the admin API is running and
          accessible.
        </EmptyState>
      );
    }

    if (bookings.length === 0) {
      return (
        <EmptyState icon={CalendarDays} title="No bookings yet">
          New booking requests will appear here when customers make
          reservations.
        </EmptyState>
      );
    }

    if (rows.length === 0) {
      return (
        <EmptyState icon={CalendarDays} title={emptyTitle}>
          {emptyMessage}
        </EmptyState>
      );
    }

    return (
      <BookingTable
        rows={rows}
        onSelect={setSelectedBooking}
        onStatusChange={updateBookingStatus}
        updatingBookingId={updatingBookingId}
      />
    );
  };

  const renderStatCard = ({ title, value, note, icon: Icon, color }) => (
    <article className={`admin-stat-card ${color}`} key={title}>
      <div className="admin-stat-top">
        <div className="admin-stat-icon">
          <Icon size={21} />
        </div>

        <ArrowUpRight size={18} className="admin-stat-arrow" />
      </div>

      <p className="admin-stat-title">{title}</p>
      <h2>{value}</h2>
      <span className="admin-stat-note">{note}</span>
    </article>
  );

  /* ---------------------------------------------------------------- */
  /* Page: Overview                                                   */
  /* ---------------------------------------------------------------- */

  const renderOverview = () => {
    const overviewCards = [
      {
        title: "Total Bookings",
        value: bookingsLoading ? "…" : totalBookings,
        note: "All booking requests",
        icon: CalendarDays,
        color: "cyan",
      },
      {
        title: "Pending Requests",
        value: bookingsLoading ? "…" : pendingBookings,
        note: "Awaiting confirmation",
        icon: Clock3,
        color: "violet",
      },
      {
        title: "Total Customers",
        value: bookingsLoading ? "…" : totalCustomers,
        note: "Registered customers",
        icon: Users,
        color: "blue",
      },
      {
        title: "Revenue",
        value: bookingsLoading ? "…" : formatKsh(totalRevenue),
        note: "Based on completed work",
        icon: Banknote,
        color: "green",
      },
    ];

    return (
      <>
        <section className="admin-welcome">
          <div className="admin-lens-stage" aria-hidden="true">
            <div className="admin-aperture" />

            <div className="admin-camera-tilt" ref={tiltRef}>
              <svg
                className="admin-camera"
                viewBox="0 0 260 220"
                focusable="false"
              >
                <defs>
                  <linearGradient id="cam-front" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#3b4659" />
                    <stop offset="0.5" stopColor="#1b2330" />
                    <stop offset="1" stopColor="#10151d" />
                  </linearGradient>

                  <linearGradient id="cam-top" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0" stopColor="#5d6b81" />
                    <stop offset="1" stopColor="#8794a9" />
                  </linearGradient>

                  <linearGradient id="cam-side" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#1f2836" />
                    <stop offset="1" stopColor="#090d13" />
                  </linearGradient>

                  <linearGradient id="cam-silver" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#e4eaf3" />
                    <stop offset="0.5" stopColor="#7d8aa0" />
                    <stop offset="1" stopColor="#363f50" />
                  </linearGradient>

                  <linearGradient id="cam-coat" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#6fe4ff" />
                    <stop offset="1" stopColor="#7a5cff" />
                  </linearGradient>

                  <radialGradient id="cam-glass" cx="0.4" cy="0.34" r="0.7">
                    <stop offset="0" stopColor="#c9f6ff" />
                    <stop offset="0.14" stopColor="#6fe4ff" />
                    <stop offset="0.48" stopColor="#6a4cf2" />
                    <stop offset="0.78" stopColor="#170f46" />
                    <stop offset="1" stopColor="#05060c" />
                  </radialGradient>

                  <filter
                    id="cam-blur"
                    x="-20%"
                    y="-50%"
                    width="140%"
                    height="200%"
                  >
                    <feGaussianBlur stdDeviation="6" />
                  </filter>
                </defs>

                <ellipse
                  cx="128"
                  cy="206"
                  rx="98"
                  ry="9"
                  fill="#000"
                  opacity="0.55"
                  filter="url(#cam-blur)"
                />

                <polygon
                  points="200,78 232,56 232,150 200,172"
                  fill="url(#cam-side)"
                />
                <polygon
                  points="40,78 200,78 232,56 72,56"
                  fill="url(#cam-top)"
                />
                <polygon
                  points="152,48 178,32 178,62 152,78"
                  fill="url(#cam-side)"
                />
                <polygon
                  points="92,48 152,48 178,32 118,32"
                  fill="url(#cam-top)"
                />

                <rect
                  x="92"
                  y="48"
                  width="60"
                  height="30"
                  rx="3"
                  fill="url(#cam-front)"
                />
                <rect
                  x="100"
                  y="56"
                  width="22"
                  height="9"
                  rx="2"
                  fill="#070a10"
                  stroke="#2f394b"
                />

                <rect x="177" y="64" width="18" height="5" fill="#a85f00" />
                <ellipse cx="186" cy="64" rx="9" ry="3.6" fill="#ffb54a" />
                <ellipse
                  cx="184"
                  cy="63.4"
                  rx="4"
                  ry="1.3"
                  fill="#fff"
                  opacity="0.55"
                />

                <rect x="52" y="63" width="22" height="6" fill="#4a566a" />
                <ellipse cx="63" cy="63" rx="11" ry="4" fill="url(#cam-silver)" />

                <rect
                  x="40"
                  y="78"
                  width="160"
                  height="94"
                  rx="6"
                  fill="url(#cam-front)"
                />
                <rect
                  x="40"
                  y="78"
                  width="36"
                  height="94"
                  rx="6"
                  fill="#0b0f16"
                  opacity="0.75"
                />

                <line
                  x1="40"
                  y1="78.5"
                  x2="200"
                  y2="78.5"
                  stroke="#fff"
                  strokeOpacity="0.3"
                />

                <circle cx="58" cy="94" r="3.4" fill="#ffb54a" />

                <rect x="150" y="90" width="38" height="7" rx="2" fill="#080b11" />
                <rect
                  x="153"
                  y="92.5"
                  width="14"
                  height="2"
                  rx="1"
                  fill="url(#cam-coat)"
                />

                <circle cx="120" cy="125" r="48" fill="#0e131b" />
                <circle cx="116" cy="127" r="48" fill="#141b26" />
                <circle cx="112" cy="129" r="48" fill="#19212e" />
                <circle cx="108" cy="131" r="48" fill="#1f2937" />

                <circle
                  cx="104"
                  cy="133"
                  r="48"
                  fill="url(#cam-front)"
                  stroke="url(#cam-silver)"
                  strokeWidth="2.5"
                />

                <circle
                  cx="104"
                  cy="133"
                  r="42"
                  fill="none"
                  stroke="#fff"
                  strokeOpacity="0.16"
                  strokeWidth="6"
                  strokeDasharray="2 5"
                />

                <circle
                  cx="104"
                  cy="133"
                  r="37"
                  fill="#080b11"
                  stroke="#2e384a"
                  strokeWidth="3"
                />

                <circle cx="104" cy="133" r="32" fill="url(#cam-glass)" />

                <circle
                  cx="104"
                  cy="133"
                  r="32"
                  fill="none"
                  stroke="url(#cam-coat)"
                  strokeWidth="1.6"
                />

                <circle
                  cx="104"
                  cy="133"
                  r="17"
                  fill="none"
                  stroke="#fff"
                  strokeOpacity="0.1"
                />

                <ellipse
                  cx="92"
                  cy="120"
                  rx="11"
                  ry="6"
                  transform="rotate(-35 92 120)"
                  fill="#fff"
                  opacity="0.7"
                />

                <circle cx="118" cy="148" r="4" fill="#fff" opacity="0.25" />
              </svg>
            </div>
          </div>

          <div className="admin-welcome-copy">
            <div className="admin-eyebrow">
              <span className="admin-status-pulse" />
              STUDIO CONTROL CENTER
            </div>

            <h1>
              Welcome back, <span>{adminName}.</span>
            </h1>

            <p>
              Here's your studio overview. Let's make something extraordinary.
            </p>
          </div>

          <div className="admin-date-badge">
            <CalendarDays size={17} />
            <span>Booking overview</span>
          </div>
        </section>

        {bookingsError && (
          <div className="admin-bookings-error" role="alert">
            <strong>Unable to load bookings.</strong>
            <p>{bookingsError}</p>
          </div>
        )}

        {(actionMessage || actionError) && (
          <div
            className="admin-bookings-error"
            role={actionError ? "alert" : "status"}
          >
            {actionError || actionMessage}
          </div>
        )}

        <section className="admin-stats-grid">
          {overviewCards.map(renderStatCard)}
        </section>

        <section className="admin-bookings-panel">
          <div className="admin-panel-header">
            <div>
              <h2>Recent Bookings</h2>
              <p>The five most recent requests to land in your studio.</p>
            </div>

            <button
              type="button"
              className="admin-view-all"
              onClick={() => goTo("Bookings")}
            >
              View all bookings
              <ArrowUpRight size={16} />
            </button>
          </div>

          {renderBookingsBody(
            bookings.slice(0, 5),
            "No recent bookings",
            "New booking requests will appear here as they arrive."
          )}
        </section>

        <section className="admin-bookings-panel">
          <div className="admin-panel-header">
            <div>
              <h2>Service Performance</h2>
              <p>Bookings and completed revenue by service.</p>
            </div>

            <button
              type="button"
              className="admin-view-all"
              onClick={() => goTo("Services")}
            >
              Manage services
              <ArrowUpRight size={16} />
            </button>
          </div>

          {topServices.length === 0 ? (
            <EmptyState icon={Camera} title="No service activity yet">
              Once bookings start coming in, your top performing services will be
              summarised here.
            </EmptyState>
          ) : (
            <div className="admin-bookings-table-wrap">
              <table className="admin-bookings-table admin-bookings-table--compact">
                <colgroup>
                  <col style={{ width: "40%" }} />
                  <col style={{ width: "15%" }} />
                  <col style={{ width: "15%" }} />
                  <col style={{ width: "30%" }} />
                </colgroup>

                <thead>
                  <tr>
                    <th>Service</th>
                    <th className="admin-col-center">Bookings</th>
                    <th className="admin-col-center">Completed</th>
                    <th className="admin-col-right">Revenue</th>
                  </tr>
                </thead>

                <tbody>
                  {topServices.map((service) => (
                    <tr key={service.name}>
                      <td>
                        <div className="admin-customer-cell">
                          <span className="admin-customer-avatar admin-customer-avatar--soft">
                            <service.icon size={16} />
                          </span>

                          <div className="admin-customer-meta">
                            <strong>{service.name}</strong>
                            <span>{service.description}</span>
                          </div>
                        </div>
                      </td>

                      <td className="admin-col-center">{service.bookings}</td>
                      <td className="admin-col-center">{service.completed}</td>
                      <td className="admin-col-right">
                        <span className="admin-amount">
                          {formatKsh(service.revenue)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </>
    );
  };

  /* ---------------------------------------------------------------- */
  /* Page: Bookings                                                   */
  /* ---------------------------------------------------------------- */

  const renderBookings = () => {
    const bookingStatusCards = [
      {
        title: "Total Bookings",
        value: totalBookings,
        note: "All booking requests",
        icon: CalendarDays,
        color: "cyan",
      },
      {
        title: "Pending",
        value: pendingBookings,
        note: "Awaiting confirmation",
        icon: Clock3,
        color: "violet",
      },
      {
        title: "Confirmed",
        value: confirmedBookings,
        note: "Scheduled sessions",
        icon: CheckCircle2,
        color: "blue",
      },
      {
        title: "Completed",
        value: completedBookings,
        note: `${completionRate}% completion rate`,
        icon: Banknote,
        color: "green",
      },
    ];

    return (
      <>
        <PageHeader
          eyebrow="Booking management"
          title="All Bookings"
          description="Search, filter and manage every studio booking request in one place."
        >
          <button
            type="button"
            className="admin-view-all"
            onClick={loadBookings}
            disabled={bookingsLoading}
          >
            <RefreshCw size={16} />
            {bookingsLoading ? "Refreshing…" : "Refresh"}
          </button>
        </PageHeader>

        <section className="admin-stats-grid">
          {bookingStatusCards.map((card) =>
            renderStatCard({
              ...card,
              value: bookingsLoading ? "…" : card.value,
            })
          )}
        </section>

        {(actionMessage || actionError) && (
          <div
            className="admin-bookings-error"
            role={actionError ? "alert" : "status"}
          >
            {actionError || actionMessage}
          </div>
        )}

        <section className="admin-bookings-panel">
          <div className="admin-panel-header">
            <div>
              <h2>Booking Queue</h2>
              <p>
                {bookingsLoading
                  ? "Loading your studio's booking requests…"
                  : `Showing ${filteredBookings.length} of ${totalBookings} bookings.`}
              </p>
            </div>

            <div className="admin-booking-controls">
              <input
                type="search"
                placeholder="Search customer, email or service..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                aria-label="Search bookings"
              />

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                aria-label="Filter bookings by status"
              >
                <option value="all">All statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {renderBookingsBody(
            filteredBookings,
            "No matching bookings",
            "Try another search term or select a different status filter."
          )}
        </section>
      </>
    );
  };
  const handleCreateCustomer = async (event) => {
  event.preventDefault();

  setCreatingCustomer(true);
  setCreateCustomerError("");
  setCreateCustomerSuccess("");
  setTemporaryPassword("");
  setShowTemporaryPassword(false);
  setCopySuccess(false);

  try {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      throw sessionError;
    }

    if (!session?.access_token) {
      throw new Error("Your session has expired. Please log in again.");
    }

    const response = await fetch("/api/admin/customers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        full_name: newCustomer.full_name.trim(),
        email: newCustomer.email.trim(),
        phone: newCustomer.phone.trim(),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || "Unable to create the customer account."
      );
    }

    if (!data.temporaryPassword) {
      throw new Error(
        "The account response did not include a temporary password. Check the backend response."
      );
    }

    setTemporaryPassword(data.temporaryPassword);
    setCreateCustomerSuccess(
      `Customer account created successfully for ${newCustomer.email.trim()}.`
    );

    setNewCustomer({
      full_name: "",
      email: "",
      phone: "",
    });
  } catch (error) {
    setCreateCustomerError(
      error.message || "Something went wrong while creating the account."
    );
  } finally {
    setCreatingCustomer(false);
  }
};

  /* ---------------------------------------------------------------- */
  /* Page: Customers                                                  */
  /* ---------------------------------------------------------------- */

  const renderCustomers = () => {
    const customerCards = [
      {
        title: "Total Customers",
        value: totalCustomers,
        note: "Registered customers",
        icon: Users,
        color: "cyan",
      },
      {
        title: "Repeat Clients",
        value: repeatCustomers,
        note: "More than one booking",
        icon: Star,
        color: "violet",
      },
      {
        title: "Completed Shoots",
        value: completedBookings,
        note: "Finished sessions",
        icon: CheckCircle2,
        color: "blue",
      },
      {
        title: "Customer Value",
        value: formatKsh(totalRevenue),
        note: "Revenue from completed work",
        icon: Banknote,
        color: "green",
      },
    ];

    return (
      <>
        <PageHeader
  eyebrow="Client relationships"
  title="Customers"
  description="Everyone who has booked a Visionary Studios session, ranked by lifetime value."
>
  <div className="admin-customer-header-actions">
    <button
      type="button"
      className="admin-view-all"
      onClick={() => {
        setShowCreateCustomer(true);
        setCreateCustomerError("");
        setCreateCustomerSuccess("");
      }}
    >
      <UserPlus size={16} />
      Create customer
    </button>

    <div className="admin-booking-controls">
      <input
        type="search"
        placeholder="Search name, email or phone..."
        value={customerSearch}
        onChange={(event) => setCustomerSearch(event.target.value)}
        aria-label="Search customers"
      />
    </div>
  </div>
</PageHeader>
{showCreateCustomer && (
  <section className="admin-bookings-panel">
    <div className="admin-panel-header">
      <div>
        <h3>Create customer account</h3>
        <p>
          Create a login for a customer. Their temporary password will appear
          after successful creation.
        </p>
      </div>

      <button
        type="button"
        className="admin-view-all"
        onClick={() => {
          setShowCreateCustomer(false);
          setCreateCustomerError("");
          setCreateCustomerSuccess("");
          setTemporaryPassword("");
          setShowTemporaryPassword(false);
          setCopySuccess(false);
        }}
        aria-label="Close customer creation form"
      >
        <X size={16} />
        Close
      </button>
    </div>

    <form
      className="admin-customer-form"
onSubmit={handleCreateCustomer}    >
      <label>
        Full name
        <input
          type="text"
          value={newCustomer.full_name}
          onChange={(event) =>
            setNewCustomer({
              ...newCustomer,
              full_name: event.target.value,
            })
          }
          placeholder="Customer's full name"
          autoComplete="name"
          required
        />
      </label>

      <label>
        Email address
        <input
          type="email"
          value={newCustomer.email}
          onChange={(event) =>
            setNewCustomer({
              ...newCustomer,
              email: event.target.value,
            })
          }
          placeholder="customer@example.com"
          autoComplete="email"
          required
        />
      </label>

      <label>
        Phone number
        <input
          type="tel"
          value={newCustomer.phone}
          onChange={(event) =>
            setNewCustomer({
              ...newCustomer,
              phone: event.target.value,
            })
          }
          placeholder="Optional phone number"
          autoComplete="tel"
        />
      </label>

      {createCustomerError && (
        <p className="admin-bookings-error" role="alert">
          {createCustomerError}
        </p>
      )}

      {createCustomerSuccess && (
        <p role="status">{createCustomerSuccess}</p>
      )}

      {temporaryPassword && (
        <div className="admin-customer-password">
          <h4>Temporary password</h4>
          <p>
            Share this password privately with the customer. They will be
            required to change it when they first sign in.
          </p>

          <div className="admin-customer-password-actions">
            <input
              type={showTemporaryPassword ? "text" : "password"}
              value={temporaryPassword}
              readOnly
              aria-label="Temporary customer password"
            />

            <button
              type="button"
              className="admin-view-all"
              onClick={() =>
                setShowTemporaryPassword(!showTemporaryPassword)
              }
              aria-label={
                showTemporaryPassword ? "Hide password" : "Show password"
              }
            >
              {showTemporaryPassword ? (
                <EyeOff size={16} />
              ) : (
                <Eye size={16} />
              )}
            </button>

            <button
              type="button"
              className="admin-view-all"
              onClick={async () => {
  try {
    await navigator.clipboard.writeText(temporaryPassword);
    setCopySuccess(true);
  } catch (error) {
    setCopySuccess(false);
    setCreateCustomerError(
      "Unable to copy the password. Please select and copy it manually."
    );
  }
}}
            >
              {copySuccess ? <Check size={16} /> : <Copy size={16} />}
              {copySuccess ? "Copied" : "Copy password"}
            </button>
          </div>
        </div>
      )}

      <button
        type="submit"
        className="admin-view-all"
        disabled={creatingCustomer}
      >
        <UserPlus size={16} />
        {creatingCustomer ? "Creating account..." : "Create account"}
      </button>
    </form>
  </section>
)}

        <section className="admin-stats-grid">
          {customerCards.map((card) =>
            renderStatCard({
              ...card,
              value: bookingsLoading ? "…" : card.value,
            })
          )}
        </section>

        <section className="admin-bookings-panel">
          <div className="admin-panel-header">
            <div>
              <h2>Customer Directory</h2>
              <p>
                {bookingsLoading
                  ? "Building your customer list from recent bookings…"
                  : `${filteredCustomers.length} customer${
                      filteredCustomers.length === 1 ? "" : "s"
                    } listed.`}
              </p>
            </div>
          </div>

          {bookingsLoading ? (
            <EmptyState icon={Clock3} title="Loading customers…">
              We're building your customer list from recent bookings.
            </EmptyState>
          ) : customers.length === 0 ? (
            <EmptyState icon={Users} title="No customers yet">
              Customer profiles are created automatically from incoming
              bookings.
            </EmptyState>
          ) : filteredCustomers.length === 0 ? (
            <EmptyState icon={Users} title="No matching customers">
              Try a different name, email address or phone number.
            </EmptyState>
          ) : (
            <div className="admin-bookings-table-wrap">
              <table className="admin-bookings-table">
                <colgroup>
                  <col style={{ width: "26%" }} />
                  <col style={{ width: "16%" }} />
                  <col style={{ width: "10%" }} />
                  <col style={{ width: "11%" }} />
                  <col style={{ width: "14%" }} />
                  <col style={{ width: "13%" }} />
                  <col style={{ width: "10%" }} />
                </colgroup>

                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Phone</th>
                    <th className="admin-col-center">Bookings</th>
                    <th className="admin-col-center">Completed</th>
                    <th className="admin-col-right">Total spent</th>
                    <th className="admin-col-right">Last booking</th>
                    <th className="admin-col-right">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredCustomers.map((customer) => (
                    <tr key={customer.id}>
                      <td>
                        <div className="admin-customer-cell">
                          <span className="admin-customer-avatar">
                            {initials(customer.name)}
                          </span>

                          <div className="admin-customer-meta">
                            <strong>{customer.name}</strong>
                            <span>{customer.email}</span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className="admin-date-cell">
                          {customer.phone}
                        </span>
                      </td>

                      <td className="admin-col-center">{customer.bookings}</td>
                      <td className="admin-col-center">{customer.completed}</td>

                      <td className="admin-col-right">
                        <span className="admin-amount">
                          {formatKsh(customer.spent)}
                        </span>
                      </td>

                      <td className="admin-col-right">
                        <span className="admin-date-cell">
                          {formatDate(customer.lastDate)}
                        </span>
                      </td>

                      <td className="admin-col-right">
                        <div className="admin-booking-actions">
                          <button
                            type="button"
                            className="admin-row-button"
                            onClick={() => viewCustomerBookings(customer)}
                          >
                            View bookings
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </>
    );
  };

  /* ---------------------------------------------------------------- */
  /* Page: Services                                                   */
  /* ---------------------------------------------------------------- */

  const renderServices = () => (
    <>
      <PageHeader
        eyebrow="Studio offering"
        title="Services & Packages"
        description="Package pricing, booking volume and completed revenue for every service you offer."
      >
        <button
          type="button"
          className="admin-view-all"
          onClick={loadBookings}
          disabled={bookingsLoading}
        >
          <RefreshCw size={16} />
          {bookingsLoading ? "Refreshing…" : "Refresh data"}
        </button>
      </PageHeader>

      <section className="admin-stats-grid">
        {serviceStats.map((service) => (
          <article
            className={`admin-stat-card ${service.color}`}
            key={service.name}
          >
            <div className="admin-stat-top">
              <div className="admin-stat-icon">
                <service.icon size={21} />
              </div>

              <ArrowUpRight size={18} className="admin-stat-arrow" />
            </div>

            <p className="admin-stat-title">{service.name}</p>
            <h2>{formatKsh(service.price)}</h2>
            <span className="admin-stat-note">
              {service.bookings} {service.bookings === 1 ? "booking" : "bookings"}{" "}
              · {service.completed} completed
            </span>
          </article>
        ))}
      </section>

      <section className="admin-bookings-panel">
        <div className="admin-panel-header">
          <div>
            <h2>Service Catalogue</h2>
            <p>Package pricing and how each service is performing.</p>
          </div>
        </div>

        <div className="admin-bookings-table-wrap">
          <table className="admin-bookings-table">
            <colgroup>
              <col style={{ width: "36%" }} />
              <col style={{ width: "16%" }} />
              <col style={{ width: "16%" }} />
              <col style={{ width: "16%" }} />
              <col style={{ width: "16%" }} />
            </colgroup>

            <thead>
              <tr>
                <th>Service</th>
                <th className="admin-col-right">Price</th>
                <th className="admin-col-center">Bookings</th>
                <th className="admin-col-center">Completed</th>
                <th className="admin-col-right">Revenue</th>
              </tr>
            </thead>

            <tbody>
              {serviceStats.map((service) => (
                <tr key={service.name}>
                  <td>
                    <div className="admin-customer-cell">
                      <span className="admin-customer-avatar admin-customer-avatar--soft">
                        <service.icon size={16} />
                      </span>

                      <div className="admin-customer-meta">
                        <strong>{service.name}</strong>
                        <span>{service.description}</span>
                      </div>
                    </div>
                  </td>

                  <td className="admin-col-right">
                    <span className="admin-amount">
                      {formatKsh(service.price)}
                    </span>
                  </td>

                  <td className="admin-col-center">{service.bookings}</td>
                  <td className="admin-col-center">{service.completed}</td>

                  <td className="admin-col-right">
                    <span className="admin-amount">
                      {formatKsh(service.revenue)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );


  /* ---------------------------------------------------------------- */
  /* Page: Settings                                                   */
  /* ---------------------------------------------------------------- */

  const renderSettings = () => (
    <>
      <PageHeader
        eyebrow="Workspace"
        title="Settings"
        description="Your administrator profile, studio performance and how Visionary Studios keeps you informed."
      />

      <section className="admin-bookings-panel">
        <div className="admin-panel-header">
          <div>
            <h2>Studio Profile</h2>
            <p>The administrator account currently signed in.</p>
          </div>
        </div>

        <div className="admin-settings-grid">
          <div className="admin-settings-card">
            <div className="admin-settings-profile">
              <div className="admin-avatar">VS</div>

              <div>
                <strong>{adminName}</strong>
                <span>Administrator</span>
              </div>
            </div>

            <div className="admin-settings-facts">
              <div>
                <Mail size={16} />
                <span>{adminEmail || "No email on record"}</span>
              </div>

              <div>
                <Shield size={16} />
                <span>Full workspace access</span>
              </div>

              <div>
                <MapPin size={16} />
                <span>Nairobi, Kenya</span>
              </div>

              <div>
                <CalendarDays size={16} />
                <span>
                  {totalBookings} bookings · {totalCustomers} customers
                </span>
              </div>
            </div>
          </div>

          <div className="admin-settings-card">
            <h3>Performance snapshot</h3>

            <div className="admin-settings-facts">
              <div>
                <CheckCircle2 size={16} />
                <span>{completedBookings} completed shoots</span>
              </div>

              <div>
                <XCircle size={16} />
                <span>{cancelledBookings} cancelled bookings</span>
              </div>

              <div>
                <TrendingUp size={16} />
                <span>{completionRate}% completion rate</span>
              </div>

              <div>
                <Banknote size={16} />
                <span>
                  {formatKsh(averageBookingValue)} average booking value
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="admin-bookings-panel">
        <div className="admin-panel-header">
          <div>
            <h2>Notifications</h2>
            <p>Choose how Visionary Studios keeps you informed.</p>
          </div>
        </div>

        <div className="admin-settings-list">
          {notificationOptions.map((option) => (
            <label className="admin-setting-row" key={option.key}>
              <div>
                <strong>
                  <BellRing size={15} /> {option.label}
                </strong>
                <span>{option.description}</span>
              </div>

              <input
                type="checkbox"
                className="admin-toggle"
                checked={notificationSettings[option.key]}
                onChange={() => toggleNotification(option.key)}
              />
            </label>
          ))}
        </div>
      </section>

      <section className="admin-bookings-panel">
        <div className="admin-panel-header">
          <div>
            <h2>Workspace</h2>
            <p>Keep your data fresh or end your admin session.</p>
          </div>
        </div>

        <div className="admin-settings-actions">
          <button
            type="button"
            className="admin-view-all"
            onClick={loadBookings}
            disabled={bookingsLoading}
          >
            <RefreshCw size={16} />
            {bookingsLoading ? "Refreshing…" : "Refresh booking data"}
          </button>

          <button
            type="button"
            className="admin-danger-button"
            onClick={handleSignOut}
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </section>
    </>
  );

  /* ---------------------------------------------------------------- */
  /* Page switch                                                      */
  /* ---------------------------------------------------------------- */

  const renderActiveSection = () => {
    switch (activeSection) {
      case "Bookings":
        return renderBookings();
      case "Customers":
        return renderCustomers();
      case "Services":
        return renderServices();
      case "Settings":
        return renderSettings();
      case "Overview":
      default:
        return renderOverview();
    }
  };

  /* ---------------------------------------------------------------- */
  /* Layout                                                           */
  /* ---------------------------------------------------------------- */

  return (
    <div className="admin-dashboard">
      <aside className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="admin-brand">
          <div className="admin-brand-icon">
            <Camera size={23} />
          </div>

          <div>
            <h2>VISIONARY</h2>
            <span>STUDIOS ADMIN</span>
          </div>
        </div>

        <div className="admin-nav-label">WORKSPACE</div>

        <nav className="admin-navigation">
          {navigation.map(({ label, icon: Icon }) => (
            <button
              type="button"
              key={label}
              className={`admin-nav-item ${
                activeSection === label ? "active" : ""
              }`}
              aria-current={activeSection === label ? "page" : undefined}
              onClick={() => goTo(label)}
            >
              <Icon size={19} />
              <span>{label}</span>

              {activeSection === label && <span className="admin-active-dot" />}
            </button>
          ))}
        </nav>

        <div className="admin-sidebar-bottom">
          <div className="admin-profile">
            <div className="admin-avatar">VS</div>

            <div>
              <strong>{adminName}</strong>
              <span>Administrator</span>
            </div>
          </div>

          <button
            type="button"
            className="admin-sidebar-signout"
            onClick={handleSignOut}
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <button
            type="button"
            className="admin-mobile-menu"
            aria-label="Toggle navigation"
            aria-expanded={sidebarOpen}
            onClick={() => setSidebarOpen((open) => !open)}
          >
            <Menu size={22} />
          </button>

          <div className="admin-breadcrumb">
            <span>Workspace</span>
            <span>/</span>
            <strong>{activeSection}</strong>
          </div>

          <div className="admin-topbar-actions">
            <button
              type="button"
              className="admin-icon-button"
              aria-label="Search bookings, customers and services"
              onClick={() => setSearchOpen(true)}
            >
              <Search size={19} />
            </button>

            <div className="admin-notification-wrap" ref={notificationRef}>
              <button
                type="button"
                className="admin-icon-button"
                aria-label="Notifications"
                aria-expanded={notificationsOpen}
                onClick={() => setNotificationsOpen((open) => !open)}
              >
                <Bell size={19} />

                {notifications.length > 0 && (
                  <span className="admin-notification-dot" />
                )}
              </button>

              {notificationsOpen && (
                <div
                  className="admin-dropdown admin-notifications-panel"
                  role="dialog"
                  aria-label="Notifications"
                >
                  <div className="admin-dropdown-header">
                    <strong>Notifications</strong>
                    <span>
                      {notifications.length > 0
                        ? `${notifications.length} new`
                        : "All caught up"}
                    </span>
                  </div>

                  <div className="admin-dropdown-body">
                    {notifications.length === 0 ? (
                      <div className="admin-dropdown-empty">
                        <Inbox size={22} />
                        <p>No new notifications right now.</p>
                      </div>
                    ) : (
                      notifications.map(
                        ({ id, icon: Icon, tone, title, message, booking }) => (
                          <button
                            key={id}
                            type="button"
                            className="admin-notification-item"
                            onClick={() => {
                              setSelectedBooking(booking);
                              setNotificationsOpen(false);
                            }}
                          >
                            <span
                              className={`admin-notification-icon ${tone}`}
                            >
                              <Icon size={16} />
                            </span>

                            <span className="admin-notification-copy">
                              <strong>{title}</strong>
                              <span>{message}</span>
                            </span>

                            <ChevronRight size={16} />
                          </button>
                        )
                      )
                    )}
                  </div>

                  <div className="admin-dropdown-footer">
                    <button
                      type="button"
                      onClick={() => goTo("Bookings")}
                    >
                      View all bookings
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="admin-topbar-avatar">VS</div>
          </div>
        </header>

        <div className="admin-content">
          {renderActiveSection()}

          <footer className="admin-footer">
            <span>VISIONARY STUDIOS</span>

            <span>
              <TrendingUp size={14} />
              Creative excellence, managed.
            </span>
          </footer>
        </div>
      </main>

      {searchOpen && (
        <div
          className="admin-search-overlay"
          onClick={() => setSearchOpen(false)}
        >
          <div
            className="admin-search-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Search the workspace"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="admin-search-field">
              <Search size={18} />

              <input
                ref={searchInputRef}
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search bookings, customers or services…"
                aria-label="Search"
              />

              <button
                type="button"
                className="admin-search-close"
                aria-label="Close search"
                onClick={() => setSearchOpen(false)}
              >
                <X size={16} />
              </button>
            </div>

            <div className="admin-search-body">
              {!searchQuery.trim() ? (
                <div className="admin-search-hint">
                  <p>
                    Start typing to search across every booking, customer and
                    service — or jump straight to a page.
                  </p>

                  <div className="admin-search-chips">
                    {[
                      "Pending",
                      "Confirmed",
                      "Completed",
                      "Wedding Photography",
                    ].map((chip) => (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => setSearchQuery(chip)}
                      >
                        {chip}
                      </button>
                    ))}
                  </div>

                  <div className="admin-search-group">
                    <span className="admin-search-group-label">Pages</span>

                    {navigation.map(({ label, icon: Icon }) => (
                      <button
                        key={label}
                        type="button"
                        className="admin-search-row"
                        onClick={() => {
                          goTo(label);
                          setSearchQuery("");
                        }}
                      >
                        <span className="admin-search-row-icon">
                          <Icon size={16} />
                        </span>

                        <span className="admin-search-row-copy">
                          <strong>{label}</strong>
                          <span>Open the {label.toLowerCase()} page</span>
                        </span>

                        <ChevronRight size={16} />
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {sectionMatches.length > 0 && (
                    <div className="admin-search-group">
                      <span className="admin-search-group-label">Pages</span>

                      {sectionMatches.map(({ label, icon: Icon }) => (
                        <button
                          key={label}
                          type="button"
                          className="admin-search-row"
                          onClick={() => {
                            goTo(label);
                            setSearchQuery("");
                          }}
                        >
                          <span className="admin-search-row-icon">
                            <Icon size={16} />
                          </span>

                          <span className="admin-search-row-copy">
                            <strong>{label}</strong>
                            <span>Open the {label.toLowerCase()} page</span>
                          </span>

                          <ChevronRight size={16} />
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="admin-search-group">
                    <span className="admin-search-group-label">Bookings</span>

                    {searchResults.length === 0 ? (
                      <p className="admin-search-empty">
                        No bookings match “{searchQuery}”.
                      </p>
                    ) : (
                      searchResults.map((booking, index) => {
                        const name =
                          booking.full_name ||
                          booking.name ||
                          "Unnamed customer";

                        return (
                          <button
                            key={bookingKey(booking, index)}
                            type="button"
                            className="admin-search-row"
                            onClick={() => openBookingFromSearch(booking)}
                          >
                            <span className="admin-customer-avatar">
                              {initials(name)}
                            </span>

                            <span className="admin-search-row-copy">
                              <strong>{name}</strong>
                              <span>
                                {booking.service || "Session"} ·{" "}
                                {formatBookingDate(booking)}
                              </span>
                            </span>

                            <span
                              className={`admin-booking-status ${statusKey(
                                booking.status
                              )}`}
                            >
                              {booking.status || "Unknown"}
                            </span>
                          </button>
                        );
                      })
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {selectedBooking && (
        <div
          className="admin-modal-backdrop"
          onClick={() => setSelectedBooking(null)}
        >
          <section
            className="admin-booking-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="admin-modal-close"
              onClick={() => setSelectedBooking(null)}
              aria-label="Close booking details"
            >
              <X size={16} />
            </button>

            <h2 id="booking-modal-title">Booking Details</h2>

            <div className="admin-modal-grid">
              <p>
                <strong>Customer:</strong>{" "}
                {selectedBooking.full_name || selectedBooking.name || "—"}
              </p>
              <p>
                <strong>Email:</strong> {selectedBooking.email || "—"}
              </p>
              <p>
                <strong>Phone:</strong> {selectedBooking.phone || "—"}
              </p>
              <p>
                <strong>Service:</strong> {selectedBooking.service || "—"}
              </p>
              <p>
                <strong>Date:</strong> {formatBookingDate(selectedBooking)}
              </p>
              <p>
                <strong>Time:</strong> {selectedBooking.preferred_time || "—"}
              </p>
              <p>
                <strong>Location:</strong> {selectedBooking.location || "—"}
              </p>
              <p>
                <strong>Amount:</strong>{" "}
                {formatKsh(servicePrices[selectedBooking.service] || 0)}
              </p>
              <p className="admin-modal-full">
                <strong>Notes:</strong> {selectedBooking.notes || "—"}
              </p>
            </div>

            <label htmlFor="booking-status">Change status</label>

            <select
              id="booking-status"
              value={selectedBooking.status?.toLowerCase() || "pending"}
              disabled={updatingBookingId !== null}
              onChange={(event) =>
                updateBookingStatus(selectedBooking, event.target.value)
              }
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </section>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;