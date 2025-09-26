import { Box, Flex, TabNav, Text } from "@radix-ui/themes";
import Logo from "../../assets/logo.png";
import { Link } from "react-router-dom";
import { React, useState } from "react";
import Menu from "../../assets/menu.png";
import Close from "../../assets/close.png";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className="shadow">
        <div className="flex justify-between items-center px-7 py-2.5">
          <a href="/">
            <img src={Logo} width="50" height="40" />
          </a>

          <div className="block md:hidden lg:hidden">
            <div onClick={() => setMenuOpen(true)} aria-label="Open Menu">
              <img src={Menu} width="30" height="30" />
            </div>
          </div>

          <ul className="lg:flex md:flex hidden gap-5 items-center text-gray-700">
            <li>
              <a href="chatbot" className="hover:text-gray-900">
                Chatbot
              </a>
            </li>
            <li>
              <a href="" className="hover:text-gray-900">
                Beli Rumah
              </a>
            </li>
            <li>
              <a href="/kpr" className="hover:text-gray-900">
                Hitung KPR
              </a>
            </li>
            <li>
              <a href="" className="hover:text-gray-900">
                Masuk
              </a>
            </li>
            <div className="bg-black w-0.5 h-7" />
            <li>
              <a href="" className="hover:text-gray-900">
                Daftar
              </a>
            </li>
          </ul>
        </div>
      </nav>
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-700 opacity-40 md:fixed lg:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        } lg:hidden`}
      >
        <div className="flex justify-end p-4">
          <div onClick={() => setMenuOpen(false)} aria-label="Close Menu">
            <a href="/">
              <img src={Close} width="50" height="50" />
            </a>
          </div>
        </div>
        <div className="flex flex-col space-y-6 p-6 font-medium text-gray-700">
          <a href="/chatbot" className="hover:text-gray-900">
            Chatbot
          </a>
          <a href="" className="hover:text-gray-900">
            Beli Rumah
          </a>
          <a href="/kpr" className="hover:text-gray-900">
            Hitung KPR
          </a>
          <div className="flex gap-5">
            <a href="" className="hover:text-gray-900">
              Masuk
            </a>
            <div className="bg-black w-0.5 h-7" />
            <a href="" className="hover:text-gray-900">
              Daftar
            </a>
          </div>
        </div>
      </div>
    </>
  );
}