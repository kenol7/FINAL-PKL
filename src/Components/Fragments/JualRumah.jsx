import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const JualRumah = () => {
    const [showArrowUp, setShowArrowUp] = useState({});

    // State untuk input numerik
    const [harga, setHarga] = useState("");
    const [luasTanah, setLuasTanah] = useState("");
    const [luasBangunan, setLuasBangunan] = useState("");
    const [totalLantai, setTotalLantai] = useState("");
    const [discount, setDiscount] = useState("");
    const [nomorTelepon, setNomorTelepon] = useState("");

    // State baru untuk dropdown
    const [kategoriPemilik, setKategoriPemilik] = useState("");
    const [statusTransaksi, setStatusTransaksi] = useState("");

    const toggleArrow = (field) => {
        setShowArrowUp((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

    const [isEditMode, setIsEditMode] = useState(false)

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        console.log("Uploaded files:", files);
    };

    // Hanya izinkan angka
    const handleNumericInput = (e, setter) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) {
            setter(value);
        }
    };

    // Validasi khusus nomor telepon: harus 08..., hanya angka, max 13 digit
    const handlePhoneChange = (e) => {
        let value = e.target.value.replace(/\D/g, ""); // Hapus semua non-angka

        if (value === "") {
            setNomorTelepon("");
            return;
        }

        // Pastikan diawali "08"
        if (!value.startsWith("08")) {
            if (value.startsWith("8")) {
                value = "0" + value; // "8123" → "08123"
            } else if (value[0] !== "0") {
                value = "08" + value; // "123" → "08123"
            } else if (value === "0") {
                value = "08";
            } else {
                // Jika mulai dengan "0" tapi bukan "08", ganti jadi "08"
                value = "08" + value.slice(1);
            }
        }

        // Batasi maksimal 13 digit
        if (value.length > 13) {
            value = value.slice(0, 13);
        }

        setNomorTelepon(value);
    };

    return (
        <div className="p-4 sm:p-6 min-h-screen ">
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Sidebar (kiri) */}
                <div className="w-full lg:w-[300px] bg-blue-500 text-white p-6 rounded-xl flex flex-col gap-6 font-jakarta">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-32 h-32 bg-white rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-100">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-12 w-12 text-gray-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 9a2 2 0 012-2h.632l2.724 2.724a2 2 0 012.828 0L16 11.832V19a2 2 0 01-2 2H8a2 2 0 01-2-2v-7.168l-2.724-2.724A2 2 0 013 9z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 13a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                            </svg>
                        </div>
                        <label className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-md cursor-pointer transition text-center">
                            Upload Gambar
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </label>
                        <p className="text-xs text-center">
                            *Pastikan gambar di bawah 2MB, maksimal 5 foto
                        </p>
                    </div>

                    <div className="flex flex-col gap-4">
                        <h3 className="font-bold">Peta Lokasi</h3>
                        <div className="w-full h-40 bg-white rounded-lg"></div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm">Latitude</label>
                            <input
                                type="text"
                                className="w-full p-2 rounded bg-white text-black"
                                placeholder="Contoh: -6.2088"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-sm">Longitude</label>
                            <input
                                type="text"
                                className="w-full p-2 rounded bg-white text-black"
                                placeholder="Contoh: 106.8456"
                            />
                        </div>
                    </div>
                </div>

                {/* Form utama (kanan) */}
                <div className="flex-1 bg-blue-500 text-white p-6 rounded-xl">
                    <h2 className="text-xl font-bold text-center mb-6">Jual Rumah</h2>

                    <form className="space-y-6">
                        <div>
                            <label className="block text-sm mb-1">Nama Rumah/Apartemen</label>
                            <input
                                type="text"
                                className="w-full p-2 rounded bg-white text-black"
                                placeholder="Contoh: Green Garden Apartment"
                            />
                        </div>

                        {/* Grid: 2 kolom untuk Nama Pemilik & Kategori Pemilik */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm mb-1">Nama Pemilik</label>
                                <input
                                    type="text"
                                    className="w-full p-2 rounded bg-white text-black"
                                    placeholder="Contoh: Budi Santoso"
                                />
                            </div>
                            <div>
                                <label className="block text-sm mb-1">Kategori Pemilik</label>
                                <div
                                    className="relative w-full p-2 rounded bg-white text-black cursor-pointer flex justify-between items-center"
                                    onClick={() => toggleArrow("Kategori Pemilik")}
                                >
                                    <span>{kategoriPemilik || "Pilih Kategori Pemilik"}</span>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className={`h-5 w-5 transition-transform ${showArrowUp["Kategori Pemilik"] ? "rotate-180" : ""
                                            }`}
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 9l-7 7-7-7"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm mb-1">Harga</label>
                            <input
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                className="w-full p-2 rounded bg-white text-black"
                                placeholder="Contoh: 1500000000"
                                value={harga}
                                onChange={(e) => handleNumericInput(e, setHarga)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm mb-1">Nomor Telepon</label>
                            <input
                                type="tel"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                className="w-full p-2 rounded bg-white text-black"
                                placeholder="Contoh: 081234567890"
                                value={nomorTelepon}
                                onChange={handlePhoneChange}
                            />
                        </div>

                        <div>
                            <label className="block text-sm mb-1">Lokasi Rumah</label>
                            <input
                                type="text"
                                className="w-full p-2 rounded bg-white text-black"
                                placeholder="Contoh: Jl. Sudirman No. 123, Jakarta Selatan"
                            />
                        </div>

                        {/* Grid: 1 kolom di mobile, 2 di tablet, 4 di desktop */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {["Provinsi", "Kota/Kabupaten", "Kecamatan", "Kelurahan"].map(
                                (label) => (
                                    <div key={label}>
                                        <label className="block text-sm mb-1">{label}</label>
                                        <div
                                            className="relative w-full p-2 rounded bg-white text-black cursor-pointer flex justify-between items-center"
                                            onClick={() => toggleArrow(label)}
                                        >
                                            <span>Pilih {label}</span>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className={`h-5 w-5 transition-transform ${showArrowUp[label] ? "rotate-180" : ""
                                                    }`}
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M19 9l-7 7-7-7"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>

                        <div>
                            <h3 className="font-semibold mb-2">Kepemilikan</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {["Dokumen", "Klasifikasi", "Kategori Lahan", "Peruntukan"].map(
                                    (label) => (
                                        <div key={label}>
                                            <label className="block text-sm mb-1">{label}</label>
                                            <div
                                                className="relative w-full p-2 rounded bg-white text-black cursor-pointer flex justify-between items-center"
                                                onClick={() => toggleArrow(label)}
                                            >
                                                <span>Pilih {label}</span>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className={`h-5 w-5 transition-transform ${showArrowUp[label] ? "rotate-180" : ""
                                                        }`}
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M19 9l-7 7-7-7"
                                                    />
                                                </svg>
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-2">Detail</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {[
                                    {
                                        label: "Luas Tanah",
                                        unit: "m²",
                                        state: luasTanah,
                                        setter: setLuasTanah,
                                    },
                                    {
                                        label: "Luas Bangunan",
                                        unit: "m²",
                                        state: luasBangunan,
                                        setter: setLuasBangunan,
                                    },
                                    {
                                        label: "Total Lantai",
                                        unit: "",
                                        state: totalLantai,
                                        setter: setTotalLantai,
                                    },
                                    { label: "Status Transaksi", unit: "" },
                                ].map(({ label, unit, state, setter }) => (
                                    <div key={label}>
                                        <label className="block text-sm mb-1">{label}</label>
                                        {label === "Status Transaksi" ? (
                                            <div
                                                className="relative w-full p-2 rounded bg-white text-black cursor-pointer flex justify-between items-center"
                                                onClick={() => toggleArrow(label)}
                                            >
                                                <span>
                                                    {statusTransaksi || "Pilih Status Transaksi"}
                                                </span>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className={`h-5 w-5 transition-transform ${showArrowUp[label] ? "rotate-180" : ""
                                                        }`}
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M19 9l-7 7-7-7"
                                                    />
                                                </svg>
                                            </div>
                                        ) : (
                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                pattern="[0-9]*"
                                                className="w-full p-2 rounded bg-white text-black"
                                                placeholder={`Contoh: ${unit ? "120" : "5"}`}
                                                value={state}
                                                onChange={(e) => handleNumericInput(e, setter)}
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {[
                                "Kategori Asset",
                                "Tipe Asset",
                                "Kondisi Bangunan",
                                "Klasifikasi Jalan",
                            ].map((label) => (
                                <div key={label}>
                                    <label className="block text-sm mb-1">{label}</label>
                                    <div
                                        className="relative w-full p-2 rounded bg-white text-black cursor-pointer flex justify-between items-center"
                                        onClick={() => toggleArrow(label)}
                                    >
                                        <span>Pilih {label}</span>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className={`h-5 w-5 transition-transform ${showArrowUp[label] ? "rotate-180" : ""
                                                }`}
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 9l-7 7-7-7"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {[
                                "Jalur Lalu Lintas",
                                "Potensi Banjir",
                                "Tingkat Hunian Bangunan",
                                "Discount (%)",
                            ].map((label, index) => (
                                <div key={label}>
                                    <label className="block text-sm mb-1">{label}</label>
                                    {label === "Discount (%)" ? (
                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            pattern="[0-9]*"
                                            className="w-full p-2 rounded bg-white text-black"
                                            placeholder="Contoh: 10"
                                            value={discount}
                                            onChange={(e) => handleNumericInput(e, setDiscount)}
                                        />
                                    ) : (
                                        <div
                                            className="relative w-full p-2 rounded bg-white text-black cursor-pointer flex justify-between items-center"
                                            onClick={() => toggleArrow(label)}
                                        >
                                            <span>Pilih {label}</span>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className={`h-5 w-5 transition-transform ${showArrowUp[label] ? "rotate-180" : ""
                                                    }`}
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M19 9l-7 7-7-7"
                                                    framer-motion
                                                />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Status Penjualan (Hanya muncul di Edit Mode) */}
                        {isEditMode && (
                            <div className="mt-8">
                                <h3 className="font-semibold mb-2">Status Penjualan</h3>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                                    {/* Dropdown Status Penjualan */}
                                    <div className="relative">
                                        <label className="block text-sm mb-1">
                                            Status Penjualan
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => setIsOpenStatus(!isOpenStatus)}
                                            className="w-full flex justify-between items-center px-4 py-2 rounded-lg border border-blue-500 bg-white text-black shadow-sm focus:outline-none"
                                        >
                                            {statusPenjualan || "Pilih Status Penjualan"}
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className={`h-5 w-5 transition-transform ${isOpenStatus ? "rotate-180" : ""
                                                    }`}
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M19 9l-7 7-7-7"
                                                />
                                            </svg>
                                        </button>

                                        {isOpenStatus && (
                                            <ul className="absolute z-10 mt-2 w-full text-black rounded-lg border border-blue-500 bg-white shadow-lg">
                                                {["Tersedia", "Terjual"].map((status, idx) => (
                                                    <li
                                                        key={idx}
                                                        onClick={() => {
                                                            setStatusPenjualan(status);
                                                            setIsOpenStatus(false);
                                                        }}
                                                        className="cursor-pointer px-4 py-2 hover:bg-blue-100"
                                                    >
                                                        {status}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>

                                    {/* Input Tanggal Terjual */}
                                    <AnimatePresence>
                                        {statusPenjualan === "Terjual" && (
                                            <motion.div
                                                key="tanggal-terjual"
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 20 }}
                                                transition={{ duration: 0.3 }}
                                                className="w-full"
                                            >
                                                <label className="block text-sm mb-1">
                                                    Tanggal Terjual
                                                </label>
                                                <input
                                                    type="date"
                                                    value={tanggalTerjual}
                                                    onChange={(e) => setTanggalTerjual(e.target.value)}
                                                    className="w-full p-2 rounded-lg border border-blue-500 bg-white text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
                                                />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        )}

                        {/* Tombol Aksi — hanya muncul di Edit Mode */}
                        {isEditMode && (
                            <div className="mt-8 pt-4 border-t border-blue-400">
                                <p className="text-xs italic mb-2">
                                    *Cek Ulang Sebelum Klik Verifikasi Data
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button
                                        type="button"
                                        className="flex-1 bg-green-500 hover:bg-green-600 py-2 rounded-lg font-semibold transition"
                                    >
                                        Simpan Perubahan
                                    </button>
                                    <button
                                        type="button"
                                        className="flex-1 bg-red-500 hover:bg-red-600 py-2 rounded-lg font-semibold transition"
                                    >
                                        Hapus Data
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="mt-8 pt-4 border-t border-blue-400">
                            <p className="text-xs italic mb-2">
                                *Cek Ulang Sebelum Klik Verifikasi Data
                            </p>
                            <button
                                type="button"
                                className="w-full bg-green-500 hover:bg-green-600 py-2 rounded-lg font-semibold transition"
                            >
                                Verifikasi Data
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default JualRumah;
