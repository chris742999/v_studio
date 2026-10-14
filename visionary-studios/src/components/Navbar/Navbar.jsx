import { FaCamera } from "react-icons/fa";
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 z-50 w-full">
      <nav className="mx-auto mt-4 flex w-[95%] max-w-7xl items-center justify-between rounded-2xl border border-white/10 bg-white/10 px-8 py-4 backdrop-blur-xl">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <FaCamera className="text-3xl text-cyan-400" />
          <h1 className="text-2xl font-bold">
            Visionary <span className="text-cyan-400">Studios</span>
          </h1>
        </div>

        {/* Menu */}
<ul className="hidden gap-8 font-medium md:flex">
<li>
  <NavLink
    to="/"
    className={({ isActive }) =>
      `transition ${
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
    <Link
      to="/portfolio"
      className="transition hover:text-cyan-400"
    >
      Portfolio
    </Link>
  </li>

  <li>
  <NavLink
    to="/services"
    className={({ isActive }) =>
      `transition ${
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
    <Link
      to="/gallery"
      className="transition hover:text-cyan-400"
    >
      Gallery
    </Link>
  </li>

  <li>
    <NavLink
    to="/booking"
    className={({ isActive }) =>
      `transition ${
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
    <Link
      to="/contact"
      className="transition hover:text-cyan-400"
    >
      Contact
    </Link>
  </li>
</ul>

        {/* CTA */}
        <Link
  to="/booking"
  className="inline-block rounded-full bg-cyan-500 px-6 py-2 font-semibold transition hover:bg-cyan-400"
>
  Book Now
</Link>
      </nav>
    </header>
  );
}