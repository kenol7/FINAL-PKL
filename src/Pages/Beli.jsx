import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Search from "../Components/Elements/Search";
import Footer from "../Components/Elements/Footer";
import Navbar from "../Components/Elements/Navbar";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowDownAZ, ArrowUpZA } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const API_FILTER =
  "https://smataco.my.id/dev/unez/CariRumahAja/routes/filter.php?mode=filter_properti";
const IMAGE_BASE_URL =
  "https://smataco.my.id/dev/unez/CariRumahAja/foto/rumah.jpg";

const SkeletonCard = () => (
  <div className="w-full overflow-hidden bg-white rounded-lg shadow-lg">
    <div className="h-[200px] bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer"></div>
    <div className="p-3 space-y-2">
      <div className="h-4 rounded w-3/4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer"></div>
      <div className="h-3 rounded w-1/2 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer"></div>
      <div className="h-3 rounded w-2/3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer"></div>
      <div className="flex justify-end">
        <div className="h-5 rounded w-20 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer"></div>
      </div>
    </div>
  </div>
);

const PropertyCard = ({ item, onClick }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3 }}
    className="w-full overflow-hidden bg-white rounded-lg shadow-md shadow-black/30 cursor-pointer"
    onClick={onClick}
  >
    <div className="rounded-xl overflow-hidden relative">
      <div className="w-full h-[200px] bg-gray-300 flex items-center justify-center">
        <h3 className="text-xs font-extrabold top-3 right-3 absolute bg-[#E5E7EB] px-2 py-1 rounded-full border-2 border-[#D4AF37]">
          {item.ref_id}
        </h3>
        <img
          src={IMAGE_BASE_URL}
          alt={item.cluster_apart_name}
          className="object-cover w-full h-full"
          loading="lazy"
        />
      </div>
      <div className="flex items-center justify-between bg-gray-100 p-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            {item.cluster_apart_name?.slice(0, 15) || "Perumahan"}
          </h3>
          <p className="text-sm text-gray-700">
            {item.city || "Kota Tidak Diketahui"}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            LT {item.square_land}m² | LB {item.square_building}m² | L{" "}
            {item.property_floor}
          </p>
        </div>
        <div className="flex flex-col text-right w-fit">
          <span className="block text-sm font-semibold text-gray-800 bg-yellow-400 px-3 rounded-lg">
            Rp{" "}
            {item.property_price
              ? new Intl.NumberFormat("id-ID").format(item.property_price)
              : "N/A"}
          </span>
          <p className="text-xs text-gray-600 mt-1">Transaksi</p>
        </div>
      </div>
    </div>
  </motion.div>
);

