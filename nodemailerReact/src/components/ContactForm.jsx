import React, { useState } from "react";
import axios from "axios";

export default function ContactForm() {
  const [recipient_email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMail = async () => {
    if (!recipient_email || !subject || !message) {
      alert("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      await axios.post("http://localhost:5000/send_email", {
        recipient_email,
        subject,
        message,
      });
      alert("🎉 Message sent successfully!");
      clearForm();
    } catch (err) {
      console.error(err);
      alert("❌ Failed to send message.");
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setEmail("");
    setSubject("");
    setMessage("");
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-white text-black py-10 px-4">
      <div className="w-full max-w-2xl text-left">
        <h2 className="text-3xl font-bold mb-2">Contact us</h2>
        <p className="text-lg text-gray-700 mb-8">
          Got any questions or suggestions? Fill out this form to reach out.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="Enter your name"
            className="border-b border-gray-400 outline-none placeholder-gray-500 text-black py-2 bg-transparent"
          />
          <input
            type="email"
            placeholder="Enter your email"
            value={recipient_email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-b border-gray-400 outline-none placeholder-gray-500 text-black py-2 bg-transparent"
            required
          />
        </div>

        <input
          type="text"
          placeholder="Enter subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full border-b border-gray-400 outline-none placeholder-gray-500 text-black py-2 mb-4 bg-transparent"
          required
        />

        <textarea
          placeholder="Enter your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          className="w-full border-b border-gray-400 outline-none placeholder-gray-500 text-black py-2 mb-8 resize-none bg-transparent"
          required
        ></textarea>

        <button
          onClick={sendMail}
          disabled={loading}
          className={`w-full border border-black text-black font-semibold py-3 text-center transition duration-200 ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-black hover:text-white"
          }`}
        >
          {loading ? "Sending..." : "SEND"}
        </button>

        <p className="text-sm text-gray-500 mt-6">
          You can email us directly at{" "}
          <a href="mailto:yashlalwani661@gmail.com" className="text-gray-700 underline">
            yashlalwani661@gmail.com
          </a>
        </p>
      </div>
    </section>
  );
}
