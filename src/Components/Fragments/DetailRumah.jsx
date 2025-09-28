import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../Config/Endpoint";


const DetailRumah = () => {

    // const {searchParams} = useSearchParams();
    // const ref_idvalue = searchParams.get('ref_id');
    // const {ref_id} = useParams();
    const [favorit, setFavorit] = useState(false);
    const navigate = useNavigate()

    const [detail, setDetail] = useState([])
    let paramRefId = ''


    // const GetParams = () => {


    // }
    useEffect(() => {
        const path = window.location.pathname;
        const segments = path.split('/');
        paramRefId = segments[2];
        fetch(API.endpointDetail + '&ref_id=' + paramRefId)
            .then(res => res.json())
            .then(response => {
                setDetail(response)
            })
    }, [])
    return (
        <>
            <div className="grid grid-cols-2 gap-[33px] pr-[80px] pl-[80px]">
                {detail.map(item => (
                    <div className="mt-[19px] mb-[96px]">
                        <div className="flex items-center justify-between w-full font-jakarta text-xs">
                            <button className="px-3 p-3 h-8 rounded-md bg-[#F4D77B] hover:bg-[#E7C555] transition flex items-center justify-center mr-4 " onClick={() => navigate("/")}>
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
                            <div className="rounded-xl border-[#E7C555] bg-white px-3 border-2">
                                {item.ref_id}
                            </div>
                        </div>

                        <div className="mt-[21px] flex items-center justify-between w-full ">
                            <div className="font-jakarta">
                                <h1 className="text-2xl font-bold">{item.cluster_apart_name}</h1>
                                <h3 className="text-sm">{item.city}</h3>
                            </div>
                            <div>
                                <div className="bg-[#E7C555] rounded-2xl w-[244px] h-[45px] flex items-center justify-center text-center text-2xl text-semibold ">
                                    Rp{" "}
                                    {item.property_price
                                        ? new Intl.NumberFormat("id-ID").format(
                                            item.property_price.slice(0, -2)
                                        )
                                        : "N/A"}
                                </div>
                            </div>
                        </div>


                        <div className="flex items-center justify-between mt-[21px] rounded-lg py-2">
                            <div className="flex items-center gap-4 text-sm font-jakarta">
                                <div className="flex flex-col text-center">
                                    <span className="font-semibold text-xl">{item.square_land}m²</span>
                                    <span className="text-gray-600 text-xs">L.Tanah</span>
                                </div>
                                <div className="border-l h-6"></div>
                                <div className="flex flex-col text-center">
                                    <span className="font-semibold text-xl">{item.square_building}m²</span>
                                    <span className="text-gray-600 text-xs">L.Bangunan</span>
                                </div>
                                <div className="border-l h-6"></div>
                                <div className="flex flex-col text-center">
                                    <span className="font-semibold text-xl">{item.property_floor}</span>
                                    <span className="text-gray-600 text-xs">Lantai</span>
                                </div>
                                <div className="border-l h-6"></div>
                                <div className="flex flex-col text-center">
                                    <span className="font-semibold text-xl">Transaksi</span>
                                    <span className="text-gray-600 text-xs">Status Data</span>
                                </div>
                            </div>
                            <button
                                onClick={() => setFavorit(!favorit)}
                                className="flex flex-col items-center focus:outline-none"
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
                                <span className="text-xs text-gray-600">Favorit</span>
                            </button>
                        </div>
                        <div className="mt-[21px]">
                            <h1 className="font-semibold text-2xl">Lokasi</h1>
                            <p>{item.address}</p>
                        </div>
                        <div className="mt-[21px]">
                            <h1 className="font-semibold text-2xl">Kepemilikan</h1>
                            <p>
                                Dhika <br />
                                Menengah grade 2 <br />
                                Matang - Nonredidensial <br />
                                Residensial <br />
                                SHM
                            </p>
                        </div>
                        <div className="mt-[21px]">
                            <h1 className="font-semibold text-2xl">Detail</h1>
                            <p>
                                Tanah & Bangunan <br />
                                Rumah Tinggal<br />
                                Sedang Terawat<br />
                                Lingkungan<br />
                                Ketahanan Bangunan 50% - 75%<br />
                                Lalu Lintas Sedang<br />
                                Bebas Banjir
                            </p>
                        </div>
                        <div className="flex items-center justify-between w-full mt-[21px]">
                            <div className="font-jakarta text-sm">
                                <p>
                                    Anda berminat untuk mengambil rumah ini? <br />
                                    klik kontak di samping untuk melakukan <br />
                                    pembeliannya.
                                </p>
                            </div>
                            <div>
                                <button className="w-[171px] p-3 h-[37px] rounded-xl bg-[#F4D77B] hover:bg-[#E7C555] transition flex items-center justify-center mr-4 gap-2 ">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
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

                    </div>
                ))}

                <div className="w-full h-[606px] overflow-hidden bg-gray-200 rounded-lg shadow-md mt-[19px] mb-[96px]">
                    <div className="flex items-center justify-center bg-gray-200 h-full">
                        <img src="/src/assets/profile.jpg" alt="fotorumah" />
                    </div>
                </div>
            </div>
        </>
    )
}

export default DetailRumah;
