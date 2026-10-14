import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { staggerCards } from "../../utils/animations";

const faqs = [
  {
    question: "How long does editing take?",
    answer:
      "Most projects are delivered within 7–14 working days depending on the package.",
  },
  {
    question: "Do you travel outside Nairobi?",
    answer:
      "Yes. We cover events across Kenya. Travel costs may apply depending on location.",
  },
  {
    question: "Can I reschedule my booking?",
    answer:
      "Yes. Rescheduling is allowed up to 48 hours before your booked date.",
  },
  {
    question: "Do you require a deposit?",
    answer:
      "Yes. A small deposit secures your booking while the remaining balance is paid later.",
  },
];

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    staggerCards(".faq-card");
  }, []);

  return (
    <section className="max-w-6xl mx-auto px-6 py-28">

      <h2 className="text-5xl font-bold text-center mb-16">
        Frequently Asked Questions
      </h2>

      <div className="space-y-5">

        {faqs.map((faq, index) => (
          <Accordion
            key={index}
            question={faq.question}
            answer={faq.answer}
            open={activeIndex === index}
            onOpen={() => setActiveIndex(index)}
            onClose={() => setActiveIndex(null)}
          />
        ))}

      </div>

    </section>
  );
}

function Accordion({
  question,
  answer,
  open,
  onOpen,
  onClose,
}) {
  return (
    <div
      onMouseEnter={onOpen}
      onMouseLeave={onClose}
      className={`faq-card overflow-hidden rounded-2xl backdrop-blur-xl cursor-pointer transition-all duration-500 ${
        open
          ? "bg-cyan-500/10 border border-cyan-400 shadow-[0_0_35px_rgba(34,211,238,.25)] scale-[1.02]"
          : "bg-white/5 border border-white/10 hover:border-cyan-400/40"
      }`}
    >

      <div className="flex items-center justify-between p-6">

        <span
          className={`text-lg font-semibold transition-colors duration-300 ${
            open ? "text-cyan-300" : "text-white"
          }`}
        >
          {question}
        </span>

        <ChevronDown
          size={22}
          className={`transition-all duration-500 ${
            open
              ? "rotate-180 text-cyan-400"
              : "text-gray-400"
          }`}
        />

      </div>

      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          open
            ? "max-h-52 opacity-100"
            : "max-h-0 opacity-0"
        }`}
      >

        <div className="px-6 pb-6 text-gray-300 leading-8">

          {answer}

        </div>

      </div>

    </div>
  );
}