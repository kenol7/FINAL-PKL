import React, { useEffect, useState, useRef } from "react";
import Navbar from "../Components/Elements/Navbar";
import Footer from "../Components/Elements/Footer";
// import ProfileImage from "../assets/profile.jpg";
import Jual from "../assets/sale-01.png";
import Edit from "../assets/edit.png";
import { Bookmark } from "lucide-react";
import { HalamanUbahProfile, HalamanKSB } from "../Pages/HalamanUtama";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API from "../Config/Endpoint";
import introJs from "intro.js";
import "intro.js/minified/introjs.min.css";

export default function Profile(props) {
  const [profile, setProfile] = useState({
    nama: "",
    lokasi: "",
    email: "",
    phone: "",
    profil: "",
  });

  const endPoint = API.endpointregist
  const ProfileImage =
    "https://smataco.my.id/dev/unez/CariRumahAja/foto/ProfilePicture/noProfilePict/noprofile_pict.jpeg";
  const fotoProfil = profile.profil
    ? `https://smataco.my.id/dev/unez/CariRumahAja/foto/ProfilePicture/${
        profile.profil
      }?t=${Date.now()}`
    : ProfileImage;

  const [showUbahPopup, setShowUbahPopup] = useState(false);
  const toggleUbahPopup = () => setShowUbahPopup(!showUbahPopup);
  const [showUbahPassword, setShowUbahPassword] = useState(false);
  const toggleUbahPassword = () => setShowUbahPassword(!showUbahPassword);
  const [showEdit, setShowEdit] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imageError, setImageError] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const KeyMaps = "AIzaSyDtRAmlhx3Ada5pVl5ilzeHP67TLxO6pyo";
  const [favorites, setFavorites] = useState([]);
  const [jual, setJual] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchjual, setSearchJual] = useState("");

  const hasRunIntro = useRef(false);

  const checkIntroStatus = () => {
    const seen = 
      localStorage.getItem("profile_intro_seen");
      return seen === "true"
  };

  const runIntro = () => {
    const intro = introJs();
    intro.setOptions({
      steps: [
        {
          element: "#btn-edit-foto",
          intro: "Klik di sini untuk mengganti foto profil Anda.",
          position: "bottom",
        },
        {
          element: "#card-data-profil",
          intro:
            "Di sini Anda dapat melihat data profil seperti nama, email, lokasi, dan nomor HP.",
          position: "right",
        },
        {
          element: "#btn-ubah-data",
          intro:
            "Gunakan tombol ini untuk memperbarui data profil Anda seperti nama atau nomor telepon.",
          position: "bottom",
        },
        {
          element: "#btn-ubah-password",
          intro: "Gunakan tombol ini untuk mengganti password akun Anda.",
          position: "bottom",
        },
      ],
      disableInteraction: true,
      showProgress: true,
      showBullets: false,
      nextLabel: "Lanjut →",
      prevLabel: "← Kembali",
      doneLabel: "Selesai",
    });

    // Jalankan setelah sedikit delay agar DOM siap
    setTimeout(() => {
      intro.start();
    }, 800);

    // Saat user selesai atau skip → simpan status ke localStorage
    intro.oncomplete(() => {
      localStorage.setItem("profile_intro_seen", "true");
      handleTooltips()
    });
    
    intro.onexit(() => {
      localStorage.setItem("profile_intro_seen", "true");
      handleTooltips()
    });
  }

  const [hasSeenIntro, setHasSeenIntro] = useState(checkIntroStatus());

  useEffect(() => {
    const hasSeenIntro = localStorage.getItem("profile_intro_seen");

    if (!hasRunIntro.current && !hasSeenIntro) {
      hasRunIntro.current = true;
      runIntro();
      setHasSeenIntro(true);
}
}, [hasSeenIntro]);

  const maskPhone = (phone) => {
    if (!phone) return "";
    const cleanPhone = phone.toString().trim();

    if (cleanPhone.length <= 5) {
      return "*".repeat(cleanPhone.length);
    }

    const visiblePart = cleanPhone.slice(0, -8);
    return visiblePart + "********";
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const cleanedFileName = file.name.replace(/\s+/g, "_");

      const cleanedFile = new File([file], cleanedFileName, {
        type: file.type,
      });

      const fileSizeInMB = file.size / (1024 * 1024);
      console.log(fileSizeInMB);
      if (fileSizeInMB > 2) {
        alert("File size exceeds 2MB. Please select a smaller file.");
        setSelectedImage(null);
        setImageFile(null);
      } else {
        alert("");
        setSelectedImage(URL.createObjectURL(cleanedFile));
        setImageFile(cleanedFile);
      }
    }
  };

  useEffect(() => {
    console.log(API.endpointBookmark);
    fetch(
      API.endpointBookmark +
        "?mode=get&email=" +
        localStorage.getItem("auth_email")
    )
      .then((res) => res.json())
      .then((response) => {
        setFavorites(response);
      })
      .catch((error) => console.log(error));
  }, []);

  const handleEditClick = () => {
    setShowEdit(!showEdit); // Toggle the form visibility
  };

  const handlePasswordUpdate = () => {};

  const handleTooltips = async () => {
    const email = localStorage.getItem("auth_email");
    try{
      const payload = {
        mode : 'UPDATE',
        action : 'tooltipsProfile',
        email: email
      };
      fetch(endPoint, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload) 
      })
      .then(res => res.json())
    } catch{
      console.error("Gagal:", error);
    }
  }

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
        }})
      // Hanya hapus data auth, BUKAN favorites
      localStorage.removeItem("auth_email");
      localStorage.removeItem("auth_fullname");
      localStorage.removeItem("auth_phone");
      localStorage.removeItem("foto_profil");

      setUser(null);
      setProfile({ nama: "", lokasi: "", email: "", phone: "" });
      navigate("/");
    } catch (error) {
      console.error("Gagal logout dari server:", error);
      // Tetap hapus auth data saja
      localStorage.removeItem("auth_email");
      localStorage.removeItem("auth_fullname");
      localStorage.removeItem("auth_phone");
      localStorage.removeItem("foto_profil");
      navigate("/");
    }
  };

  const uploadImage = async () => {
    if (!imageFile) return;

    const formData = new FormData();
    formData.append("mode", "UPDATE");
    formData.append("action", "updateProfilePicture");
    formData.append("email", profile.email);
    formData.append("image", imageFile);
    try {
      const response = await axios.post(
        "https://smataco.my.id/dev/unez/CariRumahAja/routes/user.php", // Correct API endpoint
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Ensure the content type is set correctly for file upload
          },
        }
      );

      // Handle successful response
      localStorage.setItem("foto_profil", response.data.filename);

      window.dispatchEvent(new Event("storage"));

      setProfile((prev) => ({
        ...prev,
        profil: response.data.filename,
      }));
      setShowEdit(false);
    } catch (error) {
      // Handle error: display it for debugging
      console.error(
        "Error uploading image:",
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    const storedFullname = localStorage.getItem("auth_fullname");
    const storedEmail = localStorage.getItem("auth_email");
    const storedPhone = localStorage.getItem("auth_phone");
    const storedProfil = localStorage.getItem("foto_profil");

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},${position.coords.longitude}&key=${KeyMaps}`
        )
          .then((res) => res.json())
          .then((response) => {
            const city = response.results[0].address_components.find(
              (component) =>
                component.types[0].includes("administrative_area_level_2")
            ).long_name;
            setProfile((c) => ({ ...c, lokasi: city }));
          });
      });
    }

    setProfile({
      nama: storedFullname || "Yang Jungwon",
      lokasi: " ",
      email: storedEmail || "yangjungwon@gmail.com",
      phone: storedPhone || "088888888888",
      profil: storedProfil,
    });
  }, []);

  const handleProfileUpdate = (updatedData) => {
    localStorage.setItem("auth_fullname", updatedData.nama);
    localStorage.setItem("auth_phone", updatedData.phone);

    setProfile(updatedData);
    setShowUbahPopup(!showUbahPopup);
  };

  return (
    <section className="min-h-screen">
      <Navbar />

      <div className="flex justify-center">
        <div className="flex flex-col mt-5 gap-y-2.5">
          <img
            src={fotoProfil}
            alt="Profile"
            className="rounded-full w-30"
            onError={(e) => (e.currentTarget.src = ProfileImage)}
          />
          <button
            id="btn-edit-foto"
            onClick={handleEditClick}
            className="flex h-5 w-28 border-2 border-black items-center py-4 px-4 gap-4 rounded-full"
          >
            <img src={Edit} alt="" width="20" />
            <div>Edit</div>
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-start mx-5 lg:mx-40 my-10 gap-10">
        <div
          id="card-data-profil"
          className="bg-gray-100 flex flex-col justify-center border border-yellow-300 rounded-lg px-5 lg:px-15 py-5 w-full lg:w-auto"
        >
          <div>
            <div className="flex flex-col space-y-1">
              <label
                htmlFor="nama"
                className="text-sm font-medium text-gray-700"
              >
                Nama Lengkap
              </label>
              <input
                id="nama"
                type="text"
                value={profile.nama}
                className="px-[0.20rem] font-bold w-full lg:w-64 py-1 rounded-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            <div className="flex flex-col space-y-1 mt-2">
              <label
                htmlFor="lokasi"
                className="text-sm font-medium text-gray-700"
              >
                Lokasi Kota
              </label>
              <input
                id="lokasi"
                type="text"
                value={profile.lokasi}
                className="px-[0.20rem] font-bold w-full lg:w-64 py-1 rounded-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            <div className="flex flex-col space-y-1 mt-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={profile.email}
                className="px-[0.20rem] font-bold w-full lg:w-64 py-1 rounded-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            <div className="flex flex-col space-y-1 mt-2">
              <label
                htmlFor="no_hp"
                className="text-sm font-medium text-gray-700"
              >
                Nomor Telepon
              </label>
              <input
                id="no_hp"
                type="text"
                value={maskPhone(profile.phone)}
                className="px-[0.20rem] font-bold w-full lg:w-64 py-1 rounded-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>
          </div>

          <div className="flex flex-col mt-4 gap-3">
            <div className="flex gap-4">
              <button
                id="btn-ubah-data"
                className="w-auto bg-yellow-200 px-3 py-2 rounded-lg hover:bg-yellow-300 transition-all shadow"
                onClick={toggleUbahPopup}
              >
                Ubah Data
              </button>
              <button
                id="btn-ubah-password"
                className="w-auto bg-yellow-200 px-3 py-2 rounded-lg hover:bg-yellow-300 transition-all shadow"
                onClick={toggleUbahPassword}
              >
                Ubah Password
              </button>
            </div>

            <button
              className="w-full bg-red-500 px-3 py-2 rounded-lg hover:bg-red-600 transition-all shadow self-center"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>

        <div className="w-full font-jakarta">
          <div className="flex items-center justify-between mb-5 ml-2 lg:ml-0">
            <div className="flex items-center gap-3">
              <Bookmark size={24} />
              <h1 className="font-semibold text-lg">Jual Rumah</h1>
            </div>

            <div className="relative w-[300px]">
              <input
                type="text"
                placeholder="Cari Rumah Mu yang di jual"
                className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-sm"
                value={searchjual}
                onChange={(e) => setSearchJual(e.target.value)}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {jual.length === 0 ? (
            <p className="text-gray-500 text-sm">
              Belum ada properti yang dijual.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
              {jual
                .filter(
                  (item) =>
                    item.cluster_apart_name
                      .toLowerCase()
                      .includes(searchjual.toLowerCase()) ||
                    item.city.toLowerCase().includes(searchjual.toLowerCase())
                )
                .slice(0, 4)
                .map((item) => (
                  <div
                    key={item.ref_id}
                    className="rounded-xl shadow-md bg-white overflow-hidden cursor-pointer"
                    onClick={() => navigate(`/detailrumah/${item.ref_id}`)}
                  >
                    <div className="w-full bg-gray-300 h-30" />
                    <div className="flex items-start justify-between p-3">
                      <div className="flex flex-col">
                        <h3 className="text-sm font-semibold text-gray-900">
                          {item.cluster_apart_name}
                        </h3>
                        <p className="text-gray-700 text-sm">{item.city}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          LT {item.square_land}m² | LB {item.square_building}m²
                          | L{item.property_floor}
                        </p>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="bg-yellow-400 text-gray-900 font-semibold text-xs px-2 py-1 rounded max-w-[120px] truncate">
                          Rp{" "}
                          {new Intl.NumberFormat("id-ID").format(
                            item.property_price
                          )}
                        </span>
                        <p className="text-xs text-gray-600 mt-1">Transaksi</p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}

          <div className="w-full">
            <div className="flex items-center justify-between mb-5 ml-2 lg:ml-0">
              <div className="flex items-center gap-3">
                <Bookmark size={24} />
                <h1 className="font-semibold text-lg">Favorit</h1>
              </div>

              <div className="relative w-[300px]">
                <input
                  type="text"
                  placeholder="Cari properti favorit..."
                  className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {favorites.length === 0 ? (
              <p className="text-gray-500 text-sm">
                Belum ada properti favorit.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
                {favorites
                  .filter(
                    (item) =>
                      item.cluster_apart_name
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                      item.city
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
                  )
                  .slice(0, 4)
                  .map((item) => (
                    <div
                      key={item.ref_id}
                      className="rounded-xl shadow-md bg-white overflow-hidden cursor-pointer"
                      onClick={() => navigate(`/detailrumah/${item.ref_id}`)}
                    >
                      <div className="w-full bg-gray-300 h-30" />
                      <div className="flex items-start justify-between p-3">
                        <div className="flex flex-col">
                          <h3 className="text-sm font-semibold text-gray-900">
                            {item.cluster_apart_name}
                          </h3>
                          <p className="text-gray-700 text-sm">{item.city}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            LT {item.square_land}m² | LB {item.square_building}
                            m² | L{item.property_floor}
                          </p>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="bg-yellow-400 text-gray-900 font-semibold text-xs px-2 py-1 rounded max-w-[120px] truncate">
                            Rp{" "}
                            {new Intl.NumberFormat("id-ID").format(
                              item.property_price
                            )}
                          </span>
                          <p className="text-xs text-gray-600 mt-1">
                            Transaksi
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {imageError && (
        <div className="text-red-500 text-sm mt-4">{imageError}</div>
      )}

      {showEdit && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <div
            onClick={handleEditClick}
            className="absolute inset-0 bg-black/35 backdrop-blur-md"
          />
          <div className="bg-white p-5 rounded-lg shadow-md z-50">
            <form className="flex flex-col gap-4">
              <label
                htmlFor="imageUpload"
                className="text-sm font-medium text-gray-700"
              >
                Upload a new profile picture
              </label>
              <input
                id="imageUpload"
                type="file"
                accept="image/*" // Only allow image files
                onChange={handleImageChange} // Handle file selection
                className="px-[0.20rem] py-1 rounded-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              <button
                type="button"
                onClick={uploadImage} // Upload image to the API
                className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-4"
              >
                Upload
              </button>
            </form>
          </div>
        </div>
      )}

      {showUbahPopup && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <div
            onClick={toggleUbahPopup}
            className="absolute inset-0 bg-black/35 backdrop-blur-md"
          />
          <HalamanUbahProfile
            onUpdate={handleProfileUpdate}
            close={toggleUbahPopup}
          />
        </div>
      )}

      {showUbahPassword && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <div
            onClick={toggleUbahPassword}
            className="absolute inset-0 bg-black/35 backdrop-blur-md"
          />
          <HalamanKSB
            onUpdate={handlePasswordUpdate}
            close={toggleUbahPassword}
          />
        </div>
      )}

      <Footer />
    </section>
  );
}