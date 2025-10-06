import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import ProfileImage from "../../assets/profile.jpg"; // fallback jika tidak ada foto
import Logo from "../../assets/logo.png";
import Menu from "../../assets/menu.png";
import Close from "../../assets/close.png";
import { useNavigate } from "react-router-dom";

import {
  HalamanLogin,
  HalamanRegister,
  HalamanLKS,
  HalamanVerif,
} from "../../Pages/HalamanUtama";

export default function Navbar() {
  const navigate = useNavigate();
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showDaftarPopup, setShowDaftarPopup] = useState(false);
  const [showLKSPopup, setShowLKSPopup] = useState(false);
  const [showVerifPopup, setShowVerifPopup] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [verifData, setVerifData] = useState(null);
  const location = useLocation();

  // ✅ State untuk menyimpan URL foto profil
  const [profileImage, setProfileImage] = useState(ProfileImage);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setProfileImage(ProfileImage); // reset ke default
    navigate("/");
  };

  // ✅ Fungsi untuk update user & foto profil
  const updateUser = () => {
    if (localStorage.getItem("auth_fullname")) {
      setUser("Profile");
      // Ambil foto dari localStorage, atau gunakan default
      const savedImage = localStorage.getItem("foto_profil");
      if (savedImage) {
        // Jika ada nama file, bangun URL-nya
        const url = `https://smataco.my.id/dev/unez/CariRumahAja/foto/ProfilePicture/${savedImage}`;
        setProfileImage(url);
      } else {
        setProfileImage(ProfileImage);
      }
    } else {
      setUser(null);
      setProfileImage(ProfileImage);
    }
  };

  useEffect(() => {
    updateUser();
    window.addEventListener("storage", updateUser);
    return () => {
      window.removeEventListener("storage", updateUser);
    };
  }, []);

  const toggleLoginPopup = () => setShowLoginPopup(!showLoginPopup);
  const toggleDaftarPopup = () => setShowDaftarPopup(!showDaftarPopup);
  const toggleLKSPopup = () => setShowLKSPopup(!showLKSPopup);
  const toggleVerifPopup = () =>  setShowVerifPopup(!showLKSPopup);

  const closeVerifPopup = () => {
    setVerifData(null);
    setShowVerifPopup(false);
  };

  const openLksPopup = () => {
    setShowLoginPopup(false);
    setShowLKSPopup(true);
  };

  const handleRegisterSuccess = (data) => {
    setVerifData(data);
    setShowDaftarPopup(false);
    setShowVerifPopup(true);
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
            <img src={Logo} width="50" height="40" alt="Logo" />
          </Link>

          {/* Mobile menu icon */}
          <div className="block md:hidden lg:hidden">
            <div onClick={() => setMenuOpen(true)} aria-label="Open Menu">
              <img src={Menu} width="30" height="30" alt="Menu" />
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
              <Link to="/jualrumah" className={`hover:text-gray-500 ${isActive("/jualrumah")}`}>
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

            {/* Profil atau Login/Register */}
            {user ? (
              <li>
                <div className="relative">
                  <div
                    className="flex items-center cursor-pointer"
                    onClick={toggleDropdown}
                  >
                    {/* ✅ Gunakan profileImage yang diambil dari localStorage */}
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="rounded-full w-8"
                      onError={(e) => (e.currentTarget.src = ProfileImage)}
                    />
                  </div>

                  {isOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg border border-gray-200 z-50">
                      <ul className="py-2">
                        <li>
                          <Link
                            to="/profile"
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                          >
                            Profile
                          </Link>
                        </li>
                        <li>
                          <a
                            onClick={handleLogout}
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                          >
                            Logout
                          </a>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
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

      {/* Overlay mobile */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-700 opacity-40 md:hidden lg:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Sidebar Mobile */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out ${menuOpen ? "translate-x-0" : "translate-x-full"
          } lg:hidden md:block`}
      >
        <div className="flex justify-end p-4">
          <div onClick={() => setMenuOpen(false)} aria-label="Close Menu">
            <img src={Close} width="40" height="40" alt="Close" />
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
          <Link to="/jualrumah" className={`hover:text-gray-900 ${isActive("/jualrumah")}`}>
            Jual Rumah
          </Link>
          <Link to="/kpr" className={`hover:text-gray-900 ${isActive("/kpr")}`}>
            Hitung KPR
          </Link>

          {/* Mobile: Profil atau Login/Register */}
          {user ? (
            <div className="relative">
              <div
                className="flex items-center cursor-pointer"
                onClick={toggleDropdown}
              >
                {/* ✅ Gunakan profileImage */}
                <img
                  src={profileImage}
                  alt="Profile"
                  className="rounded-full w-8"
                  onError={(e) => (e.currentTarget.src = ProfileImage)}
                />
              </div>

              {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg border border-gray-200">
                  <ul className="py-2">
                    <li>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Profile
                      </Link>
                    </li>
                    <li>
                      <a
                        onClick={handleLogout}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                      >
                        Logout
                      </a>
                    </li>
                  </ul>
                </div>
              )}
            </div>
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
          <HalamanLogin close={toggleLoginPopup} routeLKS={openLksPopup} />
        </div>
      )}
      {showDaftarPopup && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <div
            onClick={toggleDaftarPopup}
            className="absolute inset-0 bg-black/35 backdrop-blur-md"
          />
          <HalamanRegister
            close={toggleDaftarPopup}
            onRegisterSuccess={handleRegisterSuccess}
          />
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
      {showVerifPopup && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <div
            onClick={toggleVerifPopup}
            className="absolute inset-0 bg-black/35 backdrop-blur-md"
          />
          <HalamanVerif
            close={closeVerifPopup}
            data={verifData}
            onUpdateUser={updateUser}
            isForgotPassword={true}
          />
        </div>
      )}
    </>
  );
}