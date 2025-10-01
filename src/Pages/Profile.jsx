import React, { useEffect, useState } from "react";
import Navbar from "../Components/Elements/Navbar";
import Footer from "../Components/Elements/Footer";
import ProfileImage from "../assets/profile.jpg";
import Jual from "../assets/sale-01.png";
import Edit from "../assets/edit.png";
import { Bookmark } from "lucide-react";

export default function Profile() {
  const [profile, setProfile] = useState({
    nama: "Yang Jungwon",
    lokasi: "Bandung",
    email: "yangjungwon@gmail.com",
    phone: "088888888888",
  });

  useEffect(() => {
    setProfile({
      nama: localStorage.getItem("auth_fullname") || "Yang Jungwon",
      lokasi: "Bandung", // tidak ada di localStorage → pakai default
      email: localStorage.getItem("auth_email") || "yangjungwon@gmail.com",
      phone: localStorage.getItem("auth_phone") || "088888888888",
    });
  }, []);

  return (
    <section className="min-h-screen">
      <Navbar />

      <div className="flex justify-center">
        <div className="flex flex-col mt-5 gap-y-2.5">
          <img src={ProfileImage} alt="" className="rounded-full w-30" />
          <a className="flex h-5 w-28 border-2 border-black items-center py-4 px-4 gap-4 rounded-full">
            <img src={Edit} alt="" width="20" />
            <div>Edit</div>
          </a>
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
                value={profile.phone}
                className="px-[0.20rem] font-bold w-full lg:w-64 py-1 rounded-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>
          </div>

          <div className="flex mt-4 gap-10">
            <button className="w-28 bg-yellow-200 px-3 py-2 rounded-lg hover:bg-yellow-300 transition-all shadow">
              Ubah Data
            </button>
            <button className="w-28 bg-red-500 px-3 py-2 rounded-lg hover:bg-red-600 transition-all shadow">
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
        </div>
      </div>

      <Footer />
    </section>
  );
}