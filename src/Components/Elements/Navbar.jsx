import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "../../assets/logo.png";
import Menu from "../../assets/menu.png";
import Close from "../../assets/close.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API from "../../Config/Endpoint"
import { useUserProfile } from "../../hooks/useUserProfile";
// import ProtectedRoute from "../Fragments/protectedRoute";

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
  const user = useUserProfile();
  const [menuOpen, setMenuOpen] = useState(false);
  // const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [verifData, setVerifData] = useState(null);
  const location = useLocation();

  // const [profileImage, setProfileImage] = useState();

  const toggleDropdown = () => setIsOpen(!isOpen);
  const endPoint = API.endpointregist

  const [profile, setProfile] = useState({
    nama: "",
    lokasi: "",
    email: "",
    phone: "",
    profil: "",
  });

  const handleLogout = async () => {
    const email = localStorage.getItem("auth_email");

    try {
      const payload = {
        mode: 'POST',
        action: 'logout',
        email: email
      };
      fetch(endPoint, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload) 
      })
      .then(res => res.json())
      .then(response => {
        if (response.status === "success") {
          alert("Berhasil Logout!", "success");
    }});
      localStorage.removeItem("auth_email");
      localStorage.removeItem("auth_fullname");
      localStorage.removeItem("auth_phone");
      localStorage.removeItem("foto_profil");

      window.dispatchEvent(new Event("storage"));

      setProfile({ nama: "", lokasi: "", email: "", phone: "" });
      navigate("/");
    } catch (error) {
      console.error("Gagal logout dari server:", error);
      localStorage.removeItem("auth_email");
      localStorage.removeItem("auth_fullname");
      localStorage.removeItem("auth_phone");
      localStorage.removeItem("foto_profil");
      window.dispatchEvent(new Event("storage"));
      navigate("/");
    }
  };


  // const updateUser = () => {
  //   const hasAuth = Boolean(
  //     localStorage.getItem("auth_email") &&
  //     localStorage.getItem("auth_fullname")
  //   );

  //   if (hasAuth && user !== "Profile") {
  //     setUser("Profile");
  //     const savedImage = localStorage.getItem("foto_profil");
  //     if (savedImage) {
  //       const url = `https://smataco.my.id/dev/unez/CariRumahAja/foto/ProfilePicture/${savedImage.trim()}`;
  //       setProfileImage(url);
  //     } else {
  //       setProfileImage("https://smataco.my.id/dev/unez/CariRumahAja/foto/ProfilePicture/noProfilePict/noprofile_pict.jpeg");
  //     }
  //   } else if (!hasAuth && user !== null) {
  //     setUser(null);
  //     setProfileImage("https://smataco.my.id/dev/unez/CariRumahAja/foto/ProfilePicture/noProfilePict/noprofile_pict.jpeg");
  //   }
  // };

  // useEffect(() => {
  //   updateUser();
  //   window.addEventListener("storage", updateUser);
  //   return () => {
  //     window.removeEventListener("storage", updateUser);
  //   };
  // }, []);

  const toggleLoginPopup = () => setShowLoginPopup(!showLoginPopup);
  const toggleDaftarPopup = () => setShowDaftarPopup(!showDaftarPopup);
  const toggleLKSPopup = () => setShowLKSPopup(!showLKSPopup);
  const toggleVerifPopup = () => setShowVerifPopup(!showLKSPopup);

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

  const handleBackToLogin = () => {
    setShowLKSPopup(false);
    setShowLoginPopup(true);
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
              <Link
                to="/jualrumah"
                className={`hover:text-gray-500 ${isActive("/jualrumah")}`}
              >
                Jual Rumah
              </Link>
            </li>
            <li>
              <Link
                to="/kpr"
                className={`hover:text-gray-500 ${isActive("/kpr")}`}
              >
                Simulasi KPR
              </Link>
            </li>

            {user.email ? (
              <li>
                <div className="relative">
                  <div
                    className="flex items-center cursor-pointer"
                    onClick={toggleDropdown}
                  >
                    <img
                      src={
                        user.foto?.startsWith("http")
                          ? user.foto
                          : `https://smataco.my.id/dev/unez/CariRumahAja/foto/ProfilePicture/${user.foto}`
                      }
                      alt="Profile"
                      className="rounded-full w-8 h-8 object-cover"
                      onError={(e) => {
                        if (e.currentTarget.src !== "https://smataco.my.id/dev/unez/CariRumahAja/foto/ProfilePicture/noProfilePict/noprofile_pict.jpeg") {
                          e.currentTarget.src = "https://smataco.my.id/dev/unez/CariRumahAja/foto/ProfilePicture/noProfilePict/noprofile_pict.jpeg";
                        }
                      }}
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
        {/* Tombol close */}
        <div className="flex justify-end p-4">
          <button onClick={() => setMenuOpen(false)} aria-label="Close Menu">
            <img src={Close} width="40" height="40" alt="Close" />
          </button>
        </div>

        {/* Isi menu mobile */}
        <div className="flex flex-col space-y-6 p-6 font-medium">
          <Link
            to="/chatbot"
            className={`hover:text-gray-900 ${isActive("/chatbot")}`}
            onClick={() => setMenuOpen(false)}
          >
            Chatbot
          </Link>
          <Link
            to="/beli"
            className={`hover:text-gray-900 ${isActive("/beli")}`}
            onClick={() => setMenuOpen(false)}
          >
            Beli Rumah
          </Link>
          <Link
            to="/jualrumah"
            className={`hover:text-gray-900 ${isActive("/jualrumah")}`}
            onClick={() => setMenuOpen(false)}
          >
            Jual Rumah
          </Link>
          <Link
            to="/kpr"
            className={`hover:text-gray-900 ${isActive("/kpr")}`}
            onClick={() => setMenuOpen(false)}
          >
            Simulasi KPR
          </Link>

          <div className="mt-6">
            {user.email ? (
              <div className="relative">
                {/* Avatar */}
                <div
                  className="flex items-center cursor-pointer"
                  onClick={toggleDropdown}
                >
                  <img
                    src={
                      user.foto?.startsWith("http")
                        ? user.foto
                        : `https://smataco.my.id/dev/unez/CariRumahAja/foto/ProfilePicture/${user.foto}`
                    }
                    alt="Profile"
                    className="rounded-full w-8 h-8 object-cover"
                    onError={(e) => {
                      if (e.currentTarget.src !== "https://smataco.my.id/dev/unez/CariRumahAja/foto/ProfilePicture/noProfilePict/noprofile_pict.jpeg") {
                        e.currentTarget.src = "https://smataco.my.id/dev/unez/CariRumahAja/foto/ProfilePicture/noProfilePict/noprofile_pict.jpeg";
                      }
                    }}
                  />
                  <span className="ml-3 font-semibold text-gray-800">
                    {user.name || "User"}
                  </span>
                </div>

                {/* Dropdown mobile */}
                {isOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg border border-gray-200">
                    <ul className="py-2">
                      <li>
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                          onClick={() => {
                            setMenuOpen(false);
                            setIsOpen(false);
                          }}
                        >
                          Profile
                        </Link>
                      </li>
                      <li>
                        <button
                          onClick={() => {
                            handleLogout();
                            setMenuOpen(false);
                            setIsOpen(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <button
                  onClick={() => {
                    toggleLoginPopup();
                    setMenuOpen(false);
                  }}
                  className={`hover:text-gray-900 ${isActive("/login")}`}
                >
                  Masuk
                </button>
                <div className="bg-black w-0.5 h-7" />
                <button
                  onClick={() => {
                    toggleDaftarPopup();
                    setMenuOpen(false);
                  }}
                  className={`hover:text-gray-900 ${isActive("/register")}`}
                >
                  Daftar
                </button>
              </div>
            )}
          </div>
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
            onClick={handleBackToLogin}
            className="absolute inset-0 bg-black/35 backdrop-blur-md"
          />
          <HalamanLKS
            close={handleBackToLogin}
            onBackToLogin={handleBackToLogin}
          />
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
            onUpdateUser={() => {
              window.dispatchEvent(new Event("storage"))}}
            isForgotPassword={true}
          />
        </div>
      )}
    </>
  );
}