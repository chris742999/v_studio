import { useState } from "react";
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

function CustomerDashboard() {
  const [activeSection, setActiveSection] = useState("Overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

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
                  <h1>Your moments. Your memories.</h1>
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
                  <strong>—</strong>
                  <small>Loading account data soon</small>
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
                <div className="customer-empty-state">
                  <div className="customer-empty-icon">
                    <CalendarDays size={27} />
                  </div>
                  <h3>Your bookings will appear here</h3>
                  <p>
                    Once your account is connected, you can view your
                    bookings and track their status here.
                  </p>
                  <a href="/booking" className="customer-outline-button">
                    Book your first session
                  </a>
                </div>
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
              <div className="customer-empty-state">
                <CalendarDays size={32} />
                <h3>Your bookings will appear here</h3>
                <p>
                  Your personal booking records will be displayed after the
                  dashboard is connected to your account.
                </p>
                <a href="/booking" className="customer-primary-button">
                  Book a session
                </a>
              </div>
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
                <strong>— <small>points</small></strong>
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
                  <p>Earn 1 point for every KSh 100 spent on an eligible booking once completed and paid.</p>
                </article>
                <article className="customer-earning-card">
                  <div className="customer-stat-icon purple">
                    <UserRound size={22} />
                  </div>
                  <h3>Join the rewards club</h3>
                  <p>Receive 50 welcome points when you create your customer account.</p>
                </article>
                <article className="customer-earning-card">
                  <div className="customer-stat-icon cyan">
                    <Gift size={22} />
                  </div>
                  <h3>Refer a friend</h3>
                  <p>Earn 200 bonus points when your referred customer completes a qualifying paid booking.</p>
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
              <div className="customer-empty-state">
                <Settings size={32} />
                <h3>Your profile settings</h3>
                <p>
                  Your verified account details and profile editing options
                  will be connected in a later step.
                </p>
              </div>
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