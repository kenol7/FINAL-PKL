import React, { useEffect, useState } from "react";
import Navbar from "../Components/Elements/Navbar";
import Footer from "../Components/Elements/Footer";
// import ProfileImage from "../assets/profile.jpg";
import Jual from "../assets/sale-01.png";
import Edit from "../assets/edit.png";
import { Bookmark } from "lucide-react";
import { HalamanUbahProfile, HalamanKSB } from "../Pages/HalamanUtama";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Profile(props) {
  const [profile, setProfile] = useState({
    nama: "",
    lokasi: "",
    email: "",
    phone: "",
    profil: "",
  });

  const ProfileImage = 'https://smataco.my.id/dev/unez/CariRumahAja/foto/ProfilePicture/noProfilePict/noprofile_pict.jpeg'


  const fotoProfil = profile.profil
    ? `https://smataco.my.id/dev/unez/CariRumahAja/foto/ProfilePicture/${profile.profil
    }?t=${Date.now()}`
    : ProfileImage;


  console.log(profile);
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

  const maskPhone = (phone) => {
    if (!phone) return "";
    const cleanPhone = phone.toString().trim();

    // Jika panjang nomor kurang dari 5, langsung return bintang semua
    if (cleanPhone.length <= 5) {
      return "*".repeat(cleanPhone.length);
    }

    // Potong 5 digit terakhir dan ganti dengan *
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
      if (fileSizeInMB > 2) {
        setImageError("File size exceeds 2MB. Please select a smaller file.");
        setSelectedImage(null);
        setImageFile(null);
      } else {
        setImageError("");
        setSelectedImage(URL.createObjectURL(cleanedFile));
        setImageFile(cleanedFile);
      }
    }
  };

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("favorites") || "[]");
    setFavorites(saved);
  }, []);

  const handleEditClick = () => {
    setShowEdit(!showEdit); // Toggle the form visibility
  };

  const handlePasswordUpdate = () => {
    console.log("Password updated!");
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setProfile({ nama: "", lokasi: "", email: "", phone: "" });
    navigate("/");
  };

  const uploadImage = async () => {
    if (!imageFile) return; // If no file is selected, do nothing

    const formData = new FormData();
    formData.append("mode", "UPDATE"); // Mode as POST
    formData.append("action", "updateProfilePicture"); // Action for uploading image
    formData.append("email", profile.email); // Email for identification
    formData.append("image", imageFile); // Append the image file

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
      console.log("Image uploaded successfully:", response.data);
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
            onClick={handleEditClick}
            className="flex h-5 w-28 border-2 border-black items-center py-4 px-4 gap-4 rounded-full"
          >
            <img src={Edit} alt="" width="20" />
            <div>Edit</div>
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-start mx-5 lg:mx-40 my-10 gap-10">
        <div className="bg-gray-100 flex flex-col justify-center border border-yellow-300 rounded-lg px-5 lg:px-15 py-5 w-full lg:w-auto">
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
                className="w-auto bg-yellow-200 px-3 py-2 rounded-lg hover:bg-yellow-300 transition-all shadow"
                onClick={toggleUbahPopup}
              >
                Ubah Data
              </button>
              <button
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

        <div className="w-full flex flex-col">
          {/* Bagian Jual */}
          <div className="w-full mb-10">
            <div className="flex gap-3 mb-5 ml-2 lg:ml-0">
              <img src={Jual} alt="" width="24" />
              <h1 className="font-semibold text-lg">Jual</h1>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
              <div className="rounded-xl shadow-md bg-white overflow-hidden">
                <div className="w-full bg-gray-300 h-30" />
                <div className="flex items-start justify-between p-3">
                  <div className="flex flex-col">
                    <h3 className="text-sm font-semibold text-gray-900">
                      Perumahan Griya
                    </h3>
                    <p className="text-gray-700 text-sm">Jakarta Timur</p>
                    <p className="text-xs text-gray-400 mt-1">
                      LT 97m² | LB 78m² | L1
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="bg-yellow-400 text-gray-900 font-semibold text-xs px-2 py-1 rounded">
                      Rp 2.589.500
                    </span>
                    <p className="text-xs text-gray-600 mt-1">Transaksi</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl shadow-md bg-white overflow-hidden">
                <div className="w-full bg-gray-300 h-30" />
                <div className="flex items-start justify-between p-3">
                  <div className="flex flex-col">
                    <h3 className="text-sm font-semibold text-gray-900">
                      Perumahan Griya
                    </h3>
                    <p className="text-gray-700 text-sm">Jakarta Timur</p>
                    <p className="text-xs text-gray-400 mt-1">
                      LT 97m² | LB 78m² | L1
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="bg-yellow-400 text-gray-900 font-semibold text-xs px-2 py-1 rounded">
                      Rp 2.589.500
                    </span>
                    <p className="text-xs text-gray-600 mt-1">Transaksi</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl shadow-md bg-white overflow-hidden">
                <div className="w-full bg-gray-300 h-30" />
                <div className="flex items-start justify-between p-3">
                  <div className="flex flex-col">
                    <h3 className="text-sm font-semibold text-gray-900">
                      Perumahan Griya
                    </h3>
                    <p className="text-gray-700 text-sm">Jakarta Timur</p>
                    <p className="text-xs text-gray-400 mt-1">
                      LT 97m² | LB 78m² | L1
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="bg-yellow-400 text-gray-900 font-semibold text-xs px-2 py-1 rounded">
                      Rp 2.589.500
                    </span>
                    <p className="text-xs text-gray-600 mt-1">Transaksi</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bagian Favorit tetap sama */}
          <div className="w-full">
            <div className="flex gap-3 mb-5 ml-2 lg:ml-0">
              <Bookmark size={24} />
              <h1 className="font-semibold text-lg">Favorit</h1>
            </div>

            {favorites.length === 0 ? (
              <p className="text-gray-500 text-sm">Belum ada properti favorit.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
                {favorites.map((item) => (
                  <div
                    key={item.ref_id}
                    className="rounded-xl shadow-md bg-white overflow-hidden cursor-pointer"
                    onClick={() => navigate(`/detail/${item.ref_id}`)}
                  >
                    <div className="w-full bg-gray-300 h-30" /> {/* Ganti dengan gambar jika ada */}
                    <div className="flex items-start justify-between p-3">
                      <div className="flex flex-col">
                        <h3 className="text-sm font-semibold text-gray-900">
                          {item.cluster_apart_name}
                        </h3>
                        <p className="text-gray-700 text-sm">{item.city}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          LT {item.square_land}m² | LB {item.square_building}m² | L{item.property_floor}
                        </p>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="bg-yellow-400 text-gray-900 font-semibold text-xs px-2 py-1 rounded">
                          Rp {new Intl.NumberFormat("id-ID").format(item.property_price)}
                        </span>
                        <p className="text-xs text-gray-600 mt-1">Transaksi</p>
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