export default function Beli() {
  const [dataRumah, setDataRumah] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [itemsPerPage] = useState(12);
  const navigate = useNavigate();
  const location = useLocation();
  const [summaryData, setSummaryData] = useState({});
  const [sortOrder, setSortOrder] = useState("asc");

  const handleDetail = (ref_id) => navigate("/detailrumah/" + ref_id);

  // FETCH DATA - hanya saat filter berubah (BUKAN saat sort berubah)
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const params = {
      minHarga: queryParams.get("minHarga") || "",
      maxHarga: queryParams.get("maxHarga") || "",
      province: queryParams.get("province") || "",
      city: queryParams.get("city") || "",
      search: queryParams.get("search") || "",
    };

    const urlSortOrder = queryParams.get("sort_order") || "asc";
    setSortOrder(urlSortOrder);
    
    setLoading(true);

    axios
      .post(API_FILTER, {
        provinsi: params.province,
        kota: params.city,
        minHarga: params.minHarga,
        maxHarga: params.maxHarga,
        mode: "filter_properti",
        search: params.search,
        //  TIDAK kirim sort_order ke backend nonono
      })
      .then((res) => {
        let data = [];

        if (res.data && Array.isArray(res.data.properties)) {
          data = res.data.properties;
        } else if (Array.isArray(res.data)) {
          data = res.data;
        }

        // Simpan summary
        if (res.data && res.data.summary) {
          setSummaryData(res.data.summary);
        }

        //HAPUS sorting di sini - biar di client side aja
        setDataRumah(data);
      })
      .catch((err) => {
        console.error("Gagal fetch data:", err);
        setDataRumah([]);
      })
      .finally(() => setLoading(false));
  }, [
    new URLSearchParams(location.search).get("minHarga"),
    new URLSearchParams(location.search).get("maxHarga"),
    new URLSearchParams(location.search).get("province"),
    new URLSearchParams(location.search).get("city"),
    new URLSearchParams(location.search).get("search"),
  ]);

  //
  const sortedData = useMemo(() => {
    const data = [...dataRumah]; // copy array agar tidak mutasi original
    
    if (sortOrder === "asc") {
      return data.sort((a, b) => a.property_price - b.property_price);
    } else if (sortOrder === "desc") {
      return data.sort((a, b) => b.property_price - a.property_price);
    }
    
    return data;
  }, [dataRumah, sortOrder]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentData = sortedData.slice(indexOfFirst, indexOfLast);

  const renderPaginationButtons = () =>
    Array.from({ length: totalPages }, (_, i) => i + 1)
      .filter((page) => {
        if (totalPages <= 10) return true;
        if (currentPage <= 6) return page <= 10 || page === totalPages;
        if (currentPage >= totalPages - 5)
          return page > totalPages - 10 || page === 1;
        return (
          page === 1 ||
          page === totalPages ||
          (page >= currentPage - 4 && page <= currentPage + 4)
        );
      })
      .map((page, idx, arr) => {
        const prevPage = arr[idx - 1];
        const showEllipsis = prevPage && page - prevPage > 1;
        return (
          <span key={page} className="flex items-center">
            {showEllipsis && (
              <span className="px-2 py-1 text-gray-500">...</span>
            )}
            <button
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 border rounded ${
                currentPage === page
                  ? "bg-[#549AF8] text-white"
                  : "bg-white text-gray-800 hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          </span>
        );
      });

  const handleSortToggle = () => {
    const newOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newOrder);
    
    const queryParams = new URLSearchParams(location.search);
    queryParams.set("sort_order", newOrder);
    navigate(`?${queryParams.toString()}`, { replace: true });
    
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex justify-center mt-10">
        <Search />
      </div>
      <div className="flex justify-between items-center px-10 mt-6">
        <div className="w-52 h-5 md:block hidden"></div>
        <div className="gap-3 flex flex-wrap justify-center">
          <a className="bg-white border-2 border-gray-600/50 text-black px-5 py-1 rounded-full">
            Tanah & Bangunan{" "}
            <span className="font-semibold">
              {summaryData["Tanah & Bangunan"] ?? 0}
            </span>
          </a>
          <a className="bg-white border-2 border-gray-600/50 text-black px-5 py-1 rounded-full">
            Apartemen{" "}
            <span className="font-semibold">
              {summaryData["Apartemen"] ?? 0}
            </span>
          </a>
          <a className="bg-white border-2 border-gray-600/50 text-black px-5 py-1 rounded-full">
            Ruko{" "}
            <span className="font-semibold">
              {summaryData["Ruko/Rukan"] ?? 0}
            </span>
          </a>
        </div>
        <button
          onClick={handleSortToggle}
          className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-md shadow-sm hover:bg-gray-100 transition-all duration-200"
        >
          {sortOrder === "asc" ? (
            <>
              <ArrowDownAZ size={18} className="text-gray-700" />
              <span className="font-medium text-gray-700">
                Termurah → Termahal
              </span>
            </>
          ) : (
            <>
              <ArrowUpZA size={18} className="text-gray-700" />
              <span className="font-medium text-gray-700">
                Termahal → Termurah
              </span>
            </>
          )}
        </button>
      </div>

      <main className="flex-1 p-6 bg-white">
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: itemsPerPage }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : currentData.length === 0 ? (
          <div className="text-center text-gray-500">
            Tidak ada data ditemukan
          </div>
        ) : (
          <>
            <AnimatePresence>
              <motion.div
                layout
                className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 overflow-y-auto"
                style={{ maxHeight: "calc(105vh - 200px)" }}
              >
                {currentData.map((item) => (
                  <PropertyCard
                    key={item.ref_id}
                    item={item}
                    onClick={() => handleDetail(item.ref_id)}
                  />
                ))}
              </motion.div>
            </AnimatePresence>

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Prev
                </button>
                {renderPaginationButtons()}
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}