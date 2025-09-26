import React, { useState } from "react";

export default function Search() {
  
  const provinces = ["Jakarta", "Jawa Timur", "Jawa Barat", "Yogyakarta"];
  const [selectedProvince, setSelectedProvince] = useState("Provinsi");

  const maxPrice = ["100000", "200000", "300000", "400000", "500000"];
  const [selectedMaxPrice, setSelectedMaxPrice] = useState("Harga Maximal");

  const minPrice = ["100000", "200000", "300000", "400000", "500000"];
  const [selectedMinPrice, setSelectedMinPrice] = useState("Harga Minimal");

  const [isOpenMinPrice, setIsOpenMinPrice] = useState(false);
  const [isOpenMaxPrice, setIsOpenMaxPrice] = useState(false);
  const [isOpenProvince, setIsOpenProvince] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  return (
    <div className="flex justify-center w-full">
      <div className="flex flex-col justify-center w-full max-w-2xs md:max-w-4xl">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Filter Pencarian…"
            className="w-full rounded-full border border-yellow-500 px-6 py-3 pl-20 focus:outline-none focus:ring-2 focus:ring-yellow-700 bg-gray-50 shadow-lg"
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

           =
              <div className="relative w-full">
                <button
                  onClick={() => setIsOpenMinPrice(!isOpenMinPrice)}
                  className="w-full flex justify-between text-black items-center rounded-lg border !border-blue-500 !bg-white px-4 py-2 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
                >
                  {selectedMinPrice}
                  <svg
                    className={`w-5 h-5 transition-transform ${
                      isOpenMinPrice ? "rotate-180" : "rotate-0"
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

                {isOpenMinPrice && (
                  <ul className="absolute z-10 text-black mt-2 w-full rounded-lg border !border-blue-500 !bg-white shadow-lg">
                    {minPrice.map((item, idx) => (
                      <li
                        key={idx}
                        onClick={() => {
                          setSelectedMinPrice(item);
                          setIsOpenMinPrice(false);
                        }}
                        className="cursor-pointer px-4 py-2 hover:bg-blue-100"
                      >
                        {item}
                        <div className="border-b border-gray-200 mt-2 last:border-0"></div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

            
              <div className="relative w-full">
                <button
                  onClick={() => setIsOpenMaxPrice(!isOpenMaxPrice)}
                  className="w-full flex justify-between items-center text-black rounded-lg border !border-blue-500 !bg-white px-4 py-2 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
                >
                  {selectedMaxPrice}
                  <svg
                    className={`w-5 h-5 transition-transform ${
                      isOpenMaxPrice ? "rotate-180" : "rotate-0"
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

                {isOpenMaxPrice && (
                  <ul className="absolute z-10 mt-2 w-full text-black rounded-lg border !border-blue-500 !bg-white shadow-lg">
                    {maxPrice.map((item, idx) => (
                      <li
                        key={idx}
                        onClick={() => {
                          setSelectedMaxPrice(item);
                          setIsOpenMaxPrice(false);
                        }}
                        className="cursor-pointer px-4 py-2 hover:bg-blue-100"
                      >
                        {item}
                        <div className="border-b border-gray-200 mt-2 last:border-0"></div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="relative w-full">
                <button
                  onClick={() => setIsOpenProvince(!isOpenProvince)}
                  className="w-full flex justify-between text-black items-center rounded-lg border !border-blue-500 !bg-white px-4 py-2 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
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
                  <ul className="absolute z-10 mt-2 w-full text-black rounded-lg border !border-blue-500 !bg-white shadow-lg">
                    {provinces.map((province, idx) => (
                      <li
                        key={idx}
                        onClick={() => {
                          setSelectedProvince(province);
                          setIsOpenProvince(false);
                        }}
                        className="cursor-pointer px-4 py-2 hover:bg-blue-100"
                      >
                        {province}
                        <div className="border-b border-gray-200 mt-2 last:border-0"></div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}