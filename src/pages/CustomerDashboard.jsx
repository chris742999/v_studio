import { useEffect, useState } from "react";
import {
  CalendarDays,
  Camera,
  Gift,
  History,
  LogOut,
  Menu,
  Settings,
  ShieldCheck,
  UserRound,
  Wallet,
  ChevronRight,
  CircleHelp,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import ScrollStopper from "./ScrollStopper";
import "./CustomerDashboard.css";

const navigation = [
  { label: "Overview", icon: Camera },
  { label: "My Bookings", icon: CalendarDays },
  { label: "Loyalty Rewards", icon: Gift },
  { label: "Points History", icon: History },
  { label: "My Profile", icon: UserRound },
];

function getTimeGreeting(date = new Date()) {
  const hour = date.getHours();

  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function CustomerDashboard() {
  const [activeSection, setActiveSection] = useState("Overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [bookings, setBookings] = useState([]);

  const [customer, setCustomer] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState("");

  const greeting = getTimeGreeting();
  const firstName = customer?.full_name?.trim().split(/\s+/)[0] || "";

  useEffect(() => {
    let active = true;

    async function loadCustomerProfile() {
      setProfileLoading(true);
      setProfileError("");

      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError) {
          throw authError;
        }

        if (!user) {
          throw new Error("Please sign in to view your customer profile.");
        }

        const { data, error } = await supabase
          .from("customers")
          .select("id, auth_user_id, full_name, email, phone")
          .eq("auth_user_id", user.id)
          .maybeSingle();

        if (error) {
          throw error;
        }

        if (!data) {
          throw new Error(
            "Your customer profile was not found. Please contact Visionary Studios."
          );
        }

        if (active) {
          setCustomer(data);
          const { data: bookingData, error: bookingError } = await supabase
            .from("bookings")
            .select(
              "id, full_name, service, preferred_date, preferred_time, location, status, created_at"
            )
            .eq("customer_id", data.id)
            .order("created_at", { ascending: false });

          if (bookingError) {
            throw bookingError;
          }

          if (active) {
            setBookings(bookingData || []);
          }
        }
      } catch (error) {
        console.error("Customer profile loading failed:", error.message);

        if (active) {
          setProfileError(error.message || "Unable to load your profile.");
        }
      } finally {
        if (active) {
          setProfileLoading(false);
        }
      }
    }

    loadCustomerProfile();

    return () => {
      active = false;
    };
  }, []);

  async function handleSignOut() {
    setSigningOut(true);

    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Sign-out failed:", error.message);
      setSigningOut(false);
      return;
    }

    window.location.assign("/login");
  }

  return (
    <div className="customer-dashboard">
      <aside
        className={`customer-sidebar ${
          mobileMenuOpen ? "customer-sidebar-open" : ""
        }`}
      >
        <div className="customer-brand">
          <div className="customer-brand-icon">
            <Camera size={23} />
          </div>
          <div>
            <h2>VISIONARY</h2>
            <span>STUDIOS</span>
          </div>
          <button
            className="customer-mobile-close"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close navigation"
          >
            ×
          </button>
        </div>

        <div className="customer-nav-label">CUSTOMER PORTAL</div>

        <nav className="customer-navigation">
          {navigation.map(({ label, icon: Icon }) => (
            <button
              key={label}
              className={`customer-nav-item ${
                activeSection === label ? "customer-nav-active" : ""
              }`}
              onClick={() => {
                setActiveSection(label);
                setMobileMenuOpen(false);
              }}
            >
              <Icon size={19} />
              <span>{label}</span>
              {activeSection === label && (
                <ChevronRight size={17} className="customer-nav-arrow" />
              )}
            </button>
          ))}
        </nav>

        <div className="customer-sidebar-bottom">
          <div className="customer-help-card">
            <CircleHelp size={21} />
            <strong>Need assistance?</strong>
            <p>Our team is here to help with your bookings.</p>
            <a href="/contact">Contact the studio →</a>
          </div>

          <button
            className="customer-signout"
            onClick={handleSignOut}
            disabled={signingOut}
          >
            <LogOut size={18} />
            {signingOut ? "Signing out..." : "Sign out"}
          </button>
        </div>
      </aside>

      {mobileMenuOpen && (
        <button
          className="customer-sidebar-overlay"
          onClick={() => setMobileMenuOpen(false)}
          aria-label="Close navigation menu"
        />
      )}

      <main className="customer-main">
        <header className="customer-topbar">
          <button
            className="customer-menu-toggle"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open navigation"
          >
            <Menu size={23} />
          </button>

          <div className="customer-breadcrumb">
            <span>Customer Portal</span>
            <ChevronRight size={15} />
            <strong>{activeSection}</strong>
          </div>

          <a href="/" className="customer-website-link">
            <Camera size={16} />
            <span>Visit website</span>
          </a>
        </header>

        <div className="customer-content">
          {activeSection === "Overview" && (
            <>
              <section className="customer-welcome">
                <div>
                  <span className="customer-eyebrow">
                    YOUR VISIONARY EXPERIENCE
                  </span>
                  <h1>
                    {customer
                      ? `${greeting}, ${firstName || "there"}!`
                      : `${greeting}!`}
                  </h1>
                  <p>
                    Manage your photography sessions and discover your
                    exclusive customer rewards.
                  </p>
                  <a href="/booking" className="customer-primary-button">
                    <CalendarDays size={18} />
                    Book a session
                  </a>
                </div>
                <div className="customer-welcome-art">
                  <div className="customer-art-glow" />
                  <ScrollStopper />
                </div>
              </section>

              <section className="customer-section-heading">
                <div>
                  <h2>Your account at a glance</h2>
                  <p>Your personal booking and rewards summary.</p>
                </div>
              </section>

              <div className="customer-stat-grid">
                <article className="customer-stat-card">
                  <div className="customer-stat-icon blue">
                    <CalendarDays size={22} />
                  </div>
                  <span>Total bookings</span>
                  <strong>{profileLoading ? "—" : bookings.length}</strong>
                  <small>Bookings linked to your account</small>
                </article>

                <article className="customer-stat-card">
                  <div className="customer-stat-icon purple">
                    <Wallet size={22} />
                  </div>
                  <span>Available points</span>
                  <strong>—</strong>
                  <small>Your redeemable rewards balance</small>
                </article>

                <article className="customer-stat-card">
                  <div className="customer-stat-icon cyan">
                    <Gift size={22} />
                  </div>
                  <span>Rewards redeemed</span>
                  <strong>—</strong>
                  <small>Your points redemption history</small>
                </article>
              </div>

              <section className="customer-rewards-banner">
                <div className="customer-rewards-icon">
                  <Gift size={27} />
                </div>
                <div className="customer-rewards-copy">
                  <span>THE VISIONARY REWARDS CLUB</span>
                  <h2>Every session brings you closer to a reward.</h2>
                  <p>
                    Earn 1 point for every KSh 100 spent on eligible completed
                    bookings. Each point is worth KSh 1 when redeemed.
                  </p>
                </div>
                <button
                  className="customer-secondary-button"
                  onClick={() => setActiveSection("Loyalty Rewards")}
                >
                  Explore rewards <ChevronRight size={17} />
                </button>
              </section>

              <section className="customer-empty-panel">
                <div className="customer-panel-heading">
                  <div>
                    <h2>Recent bookings</h2>
                    <p>Your latest photography and videography sessions.</p>
                  </div>

                  <button
                    className="customer-text-button"
                    onClick={() => setActiveSection("My Bookings")}
                  >
                    View all <ChevronRight size={16} />
                  </button>
                </div>

                {profileLoading ? (
                  <div className="customer-empty-state">
                    <p>Loading your recent bookings...</p>
                  </div>
                ) : profileError ? (
                  <div className="customer-empty-state">
                    <h3>Unable to load recent bookings</h3>
                    <p>{profileError}</p>
                  </div>
                ) : bookings.length === 0 ? (
                  <div className="customer-empty-state">
                    <div className="customer-empty-icon">
                      <CalendarDays size={27} />
                    </div>
                    <h3>No bookings yet</h3>
                    <p>Your future sessions will appear here.</p>
                    <a href="/booking" className="customer-outline-button">
                      Book your first session
                    </a>
                  </div>
                ) : (
                  <div className="customer-booking-list">
                    {bookings.slice(0, 3).map((booking) => (
                      <article
                        className="customer-booking-card"
                        key={booking.id}
                      >
                        <div className="customer-booking-heading">
                          <div>
                            <h3>{booking.service || "Photography session"}</h3>
                            <small>
                              {booking.preferred_date
                                ? new Date(
                                    `${booking.preferred_date}T00:00:00`
                                  ).toLocaleDateString()
                                : "Date not specified"}
                            </small>
                          </div>

                          <span
                            className={`customer-booking-status status-${(
                              booking.status || "pending"
                            )
                              .toLowerCase()
                              .replace(/[^a-z0-9]+/g, "-")}`}
                          >
                            {booking.status || "Pending"}
                          </span>
                        </div>
                      </article>
                    ))}

                    <button
                      className="customer-text-button"
                      onClick={() => setActiveSection("My Bookings")}
                    >
                      View all bookings <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </section>
            </>
          )}

          {activeSection === "My Bookings" && (
            <section className="customer-page-panel">
              <span className="customer-eyebrow">YOUR SESSIONS</span>
              <h1>My Bookings</h1>
              <p>
                View your upcoming sessions, previous bookings and booking
                status.
              </p>

              {profileLoading ? (
                <div className="customer-empty-state">
                  <p>Loading your bookings...</p>
                </div>
              ) : profileError ? (
                <div className="customer-empty-state">
                  <CalendarDays size={32} />
                  <h3>Unable to load bookings</h3>
                  <p>{profileError}</p>
                </div>
              ) : bookings.length === 0 ? (
                <div className="customer-empty-state">
                  <CalendarDays size={32} />
                  <h3>No bookings yet</h3>
                  <p>
                    When you make a booking while signed in to your account,
                    your sessions will appear here.
                  </p>
                  <a href="/booking" className="customer-primary-button">
                    Book a session
                  </a>
                </div>
              ) : (
                <div className="customer-booking-list">
                  {bookings.map((booking) => (
                    <article className="customer-booking-card" key={booking.id}>
                      <div className="customer-booking-heading">
                        <div>
                          <span className="customer-eyebrow">SERVICE</span>
                          <h3>{booking.service || "Photography session"}</h3>
                        </div>

                        <span
                          className={`customer-booking-status status-${(
                            booking.status || "pending"
                          )
                            .toLowerCase()
                            .replace(/[^a-z0-9]+/g, "-")}`}
                        >
                          {booking.status || "Pending"}
                        </span>
                      </div>

                      <div className="customer-booking-details">
                        <p>
                          <CalendarDays size={16} />
                          <span>
                            <strong>Date:</strong>{" "}
                            {booking.preferred_date
                              ? new Date(
                                  `${booking.preferred_date}T00:00:00`
                                ).toLocaleDateString()
                              : "Not specified"}
                          </span>
                        </p>

                        {booking.preferred_time && (
                          <p>
                            <strong>Time:</strong> {booking.preferred_time}
                          </p>
                        )}

                        {booking.location && (
                          <p>
                            <strong>Location:</strong> {booking.location}
                          </p>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          )}

          {activeSection === "Loyalty Rewards" && (
            <section className="customer-page-panel">
              <span className="customer-eyebrow">VISIONARY REWARDS CLUB</span>
              <h1>Your loyalty rewards</h1>
              <p>
                Get rewarded for choosing Visionary Studios for your special
                moments.
              </p>

              <div className="customer-points-card">
                <div className="customer-points-card-top">
                  <Gift size={25} />
                  <span>AVAILABLE POINTS</span>
                </div>
                <strong>
                  — <small>points</small>
                </strong>
                <p>Your real points balance will appear here.</p>
                <div className="customer-points-value">
                  <Wallet size={18} />
                  <span>Redemption value: KSh 1 per point</span>
                </div>
              </div>

              <div className="customer-section-heading">
                <div>
                  <h2>Ways to earn</h2>
                  <p>Earn points through eligible activity.</p>
                </div>
              </div>

              <div className="customer-earning-grid">
                <article className="customer-earning-card">
                  <div className="customer-stat-icon blue">
                    <Camera size={22} />
                  </div>
                  <h3>Book a session</h3>
                  <p>
                    Earn 1 point for every KSh 100 spent on an eligible booking
                    once completed and paid.
                  </p>
                </article>
                <article className="customer-earning-card">
                  <div className="customer-stat-icon purple">
                    <UserRound size={22} />
                  </div>
                  <h3>Join the rewards club</h3>
                  <p>
                    Receive 50 welcome points when you create your customer
                    account.
                  </p>
                </article>
                <article className="customer-earning-card">
                  <div className="customer-stat-icon cyan">
                    <Gift size={22} />
                  </div>
                  <h3>Refer a friend</h3>
                  <p>
                    Earn 200 bonus points when your referred customer completes
                    a qualifying paid booking.
                  </p>
                </article>
              </div>

              <div className="customer-empty-state customer-redemption-state">
                <Wallet size={30} />
                <h3>Redeem your points</h3>
                <p>
                  Once your rewards balance is connected, eligible points can
                  be applied as a discount to a future booking.
                </p>
              </div>
            </section>
          )}

          {activeSection === "Points History" && (
            <section className="customer-page-panel">
              <span className="customer-eyebrow">YOUR REWARDS ACTIVITY</span>
              <h1>Points history</h1>
              <p>Keep track of points earned, redeemed and adjusted.</p>
              <div className="customer-empty-state">
                <History size={32} />
                <h3>No points activity to display yet</h3>
                <p>
                  Your rewards transaction history will appear here once
                  connected to the loyalty system.
                </p>
              </div>
            </section>
          )}

          {activeSection === "My Profile" && (
            <section className="customer-page-panel">
              <span className="customer-eyebrow">YOUR ACCOUNT</span>
              <h1>My Profile</h1>
              <p>Manage your customer account and personal information.</p>

              {profileLoading ? (
                <div className="customer-empty-state">
                  <p>Loading your profile...</p>
                </div>
              ) : profileError ? (
                <div className="customer-empty-state">
                  <UserRound size={32} />
                  <h3>Unable to load profile</h3>
                  <p>{profileError}</p>
                </div>
              ) : customer ? (
                <div className="customer-empty-state">
                  <UserRound size={32} />
                  <h3>{customer.full_name || "Customer"}</h3>

                  <div className="customer-profile-details">
                    <p>
                      <strong>Full name:</strong>{" "}
                      {customer.full_name || "Not provided"}
                    </p>

                    <p>
                      <strong>Email:</strong> {customer.email || "Not provided"}
                    </p>

                    <p>
                      <strong>Phone:</strong> {customer.phone || "Not provided"}
                    </p>
                  </div>

                  <p>
                    These details are loaded from your Visionary Studios
                    customer account.
                  </p>
                </div>
              ) : null}
            </section>
          )}

          <footer className="customer-footer">
            <span>© {new Date().getFullYear()} Visionary Studios</span>
            <span>
              <ShieldCheck size={14} /> Your moments, captured beautifully.
            </span>
          </footer>
        </div>
      </main>
    </div>
  );
}

export default CustomerDashboard;