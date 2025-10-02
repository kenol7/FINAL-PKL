import React, { useState } from "react";

const JualRumah = () => {
    const [showArrowUp, setShowArrowUp] = useState({});

    const toggleArrow = (field) => {
        setShowArrowUp((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
    };
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        console.log("Uploaded files:", files);
    };

    return (
        
        <div className="flex gap-6 p-6 min-h-screen">
            <div className="w-[300px] bg-blue-500 text-white p-6 rounded-xl flex flex-col gap-6 font-jakarta">
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
                    <label className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-md cursor-pointer transition">
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
                        *Pastikan gambar dibawah 2mb, dan maksimal upload 5 foto
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

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm mb-1">Nama Pemilik</label>
                            <input
                                type="text"
                                className="w-full p-2 rounded bg-white text-black"
                                placeholder="Contoh: Budi Santoso"
                            />
                        </div>
                        <div>
                            <label className="block text-sm mb-1">Harga</label>
                            <input
                                type="text"
                                className="w-full p-2 rounded bg-white text-black"
                                placeholder="Contoh: 1.500.000.000"
                            />
                        </div>
                        <div>
                            <label className="block text-sm mb-1">Nomor Telepon</label>
                            <input
                                type="tel"
                                className="w-full p-2 rounded bg-white text-black"
                                placeholder="Contoh: 081234567890"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm mb-1">Lokasi Rumah</label>
                        <input
                            type="text"
                            className="w-full p-2 rounded bg-white text-black"
                            placeholder="Contoh: Jl. Sudirman No. 123, Jakarta Selatan"
                        />
                    </div>

                    <div className="grid grid-cols-4 gap-4">
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
                        <div className="grid grid-cols-4 gap-4">
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
                        <div className="grid grid-cols-4 gap-4">
                            {[
                                { label: "Luas Tanah", unit: "m²" },
                                { label: "Luas Bangunan", unit: "m²" },
                                { label: "Total Lantai", unit: "" },
                                { label: "Status Transaksi", unit: "" },
                            ].map(({ label, unit }) => (
                                <div key={label}>
                                    <label className="block text-sm mb-1">{label}</label>
                                    <input
                                        type="text"
                                        className="w-full p-2 rounded bg-white text-black"
                                        placeholder={`Contoh: ${unit ? "120" : "Siap Jual"}`}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4">
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

                    <div className="grid grid-cols-4 gap-4">
                        {[
                            "Jalur Lalu Lintas",
                            "Potensi Banjir",
                            "Tingkat Hunian Bangunan",
                            "Discount (%)",
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

                    <div className="mt-8">
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
    );
};

export default JualRumah;