import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Send } from "lucide-react";
import toast from "react-hot-toast";

export default function ContactForm() {
  const formRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  useEffect(() => {
    gsap.fromTo(
      formRef.current,
      {
        opacity: 0,
        x: -80,
      },
      {
        opacity: 1,
        x: 0,
        duration: 1,
        ease: "power3.out",
      }
    );
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Submitted!");
    console.log(formData);

    toast.success("Message sent successfully!");

    setFormData({
      name: "",
      email: "",
      message: "",
    });
  };

  return (
    <div
      id="contact-form"
      ref={formRef}
      className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 md:p-10 shadow-2xl shadow-cyan-500/10"
    >
      <h2 className="text-3xl font-bold mb-2">
        Send us a <span className="text-cyan-400">Message</span>
      </h2>

      <p className="text-gray-400 mb-8">
        We'd love to hear about your project.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <label className="block mb-2 text-sm text-gray-300">
            Full Name
          </label>

          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            className="w-full rounded-xl bg-white/5 border border-white/10 px-5 py-4 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block mb-2 text-sm text-gray-300">
            Email Address
          </label>

          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="john@example.com"
            className="w-full rounded-xl bg-white/5 border border-white/10 px-5 py-4 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition"
          />
        </div>

        {/* Message */}
        <div>
          <label className="block mb-2 text-sm text-gray-300">
            Message
          </label>

          <textarea
            rows={6}
            name="message"
            required
            value={formData.message}
            onChange={handleChange}
            placeholder="Tell us about your project..."
            className="w-full rounded-xl bg-white/5 border border-white/10 px-5 py-4 outline-none resize-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="group w-full flex items-center justify-center gap-3 py-4 rounded-xl bg-cyan-500 text-black font-semibold hover:bg-cyan-400 transition-all duration-300 shadow-lg shadow-cyan-500/30 hover:scale-[1.02]"
        >
          Send Message

          <Send
            size={18}
            className="group-hover:translate-x-1 transition-transform duration-300"
          />
        </button>
      </form>
    </div>
  );
}