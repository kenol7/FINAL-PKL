import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../Config/Endpoint";
import "keen-slider/keen-slider.min.css";
import KeenSlider from "keen-slider";
import { useLoading } from "../../Context/Loader";

// 🔔 ToastAlert didefinisikan inline
const ToastAlert = ({ message, type, isVisible, onClose }) => {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);

    if (!isVisible) return null;

    const bgColor =
        type === "error"
            ? "bg-red-100 border-red-500 text-red-700"
            : "bg-green-100 border-green-500 text-green-700";

    return (
        <div
            className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-11/12 max-w-md p-4 rounded-lg shadow-lg border-l-4 ${bgColor} transition-all duration-300 ease-in-out`}
            role="alert"
        >
            <p className="font-bold">{type === "error" ? "Error" : "Berhasil"}</p>
            <p>{message}</p>
        </div>
    );
};

const DetailRumah = () => {
    const [favorit, setFavorit] = useState(false);
    const navigate = useNavigate();
    const { showLoading, hideLoading } = useLoading();

    const [detail, setDetail] = useState(null);
    const [imageSlider, setImageSlider] = useState([]);
    const [imageShow, setImageShow] = useState("");
    const sliderRef = useRef(null);
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);

    const map_key = "AIzaSyDtRAmlhx3Ada5pVl5ilzeHP67TLxO6pyo";
    const apibook = API.endpointBookmark;

    // Toast state
    const [toast, setToast] = useState({
        isVisible: false,
        message: "",
        type: "success",
    });

    const showToast = (message, type = "success") => {
        setToast({ isVisible: true, message, type });
    };

    const hideToast = () => {
        setToast((prev) => ({ ...prev, isVisible: false }));
    };

    const ChangeImageShow = (imgName) => {
        setImageShow(imgName);
    };

    const GetContribution = async (refid) => {
        try {
            const res = await fetch(API.endpointDetail + "&ref_id=" + refid);
            const response = await res.json();
            setDetail(response);
        } catch (error) {
            console.error("Gagal fetch detail:", error);
        }
    };

    // 🔁 Cek status favorit dari localStorage
    const updateFavoritStatus = () => {
        if (!detail?.ref_id) return;
        const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
        const isBookmarked = favorites.some(item => item.ref_id === detail.ref_id);
        setFavorit(isBookmarked);
    };

    // 📡 Dengarkan custom event saat localStorage berubah
    useEffect(() => {
        const handleFavoritesUpdated = () => {
            updateFavoritStatus();
        };

        window.addEventListener("favoritesUpdated", handleFavoritesUpdated);
        updateFavoritStatus(); // Cek saat mount

        return () => {
            window.removeEventListener("favoritesUpdated", handleFavoritesUpdated);
        };
    }, [detail?.ref_id]);

    const toggleFavorit = async () => {
        if (!detail?.ref_id) {
            console.warn("ref_id tidak tersedia");
            return;
        }

        const email = localStorage.getItem("auth_email");
        if (!email || !email.trim()) {
            showToast("Anda harus login terlebih dahulu.", "error");
            return;
        }

        const newFavoritStatus = !favorit;
        setFavorit(newFavoritStatus);

        const mode = newFavoritStatus ? "add" : "delete";
        const payload = {
            mode,
            email: email.trim(),
            ref_id: detail.ref_id,
        };

        try {
            const res = await fetch(apibook, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const result = await res.json();

            if (!res.ok || result.status === "error") {
                if (result.message && result.message.includes("sudah ada")) {
                    const currentFavorites = JSON.parse(localStorage.getItem("favorites") || "[]");
                    if (!currentFavorites.some(item => item.ref_id === detail.ref_id)) {
                        localStorage.setItem(
                            "favorites",
                            JSON.stringify([...currentFavorites, detail])
                        );
                        window.dispatchEvent(new Event("favoritesUpdated")); // 🔔
                    }
                    showToast("Properti sudah ada di bookmark.", "success");
                    return;
                }
                throw new Error(result.message || "Gagal memperbarui favorit");
            }

            const currentFavorites = JSON.parse(localStorage.getItem("favorites") || "[]");
            if (newFavoritStatus) {
                localStorage.setItem("favorites", JSON.stringify([...currentFavorites, detail]));
            } else {
                const updated = currentFavorites.filter(item => item.ref_id !== detail.ref_id);
                localStorage.setItem("favorites", JSON.stringify(updated));
            }

            window.dispatchEvent(new Event("favoritesUpdated")); // 🔔

            showToast(
                newFavoritStatus
                    ? "Properti berhasil ditambahkan ke favorit."
                    : "Properti berhasil dihapus dari favorit."
            );

        } catch (error) {
            console.error("Error toggle favorit:", error);
            setFavorit(!newFavoritStatus);
            showToast(error.message, "error");
        }
    };

    const GetContributionImage = async (refid) => {
        try {
            const res = await fetch(API.endpointImageDetail + "&ref_id=" + refid);
            const response = await res.json();
            setImageSlider(response);
            if (response.length > 0) {
                setImageShow(response[0].image);
            }
        } catch (error) {
            console.error("Gagal fetch gambar:", error);
        }
    };

    const loadGoogleMapsScript = () => {
        if (window.google && window.google.maps) {
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = `https://maps.googleapis.com/maps/api/js?key=${map_key}&libraries=geometry`;
            script.async = true;
            script.defer = true;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    };

    const initMap = (lat, lng) => {
        if (!window.google || !window.google.maps) {
            console.warn("Google Maps belum siap");
            return;
        }

        const mapOptions = {
            zoom: 15,
            center: { lat, lng },
            mapTypeId: window.google.maps.MapTypeId.ROADMAP,
            zoomControl: true,
            streetViewControl: false,
            fullscreenControl: true,
            mapTypeControl: false,
        };

        const map = new window.google.maps.Map(mapRef.current, mapOptions);

        new window.google.maps.Marker({
            position: { lat, lng },
            map: map,
            title: detail?.cluster_apart_name || "Lokasi Properti",
        });

        mapInstanceRef.current = map;
    };

    useEffect(() => {
        if (!detail || !detail.latitude || !detail.longitude) return;

        const lat = parseFloat(detail.latitude);
        const lng = parseFloat(detail.longitude);

        if (isNaN(lat) || isNaN(lng)) return;

        if (mapInstanceRef.current) {
            mapInstanceRef.current.setCenter({ lat, lng });
            return;
        }

        loadGoogleMapsScript()
            .then(() => {
                initMap(lat, lng);
            })
            .catch((err) => {
                console.error("Gagal memuat Google Maps:", err);
            });
    }, [detail]);

    useEffect(() => {
        if (!sliderRef.current || imageSlider.length === 0) return;

        let interval;
        const autoplayDuration = 2000;

        const newSlider = new KeenSlider(sliderRef.current, {
            mode: "snap",
            slides: { perView: 1, spacing: 10 },
            created(s) {
                interval = setInterval(() => s.next(), autoplayDuration);
                s.container.addEventListener("mouseover", () => clearInterval(interval));
                s.container.addEventListener("mouseout", () => {
                    interval = setInterval(() => s.next(), autoplayDuration);
                });
            },
            destroyed() {
                if (interval) clearInterval(interval);
            },
        });

        return () => {
            if (newSlider) newSlider.destroy();
        };
    }, [imageSlider]);

    useEffect(() => {
        const path = window.location.pathname;
        const segments = path.split("/");
        const paramRefId = segments[2];

        if (paramRefId) {
            showLoading();
            Promise.all([GetContribution(paramRefId), GetContributionImage(paramRefId)]).finally(() => {
                hideLoading();
            });
        }
    }, []);

    if (!detail) {
        return null;
    }

    return (
        <>
            <div
                className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-[33px] px-4 md:px-[80px] py-6"
                key={detail.ref_id}
            >
                <div className="space-y-6">
                    <div className="flex items-center justify-between font-jakarta text-xs">
                        <button
                            className="px-3 py-2 h-8 rounded-md bg-[#F4D77B] hover:bg-[#E7C555] transition flex items-center justify-center gap-1"
                            onClick={() => navigate("/")}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 19l-7-7 7-7"
                                />
                            </svg>
                            Back
                        </button>
                        <div className="rounded-xl border-[#E7C555] bg-white px-3 py-1 border-2 text-sm">
                            {detail.ref_id}
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="font-jakarta">
                            <h1 className="text-xl md:text-2xl font-bold">{detail.cluster_apart_name}</h1>
                            <h3 className="text-sm text-gray-600">{detail.city}</h3>
                        </div>
                        <div className="bg-[#E7C555] rounded-2xl w-full md:w-[244px] h-[45px] flex items-center justify-center text-center text-lg font-semibold font-jakarta">
                            Rp{" "}
                            {detail.property_price
                                ? new Intl.NumberFormat("id-ID").format(detail.property_price)
                                : "N/A"}
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-4 p-3 rounded-lg">
                        <div className="flex flex-wrap gap-4 text-sm font-jakarta justify-center md:justify-start">
                            {[
                                { label: "L.Tanah", value: `${detail.square_land}m²` },
                                { label: "L.Bangunan", value: `${detail.square_building}m²` },
                                { label: "Lantai", value: detail.property_floor },
                                { label: "Status Data", value: "Transaksi" },
                            ].map((stat, idx, arr) => (
                                <div
                                    key={idx}
                                    className={`flex flex-col items-center px-3 ${idx < arr.length - 1 ? "border-r border-gray-900" : ""
                                        }`}
                                >
                                    <span className="font-semibold text-lg">{stat.value}</span>
                                    <span className="text-gray-600 text-xs">{stat.label}</span>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={toggleFavorit}
                            disabled={!detail}
                            className="flex flex-col items-center focus:outline-none mt-2 md:mt-0"
                        >
                            {favorit ? (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 text-red-500"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M5 5h14v14l-7-3-7 3V5z" />
                                </svg>
                            ) : (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 text-gray-700"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M7 5h10l-1 14-4-2-4 2-1-14z"
                                    />
                                </svg>
                            )}
                            <span className="text-xs text-gray-600 mt-1">Favorit</span>
                        </button>
                    </div>
                    <div>
                        <h2 className="font-semibold text-xl mb-2">Lokasi</h2>
                        <p className="text-sm">{detail.address}</p>
                    </div>
                    <div>
                        <h2 className="font-semibold text-xl mb-2 font-jakarta">Kepemilikan</h2>
                        <p className="text-sm">{detail.contact_name}</p>
                        <p className="text-sm">{detail.class_building_name}</p>
                        <p className="text-sm">{detail.condition_field_name}</p>
                        <p className="text-sm">{detail.allotment_name}</p>
                        <p className="text-sm">{detail.document_name}</p>
                    </div>
                    <div>
                        <h2 className="font-semibold text-xl mb-2 font-jakarta">Detail</h2>
                        <p className="text-sm">{detail.asset_category_name}</p>
                        <p className="text-sm">{detail.asset_type_name}</p>
                        <p className="text-sm">{detail.condition_building_name}</p>
                        <p className="text-sm">{detail.class_road_name}</p>
                        <p className="text-sm">{detail.occupancy_building_name}</p>
                        <p className="text-sm">{detail.traffic_volume_name}</p>
                        <p className="text-sm">{detail.possible_flooding_name}</p>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center gap-4 p-4 bg-white rounded-lg">
                        <div className="font-jakarta text-sm text-gray-700 min-w-0">
                            <p>
                                Anda berminat untuk mengambil rumah ini? <br className="md:hidden" />
                                Klik kontak di samping untuk melakukan pembeliannya.
                            </p>
                        </div>
                        <button className="w-full md:w-auto py-2 px-4 rounded-xl bg-[#F4D77B] hover:bg-[#E7C555] transition flex items-center justify-center gap-2 whitespace-nowrap">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="text-green-600"
                            >
                                <path d="M20.52 3.48A11.8 11.8 0 0012 0C5.37 0 0 5.37 0 12c0 2.11.55 4.15 1.59 5.95L0 24l6.22-1.63A11.94 11.94 0 0012 24c6.63 0 12-5.37 12-12 0-3.19-1.24-6.19-3.48-8.52zM12 22a9.88 9.88 0 01-5.04-1.39l-.36-.21-3.7.97.99-3.61-.23-.37A9.91 9.91 0 012 12c0-5.52 4.48-10 10-10 2.67 0 5.18 1.04 7.07 2.93A9.91 9.91 0 0122 12c0 5.52-4.48 10-10 10zm5.47-7.46c-.3-.15-1.79-.88-2.07-.98-.28-.1-.48-.15-.68.15-.2.3-.78.98-.96 1.18-.18.2-.36.23-.66.08-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.5-1.8-1.68-2.1-.18-.3-.02-.46.13-.61.13-.13.3-.36.45-.54.15-.18.2-.3.3-.5.1-.2.05-.38-.03-.53-.08-.15-.68-1.62-.93-2.21-.24-.58-.49-.5-.68-.51h-.58c-.2 0-.53.08-.81.38-.28.3-1.07 1.05-1.07 2.55 0 1.5 1.1 2.95 1.25 3.15.15.2 2.16 3.3 5.23 4.62.73.32 1.3.5 1.75.64.74.23 1.41.2 1.94.12.59-.09 1.79-.73 2.05-1.44.25-.71.25-1.32.18-1.44-.07-.12-.27-.2-.57-.35z" />
                            </svg>
                            Kontak Person
                        </button>
                    </div>
                </div>

                <div className="flex flex-col items-center">
                    <div className="relative w-full">
                        <img
                            src={`${API.endpointImage}/${imageShow}?v=${Math.random() * 2000}`}
                            alt="fotorumah"
                            className="w-full h-auto object-cover rounded-xl shadow-md"
                        />
                    </div>

                    {detail.latitude && detail.longitude ? (
                        <div
                            ref={mapRef}
                            className="w-full h-52 md:h-60 rounded-lg shadow-md mt-6"
                            style={{ minHeight: "200px" }}
                        />
                    ) : (
                        <div className="mt-6 bg-gray-100 border border-gray-300 rounded-lg p-4 w-full text-center text-sm text-gray-500">
                            Lokasi tidak tersedia
                        </div>
                    )}

                    <div className="flex justify-center mt-4 space-x-2">
                        {imageSlider.map((el, i) => (
                            <button
                                key={i}
                                onClick={() => ChangeImageShow(el.image)}
                                className={`px-3 py-1 rounded-full text-sm font-bold ${imageShow === el.image
                                        ? "bg-[#E7C555] text-white"
                                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* 🔔 Render ToastAlert */}
            <ToastAlert
                message={toast.message}
                type={toast.type}
                isVisible={toast.isVisible}
                onClose={hideToast}
            />
        </>
    );
};

export default DetailRumah;