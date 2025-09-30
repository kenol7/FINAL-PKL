import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "../../assets/logo.png";
import Menu from "../../assets/menu.png";
import Close from "../../assets/close.png";
import {
  HalamanLogin,
  HalamanRegister,
  HalamanLKS,
} from "../../Pages/HalamanUtama";

export default function Navbar() {
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showDaftarPopup, setShowDaftarPopup] = useState(false);
  const [showLKSPopup, setShowLKSPopup] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null); // ✅ state user
  const location = useLocation();

  useEffect(() => {
    const updateUser = () => {
      if (localStorage.getItem("auth_fullname")) {
        setUser("Profile");
      } else {
        setUser(null);
      }
    };

    // cek pertama kali
    updateUser();

    // kalau ada perubahan localStorage
    window.addEventListener("storage", updateUser);

    return () => {
      window.removeEventListener("storage", updateUser);
    };
  }, []);

  const toggleLoginPopup = () => setShowLoginPopup(!showLoginPopup);
  const toggleDaftarPopup = () => setShowDaftarPopup(!showDaftarPopup);
  const toggleLKSPopup = () => setShowLKSPopup(!showLKSPopup);
  const routelks = () => {
    toggleLoginPopup();
    toggleLKSPopup();
  };

  const isActive = (path) =>
    location.pathname === path
      ? "text-gray-700 font-semibold"
      : "text-gray-700";

  return (
    <>
      <nav className="shadow">
        <div className="flex justify-between items-center px-7 py-2.5">
          <Link to="/">
            <img src={Logo} width="50" height="40" />
          </Link>

          {/* Mobile menu icon */}
          <div className="block md:hidden lg:hidden">
            <div onClick={() => setMenuOpen(true)} aria-label="Open Menu">
              <img src={Menu} width="30" height="30" />
            </div>
          </div>

          {/* Desktop Menu */}
          <ul className="lg:flex md:flex hidden gap-5 items-center">
            <li>
              <Link
                to="/chatbot"
                className={`hover:text-gray-500 ${isActive("/chatbot")}`}
              >
                Chatbot
              </Link>
            </li>
            <li>
              <Link
                to="/beli"
                className={`hover:text-gray-500 ${isActive("/beli")}`}
              >
                Beli Rumah
              </Link>
            </li>
            <li>
              <Link to="" className={`hover:text-gray-500 ${isActive("")}`}>
                Jual Rumah
              </Link>
            </li>
            <li>
              <Link
                to="/kpr"
                className={`hover:text-gray-500 ${isActive("/kpr")}`}
              >
                Hitung KPR
              </Link>
            </li>

            {/* ✅ kalau ada user tampilkan profile, kalau tidak tampilkan login/register */}
            {user ? (
              <li>
                <Link
                  to="/profile"
                  className={`hover:text-gray-500 ${isActive("/profile")}`}
                >
                  {user}
                </Link>
              </li>
            ) : (
              <>
                <li>
                  <Link
                    to=""
                    onClick={toggleLoginPopup}
                    className={`hover:text-gray-500 ${isActive("/login")}`}
                  >
                    Masuk
                  </Link>
                </li>
                <div className="bg-black w-0.5 h-7" />
                <li>
                  <Link
                    to=""
                    onClick={toggleDaftarPopup}
                    className={`hover:text-gray-500 ${isActive("/register")}`}
                  >
                    Daftar
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>

      {/* Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-700 opacity-40 md:fixed lg:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Sidebar Mobile */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        } lg:hidden`}
      >
        <div className="flex justify-end p-4">
          <div onClick={() => setMenuOpen(false)} aria-label="Close Menu">
            <img src={Close} width="40" height="40" />
          </div>
        </div>
        <div className="flex flex-col space-y-6 p-6 font-medium">
          <Link
            to="/chatbot"
            className={`hover:text-gray-900 ${isActive("/chatbot")}`}
          >
            Chatbot
          </Link>
          <Link
            to="/beli"
            className={`hover:text-gray-900 ${isActive("/beli")}`}
          >
            Beli Rumah
          </Link>
          <Link to="" className={`hover:text-gray-900 ${isActive("")}`}>
            Jual Rumah
          </Link>
          <Link to="/kpr" className={`hover:text-gray-900 ${isActive("/kpr")}`}>
            Hitung KPR
          </Link>

          {/* ✅ Mobile juga cek login */}
          {user ? (
            <Link
              to="/profile"
              className={`hover:text-gray-900 ${isActive("/profile")}`}
            >
              {user}
            </Link>
          ) : (
            <div className="flex gap-5">
              <Link
                to=""
                onClick={toggleLoginPopup}
                className={`hover:text-gray-900 ${isActive("/login")}`}
              >
                Masuk
              </Link>
              <div className="bg-black w-0.5 h-7" />
              <Link
                to=""
                onClick={toggleDaftarPopup}
                className={`hover:text-gray-900 ${isActive("/register")}`}
              >
                Daftar
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Popups */}
      {showLoginPopup && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <div
            onClick={toggleLoginPopup}
            className="absolute inset-0 bg-black/35 backdrop-blur-md"
          />
          <HalamanLogin close={toggleLoginPopup} routeLKS={routelks} />
        </div>
      )}
      {showDaftarPopup && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <div
            onClick={toggleDaftarPopup}
            className="absolute inset-0 bg-black/35 backdrop-blur-md"
          />
          <HalamanRegister close={toggleDaftarPopup} />
        </div>
      )}
      {showLKSPopup && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <div
            onClick={toggleLKSPopup}
            className="absolute inset-0 bg-black/35 backdrop-blur-md"
          />
          <HalamanLKS close={toggleLKSPopup} />
        </div>
      )}
    </>
  );
}
