import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../Components/Elements/Sidebar";
import Navbar from "../Components/Elements/Navbar";
import Footer from "../Components/Elements/Footer";
import { useNavigate } from "react-router-dom";

//DINIKIN 9 CARD UDAH BENER TAPI DIBIKIN SCROLL KEATAS CARDNYA JADI UTK BAGIAN SIDEBAR NYA STAY DAN YG CARD NYA YG SCROLL KEATAS CARD 9 TO 6 KALAU DI SCROLL

export default function KprPage() {
  const [dataRumah, setDataRumah] = useState([]);
  const [hasilKPR, setHasilKPR] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [hasilSimulasi, setHasilSimulasi] = useState(null);
  const [loadingSimulasi, setLoadingSimulasi] = useState(false);
  const [displayMode, setDisplayMode] = useState("normal");

  const navigate = useNavigate();
  const handledetail = (ref_id) => {
    navigate("/detailrumah/" + ref_id);
  };
  const endPoint =
    "https://smataco.my.id/dev/unez/CariRumahAja/routes/contribution.php?mode=latest";
  const endPointFilter =
    "https://smataco.my.id/dev/unez/CariRumahAja/routes/contribution.php?";
  const endpointImage =
    "https://smataco.my.id/dev/unez/CariRumahAja/foto/rumah.jpg";

  // Fetch data API
  useEffect(() => {
    setLoading(true);
    axios
      .get(endPoint)
      .then((res) => {
        if (Array.isArray(res.data)) {
          setDataRumah(res.data);
        } else if (res.data.data) {
          setDataRumah(res.data.data);
        } else {
          setDataRumah([]);
        }
      })
      // fetch(endPoint)
      //   .then((res) => res.json())
      //   .then((data) => {
      //     setDataRumah(data);
      //   })
      .catch((err) => console.error("Gagal fetch data:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleHitungKPR = async ({ dp, tenor }) => {
    const params = {
      mode: "hitung_kpr",
      dp,
      tenor,
    };
    try {
      setLoading(true);
      const res = await axios.get(endPointFilter, { params });
      console.log("Hasil KPR:", res.data);
      setDataRumah(res.data);
      setDisplayMode("kpr");
      setCurrentPage(1);
    } catch (err) {
      console.error("Gagal hitung KPR:", err);
      alert("Terjadi kesalahan saat menghitung KPR!");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitSimulasi = async ({ dp, tenor, gaji }) => {
    const params = {
      mode: "simulasi_kpr",
      dp,
      tenor,
      gaji,
    };
    try {
      setLoadingSimulasi(true);
      const res = await axios.get(endPointFilter, { params });
      setHasilSimulasi(res.data.ringkasan_kemampuan);
      console.log("Hasil Simulasi:", res.data.rekomendasi_properti);
      setDataRumah(res.data.rekomendasi_properti);
      setDisplayMode("simulasi");
      setCurrentPage(1);
    } catch (err) { 
      console.error("Gagal simulasi:", err);
      alert("Gagal menghitung simulasi KPR");
    } finally {
      setLoadingSimulasi(false);
    }
  };

  const totalPages = Math.ceil(dataRumah.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentData = dataRumah.slice(indexOfFirst, indexOfLast);

  // Skeleton shimmer card
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

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar
          onHitungKPR={handleHitungKPR}
          onSimulasiKPR={handleSubmitSimulasi}
          loadingSimulasi={loadingSimulasi}
        />

        <main className="flex-1 p-6 bg-white">
          {displayMode === "simulasi" && hasilSimulasi && (
            <div className="gap-3 flex flex-wrap justify-center mb-10">
              <a className="bg-white border-2 border-gray-600/50 text-black px-5 py-1 rounded-full">
                Gaji Bulanan:
                <span className="font-semibold ml-2">
                  {hasilSimulasi ? hasilSimulasi.gaji_bulanan : "0"}
                </span>
              </a>

              <a className="bg-white border-2 border-gray-600/50 text-black px-5 py-1 rounded-full">
                Kesanggupan Dp:
                <span className="font-semibold ml-2">
                  {hasilSimulasi ? hasilSimulasi.dp_tersedia : "0"}
                </span>
              </a>

              <a className="bg-white border-2 border-gray-600/50 text-black px-5 py-1 rounded-full">
                Batas Aman Cicilan:
                <span className="font-semibold ml-2">
                  {hasilSimulasi ? hasilSimulasi.maks_cicilan : "0"}
                </span>
              </a>

              <a className="bg-white border-2 border-gray-600/50 text-black px-5 py-1 rounded-full">
                Rekomendasi Harga:
                <span className="font-semibold ml-2">
                  {hasilSimulasi ? hasilSimulasi.estimasi_harga_rumah : "0"}
                </span>
              </a>
            </div>
          )}
          {(displayMode === "kpr" || displayMode === "simulasi") && (
            <div className="flex justify-center mb-6">
              <button
                onClick={() => {
                  setDisplayMode("normal");
                  setHasilSimulasi(null);
                  setLoading(true);
                  axios
                    .get(endPoint)
                    .then((res) => {
                      if (Array.isArray(res.data)) {
                        setDataRumah(res.data);
                      } else if (res.data.data) {
                        setDataRumah(res.data.data);
                      } else {
                        setDataRumah([]);
                      }
                    })
                    .catch((err) => console.error("Gagal fetch data:", err))
                    .finally(() => setLoading(false));
                }}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                  <path d="M21 3v5h-5" />
                  <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                  <path d="M8 16H3v5" />
                </svg>
                Lihat Semua Properti
              </button>
            </div>
          )}

          {/* Loading shimmer */}
          {loading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: itemsPerPage }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : currentData.length === 0 ? (
            <div className="text-center text-gray-500">Tidak ada data</div>
          ) : (
            <div
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 overflow-y-auto"
              style={{ maxHeight: "calc(105vh - 200px)" }}
            >
              {currentData.map((item, i) => (
                <div
                  key={i}
                  className="w-full overflow-hidden bg-white rounded-lg shadow-md shadow-black/30"
                  onClick={() => handledetail(item.ref_id)}
                >
                  <div className="rounded-xl overflow-hidden relative">
                    {/* Image */}
                    <div className="w-full h-[200px] bg-gray-300 flex items-center justify-center">
                      <h3 className="text-xs font-extrabold top-3 right-3 absolute bg-[#E5E7EB] px-2 py-1 rounded-full border-2 border-[#D4AF37]">
                        {item.ref_id}
                      </h3>
                      <img
                        // src={endpointImage + item.image}
                        src={endpointImage}
                        alt={item.cluster_apart_name}
                        className="object-cover w-full h-full"
                        loading="lazy"
                      />

                      {/* <img
                          // src={endpointImage + item.image}
                          src={endpointImage}
                          alt={item.cluster_apart_name}
                          className="object-cover w-full h-full"
                          loading="lazy"
                        />
                      ) : ( */}
                      {/* <span className="text-gray-400">No Image</span>
                      )} */}
                    </div>

                    {/* Content */}

                    <div className="flex items-center justify-between bg-gray-100 p-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 ">
                          {item.cluster_apart_name.slice(0, 15) || "Perumahan"}
                        </h3>
                        <p className="text-sm text-gray-700">
                          {item.city || "Kota Tidak Diketahui"}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          LT {item.square_land}m² | LB {item.square_building}m²
                          | L {item.property_floor}
                        </p>
                      </div>

                      <div className="flex flex-col text-right w-fit">
                        {displayMode === "kpr" &&
                        item.angsuran_bulanan_formatted ? (
                          <>
                            <span className="block text-sm font-semibold text-gray-800 bg-green-400 px-3 rounded-lg">
                              {item.angsuran_bulanan_formatted}
                            </span>
                            <p className="text-xs text-gray-600 mt-1">/bulan</p>
                          </>
                        ) : (
                          <>
                            <span className="mb-2 block text-sm font-semibold text-gray-800 bg-yellow-400 px-3 rounded-lg">
                              Rp{" "}
                              {item.property_price
                                ? new Intl.NumberFormat("id-ID").format(
                                    item.property_price
                                  )
                                : "N/A"}
                            </span>
                            {displayMode === "normal" ? (
                              <p className="text-xs text-gray-600 mt-1">
                                Transaksi
                              </p>
                            ) : (
                              <p className="hidden"></p>
                            )}
                            {item.angsuran_bulanan_formatted === 0 ? (
                              <p className="text-xs text-gray-600 mt-1">
                                {displayMode === "simulasi"
                                  ? "Rekomendasi"
                                  : "Transaksi"}
                              </p>
                            ) : (
                              <span className="block text-sm font-semibold text-gray-800 bg-green-400 px-3 rounded-lg">
                                {item.angsuran_bulanan_formatted}
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
              {/* Prev button */}
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Prev
              </button>

              {/* Page numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((page) => {
                  if (totalPages <= 10) return true;
                  if (currentPage <= 6)
                    return page <= 10 || page === totalPages;
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
                })}

              {/* Next button */}
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}
