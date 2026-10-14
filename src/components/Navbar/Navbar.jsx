import { FaCamera, FaBars, FaTimes } from "react-icons/fa";
import { Link, NavLink } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 z-50 w-full">
      <nav className="relative mx-auto mt-4 flex w-[95%] max-w-7xl items-center justify-between rounded-2xl border border-white/10 bg-white/10 px-8 py-4 backdrop-blur-xl">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <FaCamera className="text-3xl text-cyan-400" />
          <h1 className="text-2xl font-bold">
            Visionary <span className="text-cyan-400">Studios</span>
          </h1>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden gap-8 font-medium md:flex">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `transition ${
                  isActive ? "text-cyan-400" : "hover:text-cyan-400"
                }`
              }
            >
              Home
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/services"
              className={({ isActive }) =>
                `transition ${
                  isActive ? "text-cyan-400" : "hover:text-cyan-400"
                }`
              }
            >
              Services
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/gallery"
              className={({ isActive }) =>
                `transition ${
                  isActive ? "text-cyan-400" : "hover:text-cyan-400"
                }`
              }
            >
              Gallery
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/booking"
              className={({ isActive }) =>
                `transition ${
                  isActive ? "text-cyan-400" : "hover:text-cyan-400"
                }`
              }
            >
              Booking
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `transition ${
                  isActive ? "text-cyan-400" : "hover:text-cyan-400"
                }`
              }
            >
              Contact
            </NavLink>
          </li>
        </ul>

        {/* Desktop CTA */}
        <Link
          to="/booking"
          className="hidden rounded-full bg-cyan-500 px-6 py-2 font-semibold transition hover:bg-cyan-400 md:inline-block"
        >
          Book Now
        </Link>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-2xl text-cyan-400 md:hidden"
          aria-label="Toggle navigation menu"
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="absolute left-0 top-full mt-3 w-full rounded-2xl border border-white/10 bg-slate-950/95 p-5 shadow-xl backdrop-blur-xl md:hidden">
            <ul className="flex flex-col gap-5 text-center font-medium">

              <li>
                <NavLink
                  to="/"
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `block transition ${
                      isActive
                        ? "text-cyan-400"
                        : "hover:text-cyan-400"
                    }`
                  }
                >
                  Home
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/services"
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `block transition ${
                      isActive
                        ? "text-cyan-400"
                        : "hover:text-cyan-400"
                    }`
                  }
                >
                  Services
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/gallery"
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `block transition ${
                      isActive
                        ? "text-cyan-400"
                        : "hover:text-cyan-400"
                    }`
                  }
                >
                  Gallery
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/booking"
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `block transition ${
                      isActive
                        ? "text-cyan-400"
                        : "hover:text-cyan-400"
                    }`
                  }
                >
                  Booking
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/contact"
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `block transition ${
                      isActive
                        ? "text-cyan-400"
                        : "hover:text-cyan-400"
                    }`
                  }
                >
                  Contact
                </NavLink>
              </li>

            </ul>
          </div>
        )}
      </nav>
    </header>
  );
}