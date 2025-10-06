import React, { useEffect, useState } from "react";
import Button from "../Elements/Button";
import { useNavigate } from "react-router-dom";
import API from "../../Config/Endpoint";

const UbahProfile = ({ close, onUpdate }) => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    nama: "",
    email: "",
    phone: "",
  });
  const [name, setName] = useState("");
  const [no, setNo] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const endPoint = API.endpointUpdate;

  useEffect(() => {
    const storedNama = localStorage.getItem("auth_fullname") || "";
    const storedEmail = localStorage.getItem("auth_email") || "";
    const storedPhone = localStorage.getItem("auth_phone") || "";
    setProfile({
      nama: storedNama,
      email: storedEmail,
      phone: storedPhone,
    });
    setName(storedNama); // Set name untuk input field
    setNo(storedPhone); // Set no untuk input field
  }, []);

  // const final_name = name !== "" ? name : profile?.nama || "";
  // const final_no = no !== "" ? no : profile?.phone || "";

  // Fungsi untuk mengirimkan data ke API
  function updateProfileData() {
    const payload = {
      name: name, // Gunakan state name yang terbaru
      email: profile.email, // Tidak diubah, tetap pakai data profile
      phone: no, // Gunakan state no yang terbaru
      mode: "UPDATE",
      action: "profile",
    };

    fetch(endPoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((response) => {
        console.log(response);
        if (response.status === "success") {
          alert(response.message);
          const data = {
            nama: name,
            phone: no,
          };
          localStorage.setItem("auth_fullname", name);
          localStorage.setItem("auth_phone", no);
          onUpdate(data);
        } else {
          alert(
            response.message || "Ubah Data gagal. Periksa kembali data Anda."
          );
        }
      });
  }

  return (
    <>
      <form
        className="w-full flex flex-col items-center gap-6 transition-all duration-200"
        method="POST"
      >
        <div className="mt-10 flex flex-col gap-5 ml-5">
          <div>
            <label className="font-jakarta text-xs">Nama lengkap</label>
            <input
              type="text"
              name="nama_lengkap"
              value={name} // Menggunakan profile.nama untuk value input
              className="font-jakarta text-black w-full h-[29px] rounded-full border border-[#F4D77B] px-3 text-sm 
                   focus:outline-none focus:ring-2 focus:ring-[#2067C5] bg-white"
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="font-jakarta text-xs">Email</label>
            <input
              type="email"
              name="email"
              value={profile.email} // Menggunakan profile.email untuk value input
              className="font-jakarta text-black w-full h-[29px] rounded-full border border-[#F4D77B] px-3 text-sm 
                   focus:outline-none focus:ring-2 focus:ring-[#2067C5] bg-white"
              disabled
            />
          </div>

          <div>
            <label className="font-jakarta text-xs">No Telepon</label>
            <input
              type="text"
              inputMode="numeric"
              name="nomer_telepon"
              value={no} // Menggunakan profile.phone untuk value input
              className="font-jakarta text-black w-full h-[29px] rounded-full border border-[#F4D77B] px-3 text-sm 
                   focus:outline-none focus:ring-2 focus:ring-[#2067C5] bg-white"
              maxLength="15"
              onChange={(e) => setNo(e.target.value)}
            />
          </div>
        </div>
      </form>
      <Button
        className="w-auto mt-4 mx-auto bg-green-500"
        onClick={updateProfileData}
      >
        Simpan Perubahan
      </Button>
    </>
  );
};

export default UbahProfile;