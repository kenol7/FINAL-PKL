import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThreeCircles } from "react-loader-spinner";
import API from "../../Config/Endpoint";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import * as exifr from 'exifr';
import PetaDragable from "./PetaDragable";
import introJs from "intro.js";
import "intro.js/minified/introjs.min.css";

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
      <p className="font-bold">{type === "error" ? "Error" : "Success"}</p>
      <p>{message}</p>
    </div>
  );
};

const JualRumah = () => {
  const endpoint = API.endpointjualrumah;

  const [toast, setToast] = useState({
    message: "",
    type: "error",
    visible: false,
  });
  const [loading, setLoading] = useState(false);

  const showToast = (message, type = "error") => {
    setToast({ message, type, visible: true });
  };

  const [mapPosition, setMapPosition] = useState({
    lat: -6.2088,
    lng: 106.8456,
  });
  const [isDraggable, setIsDraggable] = useState(false);

  const hideToast = () => {
    setToast((prev) => ({ ...prev, visible: false }));
  };

  const [showArrowUp, setShowArrowUp] = useState({});

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const [nomorTeleponE164, setNomorTeleponE164] = useState("");

  const shouldShowLuasTanah = () => {
    return !["Rusun", "Apartemen"].includes(kategoriAset);
  };

  const shouldShowLuasBangunan = () => {
    return !["Perkebunan", "Pertanian/Perikanan"].includes(kategoriAset);
  };

  const shouldShowTotalLantai = () => {
    return !["Perkebunan", "Pertanian/Perikanan"].includes(kategoriAset);
  };

  const toggleArrow = (field) => {
    setShowArrowUp((prev) => {
      const newState = {};
      Object.keys(prev).forEach((key) => {
        newState[key] = false;
      });
      newState[field] = !prev[field];
      return newState;
    });
  };

  const formatRupiah = (angka) => {
    if (!angka) return "";
    return angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const [hargaRaw, setHargaRaw] = useState("");

  // State input numerik
  const [harga, setHarga] = useState("");
  const [luasTanah, setLuasTanah] = useState("");
  const [luasBangunan, setLuasBangunan] = useState("");
  const [totalLantai, setTotalLantai] = useState("");
  const [discount, setDiscount] = useState("");
  const [nomorTelepon, setNomorTelepon] = useState("");

  // State dropdown lokasi
  const [selectedProvinsi, setSelectedProvinsi] = useState("");
  const [selectedKota, setSelectedKota] = useState("");
  const [selectedKecamatan, setSelectedKecamatan] = useState("");
  const [selectedKelurahan, setSelectedKelurahan] = useState("");

  // State dropdown master
  const [kategoriPemilik, setKategoriPemilik] = useState("");
  const [statusTransaksi, setStatusTransaksi] = useState("");
  const [dokumenProperti, setDokumenProperti] = useState("");
  const [klasifikasiBangunan, setKlasifikasiBangunan] = useState("");
  const [kategoriLahan, setKategoriLahan] = useState("");
  const [peruntukan, setPeruntukan] = useState("");
  const [kategoriAset, setKategoriAset] = useState("");
  const [tipeAset, setTipeAset] = useState("");
  const [kondisiBangunan, setKondisiBangunan] = useState("");
  const [klasifikasiJalan, setKlasifikasiJalan] = useState("");
  const [jalurLaluLintas, setJalurLaluLintas] = useState("");
  const [potensiBanjir, setPotensiBanjir] = useState("");
  const [tingkatHunian, setTingkatHunian] = useState("");

  // Data dari API
  const APIuser = API.endpointregist
  const [provinsiList, setProvinsiList] = useState([]);
  const [kotaList, setKotaList] = useState([]);
  const [kecamatanList, setKecamatanList] = useState([]);
  const [kelurahanList, setKelurahanList] = useState([]);

  const [contactTypes, setContactTypes] = useState([]);
  const [statusDataList, setStatusDataList] = useState([]);
  const [documentList, setDocumentList] = useState([]);
  const [classBuildingList, setClassBuildingList] = useState([]);
  const [conditionFieldList, setConditionFieldList] = useState([]);
  const [allotmentList, setAllotmentList] = useState([]);
  const [assetCategoryList, setAssetCategoryList] = useState([]);
  const [assetTypeList, setAssetTypeList] = useState([]);
  const [conditionBuildingList, setConditionBuildingList] = useState([]);
  const [classRoadList, setClassRoadList] = useState([]);
  const [trafficVolumeList, setTrafficVolumeList] = useState([]);
  const [floodingList, setFloodingList] = useState([]);
  const [occupancyList, setOccupancyList] = useState([]);

  const [isEditMode, setIsEditMode] = useState(false);
  const handleTooltips = async () => {
    const email = localStorage.getItem("auth_email");
    try {
      const payload = {
        mode: 'UPDATE',
        action: 'tooltipsSell',
        email: email
      };
      fetch(APIuser, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(res => res.json())
    } catch {
      console.error("Gagal:", error);
    }
  }

  const checkIntroStatus = () => {
    const seen =
      localStorage.getItem("isSell");
    return seen === "true"
  };
  const runIntro = () => {
    const intro = introJs();
    intro.setOptions({
      steps: [
        {
          element: "#btn-upload-gambar",
          intro: "Mulai dengan upload foto rumah Anda (maksimal 5 foto).",
        },
        {
          element: "#section-peta",
          intro:
            "Geser penanda di peta untuk menentukan lokasi rumah secara akurat.",
        },
        {
          element: "#input-nama-rumah",
          intro: "Masukkan nama rumah atau apartemen yang dijual.",
        },
        {
          element: "#input-nama-pemilik",
          intro: "Isi nama pemilik rumah sesuai dokumen kepemilikan.",
        },
        {
          element: "#select-kategori-pemilik",
          intro:
            "Pilih kategori pemilik, misalnya perorangan atau developer.",
        },
        {
          element: "#input-harga",
          intro: "Masukkan harga jual rumah dalam rupiah.",
        },
        {
          element: "#input-telepon",
          intro:
            "Masukkan nomor telepon aktif untuk dihubungi calon pembeli.",
        },
        {
          element: "#input-alamat",
          intro: "Tulis alamat lengkap rumah Anda.",
        },
        {
          element: "#select-provinsi",
          intro: "Pilih provinsi lokasi rumah.",
        },
        {
          element: "#select-kota",
          intro: "Pilih kota atau kabupaten lokasi rumah.",
        },
        {
          element: "#select-kecamatan",
          intro: "Pilih kecamatan lokasi rumah.",
        },
        {
          element: "#select-kelurahan",
          intro: "Pilih kelurahan lokasi rumah.",
        },
        {
          element: "#select-dokumen",
          intro: "Pilih jenis dokumen kepemilikan properti.",
        },
        {
          element: "#select-klasifikasi-bangunan",
          intro:
            "Pilih klasifikasi bangunan (misalnya rumah tinggal, ruko, dsb).",
        },
        {
          element: "#select-kategori-lahan",
          intro: "Pilih kategori lahan, misalnya perumahan atau komersial.",
        },
        {
          element: "#select-peruntukan",
          intro: "Pilih peruntukan lahan properti Anda.",
        },
        {
          element: "#input-luas-tanah",
          intro: "Masukkan luas tanah dalam meter persegi (m²).",
        },
        {
          element: "#input-luas-bangunan",
          intro: "Masukkan luas bangunan dalam meter persegi (m²).",
        },
        {
          element: "#input-total-lantai",
          intro: "Masukkan jumlah lantai bangunan.",
        },
        {
          element: "#select-status-transaksi",
          intro: "Pilih status transaksi (dijual, disewakan, dll).",
        },
        {
          element: "#select-kategori-aset",
          intro: "Pilih kategori aset (residensial, komersial, dsb).",
        },
        {
          element: "#select-tipe-aset",
          intro: "Pilih tipe aset (rumah, apartemen, tanah kosong, dll).",
        },
        {
          element: "#select-kondisi-bangunan",
          intro: "Pilih kondisi bangunan (baru, bekas, renovasi, dll).",
        },
        {
          element: "#select-klasifikasi-jalan",
          intro:
            "Pilih klasifikasi jalan di depan rumah (utama, lingkungan, gang, dll).",
        },
        {
          element: "#select-jalur-lalu-lintas",
          intro:
            "Pilih tingkat kepadatan jalur lalu lintas di depan properti.",
        },
        {
          element: "#select-potensi-banjir",
          intro: "Pilih potensi banjir di sekitar lokasi.",
        },
        {
          element: "#select-tingkat-hunian",
          intro: "Pilih tingkat hunian di lingkungan sekitar.",
        },
        {
          element: "#input-diskon",
          intro: "Masukkan diskon yang ingin diberikan (opsional).",
        },
        {
          element: "#btn-verifikasi",
          intro:
            "Klik tombol ini untuk memverifikasi semua data sebelum dikirim.",
        },
      ],
      disableInteraction: true,
      showProgress: true,
      showBullets: false,
      nextLabel: "Lanjut →",
      prevLabel: "← Kembali",
      doneLabel: "Selesai",
    });

    setTimeout(() => intro.start(), 800);

    // intro.oncomplete(() => localStorage.setItem("hasSeenIntroJual", "true"));
    // intro.onexit(() => localStorage.setItem("hasSeenIntroJual", "true"));

    // Saat user selesai atau skip → simpan status ke localStorage
    intro.oncomplete(() => {
      localStorage.setItem("isSell", "true");
      handleTooltips()
    });
    
    intro.onexit(() => {
      localStorage.setItem("isSell", "true");
      handleTooltips()
    });
  }
  const [hasSeenIntro, setHasSeenIntro] = useState(checkIntroStatus());


  useEffect(() => {
    const hasSeenIntro = localStorage.getItem("isSell");
    if (hasSeenIntro !== "1") {
      runIntro();
      handleTooltips()

    }
  }, [hasSeenIntro]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const provRes = await fetch(`${endpoint}?mode=get_provinsi`);
        const provData = await provRes.json();
        setProvinsiList(provData);

        const contactRes = await fetch(`${endpoint}?mode=get_contact_type`);
        const contactData = await contactRes.json();
        setContactTypes(contactData);

        const statusDataRes = await fetch(`${endpoint}?mode=get_status_data`);
        const statusData = await statusDataRes.json();
        setStatusDataList(statusData);

        const docRes = await fetch(`${endpoint}?mode=get_document`);
        const docData = await docRes.json();
        setDocumentList(docData);

        const classBldRes = await fetch(`${endpoint}?mode=get_class_building`);
        const classBldData = await classBldRes.json();
        setClassBuildingList(classBldData);

        const condFieldRes = await fetch(
          `${endpoint}?mode=get_condition_field`
        );
        const condFieldData = await condFieldRes.json();
        setConditionFieldList(condFieldData);

        const allotRes = await fetch(`${endpoint}?mode=get_allotment`);
        const allotData = await allotRes.json();
        setAllotmentList(allotData);

        const assetCatRes = await fetch(`${endpoint}?mode=get_asset_category`);
        const assetCatData = await assetCatRes.json();
        setAssetCategoryList(assetCatData);

        const assetTypeRes = await fetch(`${endpoint}?mode=get_asset_type`);
        const assetTypeData = await assetTypeRes.json();
        setAssetTypeList(assetTypeData);

        const condBldRes = await fetch(
          `${endpoint}?mode=get_condition_building`
        );
        const condBldData = await condBldRes.json();
        setConditionBuildingList(condBldData);

        const classRoadRes = await fetch(`${endpoint}?mode=get_class_road`);
        const classRoadData = await classRoadRes.json();
        setClassRoadList(classRoadData);

        const trafficRes = await fetch(`${endpoint}?mode=get_traffic_volume`);
        const trafficData = await trafficRes.json();
        setTrafficVolumeList(trafficData);

        const floodRes = await fetch(`${endpoint}?mode=get_possible_flooding`);
        const floodData = await floodRes.json();
        setFloodingList(floodData);

        const occupancyRes = await fetch(
          `${endpoint}?mode=get_occupancy_building`
        );
        const occupancyData = await occupancyRes.json();
        setOccupancyList(occupancyData);
      } catch (err) {
        console.error("Gagal memuat data master:", err);
      }
    };

    fetchData();
  }, [endpoint]);

  // Fetch kota, kecamatan, kelurahan
  const fetchKota = async (provinsi) => {
    if (!provinsi) return;
    try {
      const res = await fetch(
        `${endpoint}?mode=get_kota&provinsi=${encodeURIComponent(provinsi)}`
      );
      const data = await res.json();
      setKotaList(data);
    } catch (err) {
      console.error("Gagal ambil kota:", err);
    }
  };

  const fetchKecamatan = async (provinsi, kota) => {
    if (!provinsi || !kota) return;
    try {
      const res = await fetch(
        `${endpoint}?mode=get_kecamatan&provinsi=${encodeURIComponent(
          provinsi
        )}&kota=${encodeURIComponent(kota)}`
      );
      const data = await res.json();
      setKecamatanList(data);
    } catch (err) {
      console.error("Gagal ambil kecamatan:", err);
    }
  };

  const fetchKelurahan = async (provinsi, kota, kecamatan) => {
    if (!provinsi || !kota || !kecamatan) return;
    try {
      const res = await fetch(
        `${endpoint}?mode=get_kelurahan&provinsi=${encodeURIComponent(
          provinsi
        )}&kota=${encodeURIComponent(kota)}&kecamatan=${encodeURIComponent(
          kecamatan
        )}`
      );
      const data = await res.json();
      setKelurahanList(data);
    } catch (err) {
      console.error("Gagal ambil kelurahan:", err);
    }
  };

  const handleProvinsiSelect = (value) => {
    setSelectedProvinsi(value);
    setSelectedKota("");
    setSelectedKecamatan("");
    setSelectedKelurahan("");
    setKotaList([]);
    setKecamatanList([]);
    setKelurahanList([]);
    fetchKota(value);
    toggleArrow("Provinsi");
  };

  const handleHargaChange = (e) => {
    let value = e.target.value.replace(/\D/g, ""); // hanya angka
    setHargaRaw(value);
    setHarga(formatRupiah(value));
  };

  const handleKotaSelect = (value) => {
    setSelectedKota(value);
    setSelectedKecamatan("");
    setSelectedKelurahan("");
    setKecamatanList([]);
    setKelurahanList([]);
    fetchKecamatan(selectedProvinsi, value);
    toggleArrow("Kota/Kabupaten");
  };

  const handleKecamatanSelect = (value) => {
    setSelectedKecamatan(value);
    setSelectedKelurahan("");
    setKelurahanList([]);
    fetchKelurahan(selectedProvinsi, selectedKota, value);
    toggleArrow("Kecamatan");
  };

  const handleKelurahanSelect = (value) => {
    setSelectedKelurahan(value);
    toggleArrow("Kelurahan");
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files).slice(0, 5);
    setUploadedFiles(files);
    if (files.length === 0) return;

    setActiveIndex(0);

    let foundCoords = null;
    let firstValidFile = null;

    for (const file of files) {
      try {
        const coords = await readImageMetadata(file);
        if (coords && typeof coords.lat === 'number' && typeof coords.lng === 'number') {
          foundCoords = coords;
          firstValidFile = file;
          break;
        }
      } catch (error) {
        console.warn("File tanpa koordinat:", file.name, error.message);
      }
    }

    if (foundCoords) {
      setMapPosition(foundCoords);
      setIsDraggable(false);
      showToast(
        `Koordinat berhasil dibaca (${foundCoords.lat.toFixed(6)}, ${foundCoords.lng.toFixed(6)})`,
        "success"
      );
    } else {
      setIsDraggable(true);
      showToast("Tidak ada koordinat di semua gambar. Silakan tarik marker ke lokasi yang benar.", "info");
    }
  };


  const handleNumericInput = (e, setter) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setter(value);
    }
  };

  const readImageMetadata = async (file) => {
    try {
      const exifData = await exifr.parse(file);
      console.log("EXIF data:", exifData);

      const { GPSLatitude, GPSLongitude, GPSLatitudeRef, GPSLongitudeRef } = exifData;

      if (GPSLatitude && GPSLongitude) {
        const lat = Array.isArray(GPSLatitude)
          ? GPSLatitude[0] + GPSLatitude[1] / 60 + GPSLatitude[2] / 3600
          : GPSLatitude;
        const lng = Array.isArray(GPSLongitude)
          ? GPSLongitude[0] + GPSLongitude[1] / 60 + GPSLongitude[2] / 3600
          : GPSLongitude;

        const finalLat = GPSLatitudeRef === "S" ? -lat : lat;
        const finalLng = GPSLongitudeRef === "W" ? -lng : lng;

        return { lat: finalLat, lng: finalLng };
      } else {
        throw new Error("Tidak ada data GPS di gambar.");
      }
    } catch (error) {
      throw error;
    }
  };


  const convertDMSToDD = (dms, ref) => {
    if (!dms || !ref) return null;

    const degrees = dms[0];
    const minutes = dms[1];
    const seconds = dms[2];

    let dd = degrees + minutes / 60 + seconds / 3600;

    if (ref === "S" || ref === "W") {
      dd = dd * -1;
    }

    return dd;
  };

  const handlePhoneChange = (e) => {
    const rawInput = e.target.value;
    setNomorTelepon(rawInput);

    let normalized = null;
    try {
      const phoneNumber = parsePhoneNumberFromString(rawInput);
      if (phoneNumber && phoneNumber.isValid()) {
        normalized = phoneNumber.format("E.164");
      }
    } catch (err) { }

    setNomorTeleponE164(normalized);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("selectedProvinsi:", selectedProvinsi);
    console.log("selectedKota:", selectedKota);
    console.log("hargaRaw:", hargaRaw); 
    console.log("nomorTelepon:", nomorTelepon);
    console.log("nomorTeleponE164:", nomorTeleponE164);
    if (!selectedProvinsi || !selectedKota || !hargaRaw || !nomorTeleponE164) {
      showToast(
        "Harap lengkapi field wajib: Provinsi, Kota, Harga, dan Nomor Telepon"
      );
      return;
    }

    if (!nomorTeleponE164) {
      showToast(
        "Nomor telepon tidak valid. Pastikan format benar (contoh: +6281234567890 atau 081234567890)."
      );
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("mode", "upload");
    formData.append("email", "user@example.com");
    formData.append("contact_name", "Nama Pemilik");
    formData.append("contact_phone", nomorTeleponE164);
    formData.append("property_price", hargaRaw);
    formData.append("square_land", luasTanah);
    formData.append("square_building", luasBangunan);
    formData.append("property_floor", totalLantai);
    formData.append("discount", discount);
    formData.append("province", selectedProvinsi);
    formData.append("city", selectedKota);
    formData.append("kecamatan", selectedKecamatan);
    formData.append("kelurahan", selectedKelurahan);
    formData.append("address", "Jl. Contoh No. 123");
    formData.append("cluster_apart_name", "Green Garden");

    formData.append("contact_type_m", kategoriPemilik);
    formData.append("status_data_m", statusTransaksi);
    formData.append("property_document_m", dokumenProperti);
    formData.append("class_code_m", klasifikasiBangunan);
    formData.append("fieldclass_code_m", kategoriLahan);
    formData.append("allotment_code_m", peruntukan);
    formData.append("asset_category_m", kategoriAset);
    formData.append("asset_type_m", tipeAset);
    formData.append("condition_code_m", kondisiBangunan);
    formData.append("streetclass_code_m", klasifikasiJalan);
    formData.append("traffic_code_m", jalurLaluLintas);
    formData.append("flood_code_m", potensiBanjir);
    formData.append("occupancy_code_m", tingkatHunian);

    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput?.files?.length) {
      for (let i = 0; i < fileInput.files.length; i++) {
        formData.append("images[]", fileInput.files[i]);
      }
    }

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (result.status === "success") {
        showToast(`Berhasil! Ref ID: ${result.ref_id}`, "success");
      } else {
        showToast(result.message || "Terjadi kesalahan saat menyimpan data");
      }
    } catch (error) {
      console.error("Gagal mengirim ", error);
      showToast("Terjadi kesalahan jaringan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastAlert
        message={toast.message}
        type={toast.type}
        isVisible={toast.visible}
        onClose={hideToast}
      />

      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-30 z-50">
          <ThreeCircles
            height="80"
            width="80"
            color="#E7C555"
            visible={true}
            ariaLabel="three-circles-loading"
          />
        </div>
      )}

      <div className="p-4 sm:p-6 min-h-screen">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full lg:w-[300px] bg-blue-500 text-white p-6 rounded-xl flex flex-col gap-6 font-jakarta">
            <div className="flex flex-col items-center gap-4">
              <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                {uploadedFiles.length > 0 ? (
                  <img
                    src={URL.createObjectURL(uploadedFiles[activeIndex])}
                    alt={`Preview ${activeIndex + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                )}
              </div>

              {/* Thumbnail navigator */}
              {uploadedFiles.length > 1 && (
                <div className="flex gap-1">
                  {uploadedFiles.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveIndex(idx)}
                      className={`w-6 h-6 rounded border ${activeIndex === idx
                        ? "border-yellow-400 bg-yellow-100"
                        : "border-gray-400"
                        }`}
                    >
                      <img
                        src={URL.createObjectURL(_)}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Upload button */}
              <label
                id="btn-upload-gambar"
                className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-md cursor-pointer transition text-center text-white"
              >
                {uploadedFiles.length > 0 ? "Ganti Gambar" : "Upload Gambar"}
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  max="5"
                />
              </label>
              <p className="text-xs text-center text-white">
                {" "}
                *Maksimal 5 foto, ukuran 2MB per file{" "}
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="font-bold">Peta Lokasi</h3>
              <div id="section-peta" className="flex flex-col gap-4">
                <PetaDragable
                  initialPosition={mapPosition}
                  onPositionChange={setMapPosition}
                  zoom={16}
                  height="240px"
                  isDraggable={isDraggable}
                />
              </div>
            </div>
          </div>

          {/* Form Utama */}
          <div className="flex-1 bg-blue-500 text-white p-6 rounded-xl">
            <h2 className="text-xl font-bold text-center mb-6">Jual Rumah</h2>
            <form className="space-y-6">
              <div>
                <label className="block text-sm mb-1">
                  Nama Rumah/Apartemen
                </label>
                <input
                  id="input-nama-rumah"
                  type="text"
                  className="w-full p-2 rounded bg-white text-black"
                  placeholder="Contoh: Green Garden Apartment"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">Nama Pemilik</label>
                  <input
                    id="input-nama-pemilik"
                    type="text"
                    className="w-full p-2 rounded bg-white text-black"
                    placeholder="Contoh: Budi Santoso"
                  />
                </div>
                <div className="relative">
                  <label className="block text-sm mb-1">Kategori Pemilik</label>
                  <div
                    id="select-kategori-pemilik"
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
                  {showArrowUp["Kategori Pemilik"] && (
                    <ul className="absolute z-10 mt-1 w-full bg-white border rounded shadow max-h-40 overflow-y-auto">
                      {contactTypes.map((item, i) => (
                        <li
                          key={i}
                          className="p-2 text-gray-800 hover:bg-blue-100 hover:text-white cursor-pointer transition-colors"
                          onClick={() => {
                            setKategoriPemilik(item.name);
                            toggleArrow("Kategori Pemilik");
                          }}
                        >
                          {item.name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm mb-1">Harga</label>
                <input
                  id="input-harga"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className="w-full p-2 rounded bg-white text-black"
                  placeholder="Contoh: 1500000000"
                  value={harga}
                  onChange={handleHargaChange}
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Nomor Telepon</label>
                <input
                  id="input-telepon"
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className="w-full p-2 rounded bg-white text-black"
                  placeholder="Contoh: +6281234567890 selain kode negara gabisa"
                  value={nomorTelepon}
                  onChange={handlePhoneChange}
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Lokasi Rumah</label>
                <input
                  id="input-alamat"
                  type="text"
                  className="w-full p-2 rounded bg-white text-black"
                  placeholder="Contoh: Jl. Sudirman No. 123, Jakarta Selatan"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    label: "Provinsi",
                    id: "select-provinsi",
                    list: provinsiList,
                    value: selectedProvinsi,
                    handler: handleProvinsiSelect,
                  },
                  {
                    label: "Kota/Kabupaten",
                    id: "select-kota",
                    list: kotaList,
                    value: selectedKota,
                    handler: handleKotaSelect,
                  },
                  {
                    label: "Kecamatan",
                    id: "select-kecamatan",
                    list: kecamatanList,
                    value: selectedKecamatan,
                    handler: handleKecamatanSelect,
                  },
                  {
                    label: "Kelurahan",
                    id: "select-kelurahan",
                    list: kelurahanList,
                    value: selectedKelurahan,
                    handler: handleKelurahanSelect,
                  },
                ].map(({ label, id, list, value, handler }) => (
                  <div key={label} className="relative" id={id}>
                    <label className="block text-sm mb-1">{label}</label>
                    <div
                      className="relative w-full p-2 rounded bg-white text-black cursor-pointer flex justify-between items-center"
                      onClick={() => toggleArrow(label)}
                    >
                      <span>{value || `Pilih ${label}`}</span>
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
                    {showArrowUp[label] && (
                      <ul className="absolute z-10 mt-1 w-full bg-white border rounded shadow max-h-40 overflow-y-auto">
                        {list.map((item, i) => (
                          <li
                            key={i}
                            className="p-2 text-gray-800 hover:bg-blue-100 hover:text-white cursor-pointer transition-colors"
                            onClick={() => handler(item)}
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>

              <div>
                <h3 className="font-semibold mb-2">Kepemilikan</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="relative">
                    <label className="block text-sm mb-1">Dokumen</label>
                    <div
                      id="select-dokumen"
                      className="relative w-full p-2 rounded bg-white text-black cursor-pointer flex justify-between items-center"
                      onClick={() => toggleArrow("Dokumen")}
                    >
                      <span>{dokumenProperti || "Pilih Dokumen"}</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-5 w-5 transition-transform ${showArrowUp["Dokumen"] ? "rotate-180" : ""
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
                    {showArrowUp["Dokumen"] && (
                      <ul className="absolute z-10 mt-1 w-full bg-white border rounded shadow max-h-40 overflow-y-auto">
                        {documentList.map((item, i) => (
                          <li
                            key={i}
                            className="p-2 text-gray-800 hover:bg-blue-100 hover:text-white cursor-pointer transition-colors"
                            onClick={() => {
                              setDokumenProperti(item.name);
                              toggleArrow("Dokumen");
                            }}
                          >
                            {item.name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="relative">
                    <label className="block text-sm mb-1">
                      Klasifikasi Bangunan
                    </label>
                    <div
                      id="select-klasifikasi-bangunan"
                      className="relative w-full p-2 rounded bg-white text-black cursor-pointer flex justify-between items-center"
                      onClick={() => toggleArrow("Klasifikasi Bangunan")}
                    >
                      <span>{klasifikasiBangunan || "Pilih Klasifikasi"}</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-5 w-5 transition-transform ${showArrowUp["Klasifikasi Bangunan"]
                          ? "rotate-180"
                          : ""
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
                    {showArrowUp["Klasifikasi Bangunan"] && (
                      <ul className="absolute z-10 mt-1 w-full bg-white border rounded shadow max-h-40 overflow-y-auto">
                        {classBuildingList.map((item, i) => (
                          <li
                            key={i}
                            className="p-2 text-gray-800 hover:bg-blue-100 hover:text-white cursor-pointer transition-colors"
                            onClick={() => {
                              setKlasifikasiBangunan(item.name);
                              toggleArrow("Klasifikasi Bangunan");
                            }}
                          >
                            {item.name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="relative">
                    <label className="block text-sm mb-1">Kategori Lahan</label>
                    <div
                      id="select-kategori-lahan"
                      className="relative w-full p-2 rounded bg-white text-black cursor-pointer flex justify-between items-center"
                      onClick={() => toggleArrow("Kategori Lahan")}
                    >
                      <span>{kategoriLahan || "Pilih Kategori Lahan"}</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-5 w-5 transition-transform ${showArrowUp["Kategori Lahan"] ? "rotate-180" : ""
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
                    {showArrowUp["Kategori Lahan"] && (
                      <ul className="absolute z-10 mt-1 w-full bg-white border rounded shadow max-h-40 overflow-y-auto">
                        {conditionFieldList.map((item, i) => (
                          <li
                            key={i}
                            className="p-2 text-gray-800 hover:bg-blue-100 hover:text-white cursor-pointer transition-colors"
                            onClick={() => {
                              setKategoriLahan(item.name);
                              toggleArrow("Kategori Lahan");
                            }}
                          >
                            {item.name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="relative">
                    <label className="block text-sm mb-1">Peruntukan</label>
                    <div
                      id="select-peruntukan"
                      className="relative w-full p-2 rounded bg-white text-black cursor-pointer flex justify-between items-center"
                      onClick={() => toggleArrow("Peruntukan")}
                    >
                      <span>{peruntukan || "Pilih Peruntukan"}</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-5 w-5 transition-transform ${showArrowUp["Peruntukan"] ? "rotate-180" : ""
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
                    {showArrowUp["Peruntukan"] && (
                      <ul className="absolute z-10 mt-1 w-full bg-white border rounded shadow max-h-40 overflow-y-auto">
                        {allotmentList.map((item, i) => (
                          <li
                            key={i}
                            className="p-2 text-gray-800 hover:bg-blue-100 hover:text-white cursor-pointer transition-colors"
                            onClick={() => {
                              setPeruntukan(item.name);
                              toggleArrow("Peruntukan");
                            }}
                          >
                            {item.name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Detail</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {shouldShowLuasTanah() && (
                    <div className="relative">
                      <label className="block text-sm mb-1">Luas Tanah</label>
                      <input
                        id="input-luas-tanah"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        className="w-full p-2 rounded bg-white text-black"
                        placeholder="Contoh: 120"
                        value={luasTanah}
                        onChange={(e) => handleNumericInput(e, setLuasTanah)}
                      />
                    </div>
                  )}

                  {shouldShowLuasBangunan() && (
                    <div className="relative">
                      <label className="block text-sm mb-1">
                        Luas Bangunan
                      </label>
                      <input
                        id="input-luas-bangunan"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        className="w-full p-2 rounded bg-white text-black"
                        placeholder="Contoh: 80"
                        value={luasBangunan}
                        onChange={(e) => handleNumericInput(e, setLuasBangunan)}
                      />
                    </div>
                  )}

                  {shouldShowTotalLantai() && (
                    <div className="relative">
                      <label className="block text-sm mb-1">Total Lantai</label>
                      <input
                        id="input-total-lantai"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        className="w-full p-2 rounded bg-white text-black"
                        placeholder="Contoh: 2"
                        value={totalLantai}
                        onChange={(e) => handleNumericInput(e, setTotalLantai)}
                      />
                    </div>
                  )}

                  <div className="relative">
                    <label className="block text-sm mb-1">
                      Status Transaksi
                    </label>
                    <div
                      id="select-status-transaksi"
                      className="relative w-full p-2 rounded bg-white text-black cursor-pointer flex justify-between items-center"
                      onClick={() => toggleArrow("Status Transaksi")}
                    >
                      <span>{statusTransaksi || "Pilih Status Transaksi"}</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-5 w-5 transition-transform ${showArrowUp["Status Transaksi"] ? "rotate-180" : ""
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
                    {showArrowUp["Status Transaksi"] && (
                      <ul className="absolute z-10 mt-1 w-full bg-white border rounded shadow max-h-40 overflow-y-auto">
                        {statusDataList.map((item, i) => (
                          <li
                            key={i}
                            className="p-2 text-gray-800 hover:bg-blue-100 hover:text-white cursor-pointer transition-colors"
                            onClick={() => {
                              setStatusTransaksi(item.name);
                              toggleArrow("Status Transaksi");
                            }}
                          >
                            {item.name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    label: "Kategori Asset",
                    id: "select-kategori-aset",
                    list: assetCategoryList,
                    state: kategoriAset,
                    setter: setKategoriAset,
                  },
                  {
                    label: "Tipe Asset",
                    id: "select-tipe-aset",
                    list: assetTypeList,
                    state: tipeAset,
                    setter: setTipeAset,
                  },
                  {
                    label: "Kondisi Bangunan",
                    id: "select-kondisi-bangunan",
                    list: conditionBuildingList,
                    state: kondisiBangunan,
                    setter: setKondisiBangunan,
                  },
                  {
                    label: "Klasifikasi Jalan",
                    id: "select-klasifikasi-jalan",
                    list: classRoadList,
                    state: klasifikasiJalan,
                    setter: setKlasifikasiJalan,
                  },
                ].map(({ label, id, list, state, setter }) => (
                  <div key={label} className="relative" id={id}>
                    <label className="block text-sm mb-1">{label}</label>
                    <div
                      className="relative w-full p-2 rounded bg-white text-black cursor-pointer flex justify-between items-center"
                      onClick={() => toggleArrow(label)}
                    >
                      <span>{state || `Pilih ${label}`}</span>
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
                    {showArrowUp[label] && (
                      <ul className="absolute z-10 mt-1 w-full bg-white border rounded shadow max-h-40 overflow-y-auto">
                        {list.map((item, i) => (
                          <li
                            key={i}
                            className="p-2 text-gray-800 hover:bg-blue-100 hover:text-white cursor-pointer transition-colors"
                            onClick={() => {
                              setter(item.name);
                              toggleArrow(label);
                            }}
                          >
                            {item.name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    label: "Jalur Lalu Lintas",
                    id: "select-jalur-lalu-lintas",
                    list: trafficVolumeList,
                    state: jalurLaluLintas,
                    setter: setJalurLaluLintas,
                  },
                  {
                    label: "Potensi Banjir",
                    id: "select-potensi-banjir",
                    list: floodingList,
                    state: potensiBanjir,
                    setter: setPotensiBanjir,
                  },
                  {
                    label: "Tingkat Hunian Bangunan",
                    id: "select-tingkat-hunian",
                    list: occupancyList,
                    state: tingkatHunian,
                    setter: setTingkatHunian,
                  },
                ].map(({ label, id, list, state, setter }) => (
                  <div key={label} className="relative" id={id}>
                    <label className="block text-sm mb-1">{label}</label>
                    <div
                      className="relative w-full p-2 rounded bg-white text-black cursor-pointer flex justify-between items-center"
                      onClick={() => toggleArrow(label)}
                    >
                      <span>{state || `Pilih ${label}`}</span>
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
                    {showArrowUp[label] && (
                      <ul className="absolute z-10 mt-1 w-full bg-white border rounded shadow max-h-40 overflow-y-auto">
                        {list.map((item, i) => (
                          <li
                            key={i}
                            className="p-2 text-gray-800 hover:bg-blue-100 hover:text-white cursor-pointer transition-colors"
                            onClick={() => {
                              setter(item.name);
                              toggleArrow(label);
                            }}
                          >
                            {item.name}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
                <div>
                  <label className="block text-sm mb-1">Discount (%)</label>
                  <input
                    id="input-diskon"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    className="w-full p-2 rounded bg-white text-black"
                    placeholder="Contoh: 10"
                    value={discount}
                    onChange={(e) => handleNumericInput(e, setDiscount)}
                  />
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-blue-400">
                <p className="text-xs italic mb-2">
                  *Cek Ulang Sebelum Klik Verifikasi Data
                </p>
                <button
                  id="btn-verifikasi"
                  type="button"
                  onClick={handleSubmit}
                  className="w-full bg-green-500 hover:bg-green-600 py-2 rounded-lg font-semibold transition"
                >
                  Verifikasi Data
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default JualRumah;
