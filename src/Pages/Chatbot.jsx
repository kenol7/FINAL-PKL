import { Menu, Send, X, Edit } from "lucide-react";
import Navbar from "../Components/Elements/Navbar";
import { useState } from "react";

export default function ChatBot() {
  const [message, setMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <section className="min-h-screen">
        <Navbar />
        <div className="flex flex-col items-center gap-y-30 bg-white p-4 relative overflow-hidden">
          {/* Sidebar */}
          <div
            className={`fixed top-25 left-0 h-full w-64 bg-gray-100 shadow-lg transform transition-transform duration-300 z-50 ${
              isOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            {/* Header Sidebar */}
            <div className="flex items-center justify-between p-4 border-b bg-gray-100">
              <h2 className="font-semibold text-lg">History</h2>
              <button onClick={() => setIsOpen(false)} className="p-1">
                <X size={22} />
              </button>
            </div>

            {/* Content Sidebar */}
            <div className="p-4 space-y-1">
              {/* menu */}
              <button className="flex gap-2 ">
                <Edit size={20} />
                <p>New Chat</p>
              </button>
              <p className="mt-5">Chat</p>
              <div className="p-2 font-light rounded bg-none cursor-pointer hover:bg-gray-200">
                Carikan saya rumah.......
              </div>
              <div className="p-2 font-light rounded bg-none cursor-pointer hover:bg-gray-200">
                Apa saja funfact dari......
              </div>
              <div className="p-2 font-light rounded bg-none cursor-pointer hover:bg-gray-200">
                Properti apa saja yang......
              </div>
            </div>
          </div>

          {/* Header with toggle button */}
          <div className="w-full flex justify-start">
            <button onClick={() => setIsOpen(true)} className="p-2">
              <Menu size={24} />
            </button>
          </div>

          {/* Main Option */}
          <div className="grid grid-cols-2 gap-8">
            <button className="px-3 py-6 rounded-md bg-yellow-200 shadow border hover:bg-yellow-600 transition">
              Kalkulator KPR
            </button>
            <button className="px-3 py-6 rounded-md bg-yellow-200 shadow border hover:bg-yellow-600 transition">
              Cari rumah
            </button>
            <button className="px-3 py-6 rounded-md bg-yellow-200 shadow border hover:bg-yellow-600 transition">
              Tanya properti
            </button>
            <button className="px-3 py-6 rounded-md bg-yellow-200 shadow border hover:bg-yellow-600 transition">
              Funfact Lokasi Properti
            </button>
          </div>

          {/* Chatbot input */}
          <div className="w-full max-w-6xl flex items-center gap-1">
            <input
              type="text"
              placeholder="Ketik pesan..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 rounded-lg border border-yellow-300 px-4 py-3 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <button className="p-3 rounded-full hover:bg-gray-100 transition">
              <Send size={40} className="rotate-45" />
            </button>
          </div>
        </div>
      </section>
    </>
  );
}