import { Link } from "react-router-dom";

export default function GalleryCTA() {
  return (
    <section className="py-32 text-center">

      <h2 className="text-5xl font-bold mb-6">
        Ready to Capture Your Story?
      </h2>

      <p className="text-gray-400 max-w-2xl mx-auto mb-10">
        Whether it's a wedding, graduation, portrait session, or corporate
        event, let's create timeless images together.
      </p>

      <Link
  to="/booking#booking-form"
  className="
    inline-flex
    items-center
    justify-center
    px-10
    py-4
    rounded-full
    bg-cyan-500
    hover:bg-cyan-400
    transition
    font-semibold
    text-black
  "
>
  Book a Session
</Link>
    </section>
  );
}