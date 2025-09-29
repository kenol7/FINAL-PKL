import React, { useRef, useEffect, useState } from "react";
import axios from "axios"; //pake axios aja ya dik :)
import "keen-slider/keen-slider.min.css";
import KeenSlider from "keen-slider";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { EffectCoverflow, Navigation } from "swiper/modules";
import Search from "../Components/Elements/Search";
import { Button } from "@radix-ui/themes";
import Frame from "../assets/frame.png";
import ArrowLeft from "../assets/arrow-left.png";
import ArrowRight from "../assets/arrow-right.png";
import Location from "../assets/locat.png";
import Navbar from "../Components/Elements/Navbar";
import Footer from "../Components/Elements/Footer";
import Frame1 from "../assets/frame1.png";
import Frame2 from "../assets/frame2.png";
import Frame3 from "../assets/frame3.png";
import { Pointer } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {Link} from "react-router-dom";

const FrameData = [
  { id: 1, url: Frame1, duration: 5, alt: "Frame 1" },
  { id: 2, url: Frame2, duration: 5, alt: "Frame 2," },
  { id: 3, url: Frame3, duration: 5, alt: "Frame 3," },
];

export default function Home() {
  const [rumahTerdekat, setrumahTerdekat] = useState([]);
  const [slider, setSlider] = useState(null);
  const [sliderTerdekat, setSliderTerdekat] = useState(null);
  const [sliderFitur, setSliderFitur] = useState(null);
  const sliderRef = useRef(null);
  const sliderTerdekatRef = useRef(null);
  const sliderFiturRef = useRef(null);
  const [slidesPerView, setSlidesPerView] = useState(5); // Menampilkan 3 slide per tampilan
  const swiperContainerRef = useRef(null);
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [province, setProvince] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [city, setCity] = useState(null);
  const [nama_lengkap, setNama_lengkap] = useState("");
  const KeyMaps = "AIzaSyDtRAmlhx3Ada5pVl5ilzeHP67TLxO6pyo";
  const navigate = useNavigate();

  let ApiContribution =
    "https://smataco.my.id/dev/unez/CariRumahAja/routes/contribution.php?mode=nearby&latitude=-6.208763&longitude=106.845599";
  //?latitude=-6.3474679&longitude=106.8246569&page=1

  const endpointImage =
    "https://smataco.my.id/dev/unez/CariRumahAja/foto/rumah.jpg";

  const handledetail = (ref_id) => {
    navigate("/detailrumah/" + ref_id);
  };

  const GetData = async (lat, lng) => {
    await fetch(
      ApiContribution + "?latitude=" + lat + "&longitude=" + lng + "&page=1"
    )
      .then((res) => res.json())
      .then((response) => {
        console.log(response);
        setrumahTerdekat(response);
        // console.log(rumahTerdekat.length);
      });
  };
  const textLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        // setLatitude(position.coords.latitude);
        // setLongitude(position.coords.longitude);
        fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},${position.coords.longitude}&key=${KeyMaps}`
        )
          .then((res) => res.json())
          .then((response) => {
            console.log(response);
            console.log("alamat=" + response.results[0].formatted_address);
            const city = response.results[0].address_components.find(
              (component) =>
                component.types[0].includes("administrative_area_level_2")
            ).long_name;
            setCity(city);
          });
        // //Get Data Rumah
        GetData(position.coords.latitude, position.coords.longitude);
      });

      // await
    } else {
      console.log("Browser anda tidak supprt Geolocation");
    }
    // const filteredRumahDekat = rumahdekat.filter(
    //   (item) => item.latitude === latitude && item.longitude === longitude
    // );
  };
  useEffect(() => {
    setNama_lengkap(localStorage.getItem("auth_fullname"));
    textLocation();
  }, []);

  useEffect(() => {
    const updateSlidesPerView = () => {
      const width = window.innerWidth;

      if (width < 768) {
        setSlidesPerView(1);
      } else if (width >= 768 && width < 1024) {
        setSlidesPerView(2);
      } else {
        setSlidesPerView(3);
      }
    };

    updateSlidesPerView();
    window.addEventListener("resize", updateSlidesPerView);

    return () => window.removeEventListener("resize", updateSlidesPerView);
  }, []);

  useEffect(() => {
    const newSlider = new KeenSlider(sliderRef.current, {
      loop: true,
      slidesPerView: 1,
      spacing: 10,
      centered: true,
    });
    setSlider(newSlider);

    const interval = setInterval(() => {
      newSlider.next();
    }, 5000);

    return () => {
      clearInterval(interval);
      newSlider.destroy();
    };
  }, []);

  useEffect(() => {
    const newSliderFitur = new KeenSlider(sliderFiturRef.current, {
      mode: "free-snap",
      slides: {
        origin: "center",
        preView: 2,
        spacing: 15,
      },
    });
    setSliderFitur(newSliderFitur);

    return () => newSliderFitur.destroy();
  }, []);

  console.log(rumahTerdekat.error);
  return (
    <>
      <Navbar />
      <div>
        {/* iklan */}
        <div className="relative my-10">
          <Search />
          <div className="keen-slider mt-8" ref={sliderRef}>
            {FrameData.map((frame) => (
              <div key={frame.id} className="keen-slider__slide">
                <img
                  src={frame.url}
                  alt={frame.alt}
                  className="w-full h-[500px]"
                />
              </div>
            ))}
          </div>
          {slider && (
            <div className="flex items-center">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-between w-full px-4">
                <Button onClick={() => slider.prev()} variant="ghost">
                  <img src={ArrowLeft} width="30px" height="30px" />
                </Button>
                <Button onClick={() => slider.next()} variant="ghost">
                  <img src={ArrowRight} width="30px" height="30px" />
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-30 mx-10">
          <div className="flex justify-between items-center">
            <div className="w-1 h-1 md:block hidden" />
            <div className="">
              <h3 className="font-semibold xl:text-2xl lg:text-2xl md:text-2xl text-lg">
                Rumah Terdekat {nama_lengkap}
              </h3>
              <h3 className="flex xl:justify-center lg:justify-center md:justify-center justify-normal gap-1">
                {city}
                <span>
                  <img src={Location} width="25px" height="25px" />
                </span>
                {/* {rumahTerdekat.city} */}
                {province}
              </h3>
            </div>
            <div>
              <a
                href=""
                className="bg-yellow-200 px-5 py-1.5 rounded-lg shadow-md"
              >
                Lihat Semua
              </a>
            </div>
          </div>
          <div className="flex justify-center mt-20">
            {rumahTerdekat.error ? (
              <p className="text-gray-600 md:text-2xl text-lg text-center">
                Tidak ada rumah ditemukan di wilayah Anda.
              </p>
            ) : (
              <Swiper
                effect="coverflow"
                grabCursor={true}
                centeredSlides={true}
                loop={true}
                slidesPerView={slidesPerView}
                coverflowEffect={{
                  rotate: 0,
                  stretch: 0,
                  depth: 100,
                  modifier: 2.5,
                  slideShadows: false,
                }}
                modules={[EffectCoverflow, Navigation]}
                className="swiper_container"
                ref={swiperContainerRef}
              >
                {rumahTerdekat.map((item, index) => (
                  <SwiperSlide
                    key={index}
                    onClick={() => handledetail(item.ref_id)}
                    style={{ cursor: Pointer }}
                  >
                    <div className="xl:w-[468px] lg:w-[400px] md:w-[400px] h-auto rounded-xl relative overflow-hidden shadow-lg">
                      <h3 className="text-xs font-extrabold top-3 right-3 absolute bg-[#E5E7EB] px-2 py-1 rounded-full border-2 border-[#D4AF37]">
                        {" "}
                        {item.ref_id}
                      </h3>
                      <img
                        src={endpointImage}
                        alt={item.cluster_apart_name}
                        className="w-full bg-gray-300 h-[200px] object-cover"
                        loading="lazy"
                      />
                      <div className="flex bg-gray-100 items-center justify-between p-2.5 gap-2.5">
                        <div>
                          <h3 className="xl:text-xl lg:text-xl md:text-xl text-md font-semibold text-gray-800">
                            {item.cluster_apart_name}
                          </h3>
                          <p className="text-gray-700 xl:text-base lg:text-base md:text-base text-sm">
                            {item.city}
                          </p>
                          <p className="xl:text-sm lg:text-sm md:text-sm text-xs text-gray-400 mt-2">
                            LB {item.square_building} | LT {item.square_land} |
                            L {item.property_floor}
                          </p>
                        </div>
                        <div>
                          <h3 className="text-gray-800 rounded-lg font-semibold xl:text-lg lg:text-lg md:text-lg text-base bg-yellow-400 xl:px-8 lg:px-8 md:px-8 px-2 py-1.5">
                            {`Rp${
                              item.property_price
                                ? new Intl.NumberFormat("id-ID").format(
                                    item.property_price
                                  )
                                : "N/A"
                            }
                          `}
                          </h3>
                          <h3 className="text-gray-700 xl:text-sm lg:text-sm md:text-sm text-xs text-end">
                            Transaksi
                          </h3>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>
        </div>

        <div className="mt-30 mx-10 md:block hidden">
          <div className="flex justify-center xl:gap-14 lg:gap-8 md:gap-2 gap-2">
            <div>
              <div className="bg-gray-300 xl:w-[486px] lg:w-[386px] w-[286px] xl:h-[409px] lg:h-[309px] h-[209px] rounded-2xl" />
            </div>
            <div className="flex justify-center items-center text-center">
              <div className="xl:space-y-20 space-y-8">
                <h3 className="xl:text-3xl lg:text-3xl text-xl xl:w-[600px] w-auto">
                  Mau cari rekomendasi rumah yang cepat sesuai konsepmu?
                </h3>
                <Link
                  to="/chatbot"
                  className="bg-blue-400 font-medium px-20 py-2.5 rounded-xl shadow-md cursor-pointer"
                >
                  CHATBOT
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="my-30 mx-10 md:block hidden">
          <div className="flex justify-center xl:gap-14 lg:gap-8 md:gap-2 gap-2">
            <div className="flex justify-center items-center text-center">
              <div className="xl:space-y-20 space-y-8">
                <h3 className="xl:text-3xl lg:text-3xl text-xl xl:w-[600px] w-auto">
                  Mau hitung KPR rumah yang cepat dan sesuai?
                </h3>
                <Link
                  to="/kpr"
                  className="bg-blue-400 font-medium px-20 py-2.5 rounded-xl shadow-md cursor-pointer"
                >
                  KALKULATOR KPR
                </Link>
              </div>
            </div>
            <div>
              <div className="bg-gray-300 xl:w-[486px] lg:w-[386px] w-[286px] xl:h-[409px] lg:h-[309px] h-[209px] rounded-2xl" />
            </div>
          </div>
        </div>

        {/* Mobile */}
        <div className="md:hidden block mx-5">
          <div className="keen-slider my-10" ref={sliderFiturRef}>
            <div className="keen-slider__slide flex flex-col md:flex-row justify-center items-center gap-8 bg-white p-5 rounded-2xl shadow-lg">
              <div className="bg-gray-300 w-full h-[209px] rounded-2xl" />
              <div className="flex justify-center items-center text-center w-full md:w-auto">
                <div className="space-y-5 mb-2">
                  <h3 className="text-xl">
                    Mau cari rekomendasi rumah yang cepat sesuai konsepmu?
                  </h3>
                  <Link
                    to="/chatbot"
                    className="bg-blue-400 font-medium px-12 py-3 md:px-20 md:py-2.5 rounded-xl shadow-md cursor-pointer"
                  >
                    CHATBOT
                  </Link>
                </div>
              </div>
            </div>
            <div className="keen-slider__slide flex flex-col md:flex-row justify-center items-center gap-8 bg-white p-5 rounded-2xl shadow-lg">
              <div className="bg-gray-300 w-full h-[209px] rounded-2xl" />
              <div className="flex justify-center items-center text-center w-full md:w-auto">
                <div className="space-y-5 mb-2">
                  <h3 className="text-xl">
                    Mau hitung KPR rumah yang cepat dan sesuai?
                  </h3>
                  <Link
                    to="/kpr"
                    className="bg-blue-400 font-medium px-12 py-3 md:px-20 md:py-2.5 rounded-xl shadow-md cursor-pointer"
                  >
                    KALKULATOR KPR
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
