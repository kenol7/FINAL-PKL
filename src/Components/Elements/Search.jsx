import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import API from "../../Config/Endpoint";

export default function Search() {
  const [dataProvinsi, setDataProvinsi] = useState([]);
  const [dataKota, setDataKota] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("Provinsi");
  const [selectedCity, setSelectedCity] = useState("Kota");
  const [isOpenProvince, setIsOpenProvince] = useState(false);
  const [isOpenCity, setIsOpenCity] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [sortOrder, setSortOrder] = useState("asc");

  const navigate = useNavigate(); 
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    setKeyword(queryParams.get("search") || "");
    const qMin = queryParams.get("minHarga") || "";
    const qMax = queryParams.get("maxHarga") || "";
    const qProv = queryParams.get("province") || "Provinsi";
    const qCity = queryParams.get("city") || "Kota";
    const qSort = queryParams.get("sort_order") || "asc"; // ✅ Tambahkan ini

    setMinPrice(qMin);
    setMaxPrice(qMax);
    setSelectedProvince(qProv);
    setSelectedCity(qCity);
    setSortOrder(qSort); // ✅ Set sort order dari URL
  }, [location.search]);

  // Fetch provinsi
  useEffect(() => {
    axios
      .get(API.endpointProvinsi)
      .then((res) => {
        if (Array.isArray(res.data)) {
          setDataProvinsi(res.data);
        } else if (res.data.data) {
          setDataProvinsi(res.data.data);
        } else {
          setDataProvinsi([]);
        }
      })
      .catch((err) => console.error("Gagal fetch provinsi:", err));
  }, []);

  // Fetch kota berdasarkan provinsi
  useEffect(() => {
    if (selectedProvince && selectedProvince !== "Provinsi") {
      const endPointCity = `${API.endpointKota}&provinsi=${encodeURIComponent(
        selectedProvince
      )}`;
      axios
        .get(endPointCity)
        .then((res) => {
          if (Array.isArray(res.data)) {
            setDataKota(res.data);
          } else if (res.data.data) {
            setDataKota(res.data.data);
          } else {
            setDataKota([]);
          }
        })
        .catch((err) => console.error("Gagal fetch kota:", err));
    } else {
      setDataKota([]);
    }
  }, [selectedProvince]);

  const buildQueryParams = () => {
    const filterParams = new URLSearchParams();
    if (keyword) filterParams.append("search", keyword);
    if (minPrice) filterParams.append("minHarga", minPrice);
    if (maxPrice) filterParams.append("maxHarga", maxPrice);
    if (selectedProvince && selectedProvince !== "Provinsi")
      filterParams.append("province", selectedProvince);
    if (selectedCity && selectedCity !== "Kota")
      filterParams.append("city", selectedCity);
    if (sortOrder) filterParams.append("sort_order", sortOrder); // ✅ Tetap kirim sort_order
    return filterParams.toString();
  };

  const handleSearchEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const queryString = buildQueryParams();
      navigate(`/beli?${queryString}`);
      setShowFilter(false);
    }
  };

  const handleFilterSubmit = () => {
    const queryString = buildQueryParams();
    if (location.pathname === "/beli") {
      navigate(`/beli?${queryString}`, { replace: true });
    } else {
      navigate(`/beli?${queryString}`);
    }
    setShowFilter(false);
  };

  const formatRupiah = (value) => {
    if (!value) return "";
    const numberString = value.toString().replace(/\D/g, ""); 
    const number = parseInt(numberString, 10);
    if (isNaN(number)) return "";
    return new Intl.NumberFormat("id-ID").format(number);
  };

  const unformatRupiah = (value) => {
    return value.replace(/\D/g, "");
  };

  return (
    <div className="flex justify-center w-full">
      <div className="flex flex-col justify-center w-full max-w-2xs md:max-w-4xl">
        {/* Input Search */}
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Filter Pencarian…"
            className="w-full rounded-full border border-yellow-500 px-6 py-3 pl-20 focus:outline-none focus:ring-2 focus:ring-yellow-700 bg-gray-50 shadow-lg"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={handleSearchEnter}
          />
          <div
            className="absolute inset-y-0 left-9 flex items-center cursor-pointer"
            onClick={() => setShowFilter(true)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 24 24"
            >
              <path
                fill="none"
                stroke="#000"
                strokeWidth="1.5"
                d="M19 3H5c-1.414 0-2.121 0-2.56.412S2 4.488 2 5.815v.69c0 1.037 0 1.556.26 1.986s.733.698 1.682 1.232l2.913 1.64c.636.358.955.537 1.183.735c.474.411.766.895.898 1.49c.064.284.064.618.064 1.285v2.67c0 .909 0 1.364.252 1.718c.252.355.7.53 1.594.88c1.879.734 2.818 1.101 3.486.683S15 19.452 15 17.542v-2.67c0-.666 0-1 .064-1.285a2.68 2.68 0 0 1 .899-1.49c.227-.197.546-.376 1.182-.735l2.913-1.64c.948-.533 1.423-.8 1.682-1.23c.26-.43.26-.95.26-1.988v-.69c0-1.326 0-1.99-.44-2.402C21.122 3 20.415 3 19 3Z"
              />
            </svg>
          </div>
        </div>

        {/* Modal Filter */}
        {showFilter && (
          <div
            className="fixed inset-0 bg-white/10 backdrop-blur-sm flex justify-center items-center z-50"
            onClick={(e) => {
              if (e.target.classList.contains("bg-white/10")) {
                setShowFilter(false);
              }
            }}
          >
            <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6 relative">
              <h2 className="text-center text-xl font-semibold mb-4">
                Filter Pencarian
              </h2>
              <button
                onClick={() => setShowFilter(false)}
                className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 cursor-pointer"
              >
                ✕
              </button>

              {/* Harga Minimal */}
              <div className="mb-3">
                <label className="block text-sm font-medium">
                  Harga Minimal
                </label>
                <div className="mt-2 flex items-center rounded-md bg-gray-100 pl-3 border border-gray-300 focus-within:ring-2 focus-within:ring-indigo-500">
                  <input
                    type="text"
                    placeholder="0"
                    value={minPrice ? `Rp ${formatRupiah(minPrice)}` : ""}
                    onChange={(e) => {
                      const rawValue = unformatRupiah(e.target.value);
                      setMinPrice(rawValue);
                    }}
                    className="block min-w-0 grow bg-transparent py-1.5 pr-3 pl-1 text-base text-gray-800 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                  />
                </div>
              </div>

              {/* Harga Maksimal */}
              <div className="mb-3">
                <label className="block text-sm font-medium">
                  Harga Maksimal
                </label>
                <div className="mt-2 flex items-center rounded-md bg-gray-100 pl-3 border border-gray-300 focus-within:ring-2 focus-within:ring-indigo-500">
                  <input
                    type="text"
                    placeholder="0"
                    value={maxPrice ? `Rp ${formatRupiah(maxPrice)}` : ""}
                    onChange={(e) => {
                      const rawValue = unformatRupiah(e.target.value);
                      setMaxPrice(rawValue);
                    }}
                    className="block min-w-0 grow bg-transparent py-1.5 pr-3 pl-1 text-base text-gray-800 placeholder:text-gray-400 focus:outline-none sm:text-sm"
                  />
                </div>
              </div>

              {/* Dropdown Provinsi */}
              <div className="relative mb-3">
                <button
                  onClick={() => setIsOpenProvince(!isOpenProvince)}
                  className="w-full flex justify-between text-black items-center rounded-lg border border-blue-500 bg-white px-4 py-2 text-left shadow focus:outline-none focus:ring-2 focus:ring-blue-800 cursor-grab active:cursor-grabbing"
                >
                  {selectedProvince}
                  <svg
                    className={`w-5 h-5 transition-transform ${
                      isOpenProvince ? "rotate-180" : "rotate-0"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {isOpenProvince && (
                  <ul className="absolute z-10 mt-2 w-full text-black rounded-lg border border-blue-500 bg-white shadow-lg max-h-52 overflow-y-auto">
                    {dataProvinsi.length > 0 ? (
                      dataProvinsi.map((province, idx) => (
                        <li
                          key={idx}
                          onClick={() => {
                            setSelectedProvince(province);
                            setSelectedCity("Kota");
                            setIsOpenProvince(false);
                          }}
                          className="cursor-pointer px-4 py-2 hover:bg-blue-100"
                        >
                          {province}
                        </li>
                      ))
                    ) : (
                      <li className="px-4 py-2">Data tidak ditemukan</li>
                    )}
                  </ul>
                )}
              </div>

              {/* Dropdown Kota */}
              <div className="relative mb-3">
                <button
                  onClick={() => setIsOpenCity(!isOpenCity)}
                  disabled={dataKota.length === 0}
                  className="w-full flex justify-between text-black items-center rounded-lg border border-blue-500 bg-white px-4 py-2 text-left shadow focus:outline-none focus:ring-2 focus:ring-blue-800 disabled:opacity-50 disabled:cursor-not-allowed cursor-grabbing"
                >
                  {selectedCity}
                  <svg
                    className={`w-5 h-5 transition-transform ${
                      isOpenCity ? "rotate-180" : "rotate-0"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {isOpenCity && (
                  <ul className="absolute z-10 mt-2 w-full text-black rounded-lg border border-blue-500 bg-white shadow-lg max-h-52 overflow-y-auto">
                    {dataKota.length > 0 ? (
                      dataKota.map((city, idx) => (
                        <li
                          key={idx}
                          onClick={() => {
                            setSelectedCity(city);
                            setIsOpenCity(false);
                          }}
                          className="cursor-pointer px-4 py-2 hover:bg-blue-100"
                        >
                          {city}
                        </li>
                      ))
                    ) : (
                      <li className="px-4 py-2">Data tidak ditemukan</li>
                    )}
                  </ul>
                )}
              </div>

              {/* ✅ SORT ORDER SUDAH ADA - tidak perlu diubah */}
              <div className="mb-4">
                <p className="text-gray-700 mb-2 font-medium">Urutkan Harga:</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSortOrder("asc")}
                    className={`flex-1 py-2 rounded-lg border ${
                      sortOrder === "asc"
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50"
                    }`}
                  >
                    Termurah ⬆️
                  </button>
                  <button
                    onClick={() => setSortOrder("desc")}
                    className={`flex-1 py-2 rounded-lg border ${
                      sortOrder === "desc"
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50"
                    }`}
                  >
                    Termahal ⬇️
                  </button>
                </div>
              </div>

              {/* Tombol Terapkan Filter */}
              <button
                onClick={handleFilterSubmit}
                className="w-full mt-2 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Terapkan Filter
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}