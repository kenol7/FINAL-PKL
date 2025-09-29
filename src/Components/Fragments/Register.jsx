import React, { useState } from 'react';
import Input from "../Elements/Input";
import Button from "../Elements/Button";
import { useNavigate } from 'react-router-dom';
import API from "../../Config/Endpoint";


const Register = () => {
    const navigate = useNavigate();

    const [isChecked, setIsChecked] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [showPopuptrue, setShowuptrue] = useState(false)

    const endPoint = API.endpointregist

    const [namaLengkap, setNamaLengkap] = useState('')
    const [email, setEmail] = useState('')
    const [nomorTelepon, setNomorTelepon] = useState('')
    const [kataSandi, setKataSandi] = useState('')
    

    const handleNamaLengkapChange = (newValue) => {
        setNamaLengkap(newValue)
    };
    const handleEmailChange = (newValue) => {
        setEmail(newValue)
    };
    const handleNomorTeleponChange = (newValue) => {
        const numericValue = newValue.replace(/[^0-9]/g, '');
        if (numericValue === '') {
            setNomorTelepon('');
            return;
        }

        let correctedValue = numericValue;
        if (correctedValue.length === 1 && correctedValue.startsWith('8')) {
            correctedValue = '0' + correctedValue;
        }

        if (correctedValue.startsWith('08')) {
            const limitedValue = correctedValue.slice(0, 13);
            setNomorTelepon(limitedValue);
        }
    };
    const handleKataSandiChange = (newValue) => {
        setKataSandi(newValue)
    };


    const handleSubmit = (event) => {
        event.preventDefault();
        if (!isChecked) {
            alert("Anda harus menyetujui Syarat & Ketentuan (S&K).");
            return;
        }
        setShowPopup(true);
    };


    function confirmSubmit() {
        setShowPopup(false);

        let payload = {
            name: namaLengkap,
            email: email,
            phone: nomorTelepon,
            password: kataSandi,
            mode: 'POST',
            action: 'register'
        };

            fetch(endPoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })
                .then(res => res.json())
                .then(response => {
                    console.log(response)
                   if (response.status === "success") {
                            navigate("/verifikasikode/"+ response.kode + "/" + response.name + "/" +response.email);
                        } else {
                            alert(response.message || 'Pendaftaran gagal. Periksa kembali data Anda.');
                        }
                    })
            .catch(error => {
                console.error("Error saat fetch:", error);
                alert("Terjadi kesalahan pada jaringan. Silakan coba lagi.");
            });
    }
    return (
        <>
            <form
                className={`w-full flex flex-col items-center gap-6 transition-all duration-200 ${showPopup, showPopuptrue ? "blur-sm" : ""}`}
                method='POST'
                onSubmit={handleSubmit}

            >
                <div className="mt-10 flex flex-col gap-5 ml-5 ">
                    <div>
                        <label className="font-jakarta text-xs">Nama lengkap</label>
                        <Input
                            type="text"
                            name="nama_lengkap"
                            value={namaLengkap}
                            className="font-jakarta text-xs text-black"
                            onChange={handleNamaLengkapChange}
                        />
                    </div>

                    <div>
                        <label className="font-jakarta text-xs">Email</label>
                        <Input
                            type="email"
                            name="email"
                            value={email}
                            className="font-jakarta text-xs text-black"
                            //value={data.email}
                            onChange={handleEmailChange}
                        />
                    </div>

                    <div>
                        <label className="font-jakarta text-xs">No Telepon</label>
                        <Input
                            type="text"
                            inputMode="numeric"
                            name="nomer_telepon"
                            value={nomorTelepon}
                            className="font-jakarta text-xs text-black"
                            maxLength="15"
                            //value={data.nomer_telepon}
                            onChange={handleNomorTeleponChange}
                        />
                    </div>

                    <div>
                        <label className="font-jakarta text-xs">Kata Sandi</label>
                        <div className="relative w-full">
                            <Input
                                type={showPassword ? "text" : "password"}
                                name="kata_sandi"
                                value={kataSandi}
                                className="w-full h-[29px] rounded-full border border-[#F4D77B] px-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#2067C5] bg-white"
                                //value={data.kata_sandi}
                                onChange={handleKataSandiChange}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute top-1/2 right-0 -translate-y-1/2 h-full px-3 flex items-center"
                            >
                                <img
                                    src="/Component 2.png"
                                    alt="show/hide password"
                                    className="w-4 h-4 mt-1"
                                />
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 w-full mt-2">
                        <input
                            type="checkbox"
                            id="sk-checkbox"
                            name="sk"
                            className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500"
                            checked={isChecked}
                            onChange={() => setIsChecked(!isChecked)}
                        />
                        <span
                            className="text-xs font-jakarta underline cursor-pointer"
                            onClick={() => navigate("/syaratdanketentuan")}
                        >
                            S&K
                        </span>
                    </div>

                    <Button type="submit" className="w-[114px] mt-4 mx-auto ">
                        Daftar
                    </Button>
                </div>

            </form>

            {showPopup && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div
                        className="bg-[#EBEDF0] w-[533px] h-[186px] rounded-[20px] shadow-lg flex flex-col items-center px-8 pt-5 pb-8 relative animate-[popup_0.2s_ease-out]"
                    >
                        <h1 className="font-jakarta text-base text-center">
                            Apakah kamu sudah yakin <br /> untuk mendaftar akun?
                        </h1>

                        <div className="flex gap-[73px] mt-[50px]">
                            <Button onClick={() => setShowPopup(false)}>Tidak</Button>
                            <Button onClick={() => setShowuptrue(true)}>Iya</Button>
                        </div>
                    </div>
                </div>
            )}


            {showPopuptrue && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div
                        className="bg-[#EBEDF0] w-[533px] h-[186px] rounded-[20px] shadow-lg flex flex-col items-center px-8 pt-5 pb-8 relative animate-[popup_0.2s_ease-out]"
                    >
                        <h1 className="font-jakarta text-base text-center">
                            “Selamat! Akun anda sudah berhasil dibuat nih. <br />
                            Silahkan kembali masuk untuk menggunakan <br />
                            layanan kami”
                        </h1>

                        <div className="flex gap-[73px] mt-[24px]">
                            <Button onClick={() => {
                                setShowuptrue(false);
                                setShowPopup(false);
                                confirmSubmit();
                            }}>Iya</Button>
                        </div>
                    </div>
                </div >

            )}

        </>
    );
};

export default Register;
