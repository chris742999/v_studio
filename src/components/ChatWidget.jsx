import { useState, useRef, useEffect } from "react";
import studioKnowledge from "../data/studioKnowledge";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "Welcome to Visionary Studios. I'm your studio assistant. How can I help you today?",
    },
  ]);

  const messagesEndRef = useRef(null);

  // Keep the latest message visible
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isTyping]);

  const addMessage = (text, sender) => {
    setMessages((previous) => [
      ...previous,
      {
        id: Date.now() + Math.random(),
        sender,
        text,
      },
    ]);
  };

  const findService = (message) => {
    const lowerMessage = message.toLowerCase();

    return studioKnowledge.services.find((service) => {
      const serviceName = service.name.toLowerCase();

      return (
        lowerMessage.includes(serviceName) ||
        serviceName
          .split(" ")
          .some(
            (word) =>
              word.length > 4 && lowerMessage.includes(word)
          )
      );
    });
  };

  const generateResponse = (message) => {
    const text = message.toLowerCase().trim();

    // Greetings
    if (
      /^(hi|hello|hey|hey there|hiya|good morning|good afternoon|good evening)[!. ]*$/i.test(
        text
      )
    ) {
      return "Hey! 👋 Welcome to Visionary Studios. I'm here to help with photography, videography, services, pricing, and bookings. What would you like to know?";
    }

    // Thanks
    if (
      text.includes("thank you") ||
      text === "thanks" ||
      text.includes("thank u")
    ) {
      return "You're welcome! ✦ If you have any questions about photography, videography, packages, or booking a session, I'm happy to help.";
    }

    // Goodbye
    if (
      text === "bye" ||
      text === "goodbye" ||
      text.includes("see you")
    ) {
      return "Thanks for stopping by Visionary Studios. 👋 Whenever you're ready to create something memorable, we're here to help.";
    }

    // What can you do?
    if (
      text.includes("what can you do") ||
      text.includes("how can you help") ||
      text.includes("what do you help")
    ) {
      return "I can help you with Visionary Studios' photography and videography services, pricing, booking requirements, and contact information. I can also answer questions about our available creative services. 📸";
    }

    // Services overview
    if (
      text.includes("services") ||
      text.includes("what do you offer") ||
      text.includes("what do you guys do")
    ) {
      return `Visionary Studios offers a range of creative services including:

📸 Wedding Photography
🎉 Event Photography
💼 Commercial Photography
🧑‍🎤 Portrait Photography
🎓 Graduation Photography
🎂 Birthday Photography
🏢 Corporate Photography
📦 Product Photography
🚁 Drone Photography
🎬 Drone Cinematography
🎥 Videography

Ask me about any specific service and I can tell you more.`;
    }

    // Pricing overview
    if (
      text.includes("price") ||
      text.includes("pricing") ||
      text.includes("cost") ||
      text.includes("how much") ||
      text.includes("rates")
    ) {
      return `Here are our current listed starting prices:

💍 Wedding Photography — KSh 35,000
🎓 Graduation Photography — KSh 12,000
🎂 Birthday Photography — KSh 15,000
🧑‍🎤 Studio Portraits — KSh 8,000
🏢 Corporate Photography — KSh 20,000
📦 Product Photography — KSh 18,000
🚁 Drone Photography — KSh 25,000
🎥 Videography — KSh 40,000

Some services don't currently have a listed price, so I'd recommend contacting the studio for a quote.`;
    }

    // Specific service
    const service = findService(text);

    if (service) {
      if (service.price) {
        return `${service.name} is one of our available services.

${service.description}

💰 Current listed price: KSh ${service.price.toLocaleString()}

Would you like to know how to book it?`;
      }

      return `${service.name} is one of the creative services offered by Visionary Studios.

${service.description}

I don't currently have a listed price for this service, so the studio team would need to provide you with a quote.`;
    }

    // Booking
    if (
      text.includes("book") ||
      text.includes("booking") ||
      text.includes("reserve") ||
      text.includes("appointment")
    ) {
      return `Absolutely! 📅 You can book a Visionary Studios session through our booking form.

We'll need:

• Full name
• Email address
• Phone number
• Service
• Preferred date
• Preferred time
• Event location
• Additional notes

Once you submit the booking form, the studio team will contact you.`;
    }

    // Contact
    if (
      text.includes("contact") ||
      text.includes("phone number") ||
      text.includes("email") ||
      text.includes("reach you") ||
      text.includes("where are you")
    ) {
      return `You can reach Visionary Studios through:

📞 ${studioKnowledge.contact.phone}
📧 ${studioKnowledge.contact.email}
📍 ${studioKnowledge.contact.location}

You can also find us on social media as ${studioKnowledge.contact.socialHandle}.`;
    }

    // Location
    if (
      text.includes("location") ||
      text.includes("located") ||
      text.includes("where is the studio")
    ) {
      return `Visionary Studios is based in ${studioKnowledge.studio.location}. 📍`;
    }

    // Photography-related keywords
    const photographyKeywords = [
      "photo",
      "photography",
      "photographer",
      "portrait",
      "camera",
      "shoot",
      "session",
      "wedding",
      "graduation",
      "birthday",
      "event",
      "corporate",
      "commercial",
      "product",
      "drone",
      "videography",
      "video",
      "cinematic",
      "filming",
    ];

    const isPhotographyRelated = photographyKeywords.some((keyword) =>
      text.includes(keyword)
    );

    if (isPhotographyRelated) {
      return "That's something I can help with. 📸 Could you tell me a little more about the photography or videography service you're interested in?";
    }

    

  };

 
