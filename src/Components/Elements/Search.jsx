import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import API from "../../Config/Endpoint";

export default function Search() {
  const [dataProvinsi, setDataProvinsi] = useState([]);
  const [dataKota, setDataKota] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("Provinsi");
  const [selectedCity, setSelectedCity] = useState("Kota");
  const [isOpenProvince, setIsOpenProvince] = useState(false);
  const [isOpenCity, setIsOpenCity] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const qMin = queryParams.get("minHarga") || "";
    const qMax = queryParams.get("maxHarga") || "";
    const qProv = queryParams.get("province") || "Provinsi";
    const qCity = queryParams.get("city") || "Kota";

    setMinPrice(qMin);
    setMaxPrice(qMax);
    setSelectedProvince(qProv);
    setSelectedCity(qCity);
  }, [location.search]);

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
            setSelectedCity("Kota");
          }
        })
        .catch((err) => console.error("Gagal fetch kota:", err));
    } else {
      setDataKota([]);
    }
  }, [selectedProvince]);

  // const handleFilterSubmit = () => {
  //   const filterParams = new URLSearchParams({
  //     minHarga: minPrice,
  //     maxHarga: maxPrice,
  //     province: selectedProvince,
  //     city: selectedCity,
  //   }).toString();

  const handleFilterSubmit = () => {
    const params = {};

    if (minPrice) params.minHarga = minPrice;
    if (maxPrice) params.maxHarga = maxPrice;
    if (selectedProvince !== "Provinsi") params.province = selectedProvince;
    if (selectedCity !== "Kota") params.city = selectedCity;

    const filterParams = new URLSearchParams(params).toString();

    if (location.pathname === "/beli") {
      navigate(`/beli?${filterParams}`, { replace: true });
    } else {
      navigate(`/beli?${filterParams}`);
    }

    setShowFilter(false);
  };

  //   if (location.pathname === "/beli") {
  //     navigate(`/beli?${filterParams}`, { replace: true });
  //     setShowFilter(false);
  //   } else {
  //     navigate(`/beli?${filterParams}`);
  //   }
  // };

  return (
    <div className="flex justify-center w-full">
      <div className="flex flex-col justify-center w-full max-w-2xs md:max-w-4xl">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Filter Pencarian…"
            className="w-full rounded-full border border-yellow-500 px-6 py-3 pl-20 focus:outline-none focus:ring-2 focus:ring-yellow-700 bg-gray-50 shadow-lg"
            onClick={() => setShowFilter(!showFilter)}
            readOnly
          />
          <div
            className="absolute inset-y-0 left-9 flex items-center cursor-pointer"
            onClick={() => setShowFilter(!showFilter)}
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

        {showFilter && (
          <div className="mt-3 p-4 border border-yellow-500 rounded-xl bg-transparent">
            <div className="flex flex-col gap-3">
              <h2 className="text-center text-lg font-medium">
                Filter Pencarian
              </h2>

              {/* Harga Minimal */}
              <input
                type="number"
                placeholder="Harga Minimal"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full rounded-lg border border-blue-500 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-800 bg-white shadow-lg"
              />

              {/* Harga Maksimal */}
              <input
                type="number"
                placeholder="Harga Maksimal"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full rounded-lg border border-blue-500 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-800 bg-white shadow-lg"
              />

              {/* Dropdown Provinsi */}
              <div className="relative w-full">
                <button
                  onClick={() => {
                    setIsOpenProvince(!isOpenProvince);
                    setIsOpenCity(false);
                  }}
                  className="w-full flex justify-between text-black items-center rounded-lg border border-blue-500 bg-white px-4 py-2 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
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
              <div className="relative w-full">
                <button
                  onClick={() => setIsOpenCity(!isOpenCity)}
                  disabled={dataKota.length === 0}
                  className="w-full flex justify-between text-black items-center rounded-lg border border-blue-500 bg-white px-4 py-2 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  <ul className="absolute z-50 mt-2 w-full text-black rounded-lg border border-blue-500 bg-white shadow-lg max-h-52 overflow-y-auto">
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
              <button
                onClick={handleFilterSubmit}
                className="w-full mt-4 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
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
