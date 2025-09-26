import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../Components/Elements/Sidebar";
import Navbar from "../Components/Elements/Navbar";
import Footer from "../Components/Elements/Footer";
import { useNavigate } from "react-router-dom";

//DINIKIN 9 CARD UDAH BENER TAPI DIBIKIN SCROLL KEATAS CARDNYA JADI UTK BAGIAN SIDEBAR NYA STAY DAN YG CARD NYA YG SCROLL KEATAS CARD 9 TO 6 KALAU DI SCROLL

export default function KprPage() {
  const [dataRumah, setDataRumah] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [itemsPerPage, setItemsPerPage] = useState(9);


  const navigate = useNavigate();
  const handledetail = (ref_id) => {
    navigate('/detailrumah/' + ref_id)
  }
  const endPoint =
    "https://smataco.my.id/dev/unez/CariRumahAja/api/contribution.php?mode=latest";
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
        <Sidebar />

        <main className="flex-1 p-6 bg-white">
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
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 overflow-y-auto"
              style={{ maxHeight: "calc(105vh - 200px)" }}>
              {currentData.map((item, i) => (
                <div
                  key={i}
                  className="w-full overflow-hidden bg-white rounded-lg shadow-md shadow-black/30"
                  
                  onClick={() => handledetail (item.ref_id)}
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
                        <span className="block text-sm font-semibold text-gray-800 bg-yellow-400 px-3 rounded-lg">
                          Rp{" "}
                          {item.property_price
                            ? new Intl.NumberFormat("id-ID").format(
                                item.property_price.slice(0, -2)
                              )
                            : "N/A"}
                        </span>
                        <p className="text-xs text-gray-600 mt-1">Transaksi</p>
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