const handleSend = async (message = input) => {
  const cleanMessage = message.trim();

  if (!cleanMessage || isTyping) return;

  addMessage(cleanMessage, "user");
  setInput("");
  setIsTyping(true);

  try {
    const response = await fetch("http://localhost:3001/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: cleanMessage,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to get response");
    }

    const data = await response.json();

    addMessage(data.reply, "bot");
  } catch (error) {
    console.error("Chat error:", error);

    addMessage(
      "Sorry, I'm having trouble connecting right now. Please try again.",
      "bot"
    );
  } finally {
    setIsTyping(false);
  }
};


  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <>
   {/* Premium Floating Chat Launcher */}
<button
  onClick={() => setIsOpen((previous) => !previous)}
  className="group fixed bottom-6 right-6 z-[110] flex h-[62px] w-[62px] items-center justify-center rounded-full border border-cyan-300/30 bg-[#07111f]/90 shadow-[0_0_25px_rgba(34,211,238,.18),inset_0_0_20px_rgba(34,211,238,.08)] backdrop-blur-xl transition-all duration-500 hover:scale-110 hover:border-cyan-300/60 hover:shadow-[0_0_45px_rgba(34,211,238,.35),inset_0_0_25px_rgba(34,211,238,.12)]"
  aria-label="Open Visionary Studio Assistant"
>
  {/* Outer glow */}
  <span className="absolute inset-[-5px] rounded-full border border-cyan-400/10 opacity-0 transition-all duration-500 group-hover:scale-110 group-hover:opacity-100" />

  {/* Animated glow */}
  <span className="absolute inset-0 rounded-full bg-cyan-400/10 blur-md transition-opacity duration-500 group-hover:bg-cyan-400/20" />

  {isOpen ? (
    <span className="relative z-10 text-lg text-gray-300 transition-transform duration-300 group-hover:rotate-90">
      ✕
    </span>
  ) : (
    <div className="relative z-10 flex items-center justify-center">
      <span className="absolute h-7 w-7 animate-ping rounded-full bg-cyan-400/10" />
      <span className="text-2xl font-light text-cyan-300 drop-shadow-[0_0_10px_rgba(34,211,238,.8)] transition-transform duration-500 group-hover:rotate-12">
        ✦
      </span>
    </div>
  )}
</button>

      {/* Chat Window */}
      {isOpen && (
<div className="fixed bottom-24 right-6 z-[110] flex h-[540px] w-[380px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-3xl border border-cyan-300/20 bg-gradient-to-br from-[#071525]/95 via-[#050b16]/95 to-[#10091d]/95 shadow-[0_0_80px_rgba(34,211,238,.12),0_20px_80px_rgba(0,0,0,.45)] backdrop-blur-3xl">          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-cyan-400">✦</span>

                <h3 className="text-sm font-semibold tracking-wider text-white">
                  VISIONARY STUDIOS
                </h3>
              </div>

              <div className="mt-1 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,.8)]" />

                <p className="text-[11px] tracking-wide text-gray-400">
                  ONLINE SUPPORT
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 transition hover:text-white"
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-4 overflow-y-auto px-4 py-5">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-3 text-sm leading-6 ${
                    message.sender === "user"
                      ? "rounded-br-md bg-cyan-400 text-black"
                      : "rounded-bl-md border border-white/10 bg-white/[0.04] text-gray-200"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-md border border-white/10 bg-white/[0.04] px-4 py-3">
                  <div className="flex gap-1">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-400" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-400 [animation-delay:150ms]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan-400 [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-white/10 p-3">
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] p-1.5 transition focus-within:border-cyan-400/40">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleKeyDown}
                type="text"
                placeholder="Ask about photography..."
                className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-white outline-none placeholder:text-gray-600"
              />

              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || isTyping}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-400 text-black transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-30"
                aria-label="Send message"
              >
                ↑
              </button>
            </div>

            <p className="mt-2 text-center text-[10px] tracking-wide text-gray-600">
              VISIONARY STUDIOS • CREATIVE ASSISTANT
            </p>
          </div>
        </div>
      )}
    </>
  );
}