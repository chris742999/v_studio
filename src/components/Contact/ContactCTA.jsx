import { Link } from "react-router-dom";

export default function ContactCTA() {
  return (
    <section className="py-28 px-6">

      <div className="max-w-6xl mx-auto rounded-[40px] bg-gradient-to-r from-cyan-600/20 via-sky-500/20 to-violet-600/20 border border-cyan-400/20 p-16 text-center backdrop-blur-xl">

        <h2 className="text-5xl font-bold mb-6">
          Ready to Capture Your Story?
        </h2>

        <p className="text-slate-300 max-w-2xl mx-auto mb-10">
          Every unforgettable moment begins with a conversation. Let's plan your next photography experience together.
        </p>

        <Link
          to="/booking"
          className="inline-block rounded-full bg-cyan-500 px-10 py-4 font-semibold hover:bg-cyan-400 transition"
        >
          Book Your Session
        </Link>

      </div>

    </section>
  );
}