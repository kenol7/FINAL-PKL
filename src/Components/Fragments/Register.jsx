import React, { useState, useEffect } from 'react';
import Input from "../Elements/Input";
import Button from "../Elements/Button";
import { useNavigate } from 'react-router-dom';
import API from "../../Config/Endpoint";
import { SKLayout } from '../Layouts/LayoutUtama';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

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

    const bgColor = type === "error" ? "bg-red-100 border-red-500 text-red-700" : "bg-green-100 border-green-500 text-green-700";

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

const Register = ({ onRegisterSuccess, close }) => {
    const navigate = useNavigate();

    const [isChecked, setIsChecked] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [showPopuptrue, setShowuptrue] = useState(false);

    const endPoint = API.endpointregist;

    const [namaLengkap, setNamaLengkap] = useState('');
    const [email, setEmail] = useState('');
    const [nomorTelepon, setNomorTelepon] = useState('');
    const [kataSandi, setKataSandi] = useState('');

    // State untuk toast
    const [toast, setToast] = useState({ message: "", type: "error", visible: false });

    const [nomorTeleponE164, setNomorTeleponE164] = useState("");

    const showToast = (message, type = "error") => {
        setToast({ message, type, visible: true });
    };

    const hideToast = () => {
        setToast((prev) => ({ ...prev, visible: false }));
    };

    const [showSK, setShowSK] = useState(false);

    const handleNamaLengkapChange = (e) => {
        const newValue = e.target.value;
        if (typeof newValue !== 'string') {
            setNamaLengkap('');
            return;
        }

        let sanitized = newValue.replace(/[^a-zA-Z\s.\-'’]/g, '');
        sanitized = sanitized.trimStart();
        if (sanitized.trim() === '') {
            setNamaLengkap('');
        } else {
            setNamaLengkap(sanitized);
        }
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const [normalizedPhone, setNormalizedPhone] = useState('');

    const handleNomorTeleponChange = (e) => {
        const rawInput = e.target.value;
        setNomorTelepon(rawInput);

        let normalized = null;
        try {
            const phoneNumber = parsePhoneNumberFromString(rawInput, 'ID');
            if (phoneNumber && phoneNumber.isValid()) {
                normalized = phoneNumber.format('E.164');
            }
        } catch (err) {
            console.error("Error parsing phone number:", err);
        }

        setNomorTeleponE164(normalized);
    };

    function normalizePhone(input, defaultRegion = 'ID') {
        try {
            const phoneNumber = parsePhoneNumber(input, defaultRegion);
            if (phoneNumber.isValid()) {
                return phoneNumber.format('E.164');
            }
        } catch (err) {
        }
        return null;
    }

    const handleKataSandiChange = (e) => {
        setKataSandi(e.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!isChecked) {
            showToast("Anda harus menyetujui Syarat & Ketentuan (S&K).");
            return;
        }
        if (!nomorTeleponE164) {
            showToast("Nomor telepon tidak valid. Pastikan format benar (contoh: +6281234567890 atau 081234567890).");
            return;
        }

        const payload = {
            mode: 'POST',
            action: 'register',
            name: namaLengkap.trim(),
            email: email.trim().toLowerCase(),
            phone: nomorTeleponE164,
            password: kataSandi
        };

        fetch(endPoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
            .then(res => res.json())
            .then(response => {
                if (response.status === "success") {
                    showToast("Kode OTP telah dikirim!", "success");
                    setTimeout(() => {
                        if (typeof onRegisterSuccess === 'function') {
                            onRegisterSuccess({
                                kode: response.kode,       // dari backend
                                name: namaLengkap.trim(),
                                email: email.trim().toLowerCase(),
                                phone: nomorTeleponE164,
                                password: kataSandi
                            });
                        }
                    }, 1000);
                } else {
                    showToast(response.message || 'Pendaftaran gagal.');
                }
            })
            .catch(error => {
                console.error("Error:", error);
                showToast("Terjadi kesalahan jaringan. Silakan coba lagi.");
            });
    };


    const confirmSubmit = () => {
        setShowPopup(false);
        setShowuptrue(false);

        let payload = {
            name: namaLengkap.trim(),
            email: email.trim().toLowerCase(),
            phone: nomorTeleponE164,
            password: kataSandi,
            mode: 'POST',
            action: 'generate_otp'
        };

        fetch(endPoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
            .then(res => res.json())
            .then(response => {
                if (response.status === "success") {
                    showToast("Akun berhasil dibuat! Mengalihkan ke verifikasi...", "success");
                    setTimeout(() => {
                        if (typeof close === 'function') {
                            close();
                        }
                        if (typeof onRegisterSuccess === 'function') {
                            onRegisterSuccess({
                                kode: response.kode,
                                name: namaLengkap.trim(),           // ✅ dari state lokal
                                email: email.trim().toLowerCase(),  // ✅ dari state lokal
                                phone: nomorTeleponE164,            // ✅ dari state lokal
                                password: kataSandi                 // ✅ dari state lokal
                            });
                        }
                    }, 1500);
                } else {
                    showToast(response.message || 'Pendaftaran gagal. Periksa kembali data Anda.');
                }
            })
            .catch(error => {
                console.error("Error saat fetch:", error);
                showToast("Terjadi kesalahan pada jaringan. Silakan coba lagi.");
            });
    };

    return (
        <>
            <ToastAlert
                message={toast.message}
                type={toast.type}
                isVisible={toast.visible}
                onClose={hideToast}
            />

            <form
                className={`w-full flex flex-col items-center gap-6 transition-all duration-200 ${showPopup || showPopuptrue ? "blur-sm" : ""}`}
                onSubmit={handleSubmit}
            >
                <div className="mt-10 flex flex-col gap-5 ml-5">
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
                            onClick={() => setShowSK(true)}
                        >
                            S&K
                        </span>
                    </div>

                    <Button type="submit" className="w-[114px] mt-4 mx-auto">
                        Daftar
                    </Button>
                </div>
            </form>

            {showPopup && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-[#EBEDF0] w-[533px] h-[186px] rounded-[20px] shadow-lg flex flex-col items-center px-8 pt-5 pb-8 relative animate-[popup_0.2s_ease-out]">
                        <h1 className="font-jakarta text-base text-center">
                            Apakah kamu sudah yakin <br /> untuk mendaftar akun?
                        </h1>
                        <div className="flex gap-[73px] mt-[50px]">
                            <Button onClick={() => setShowPopup(false)}>Tidak</Button>
                            <Button onClick={() => {
                                setShowPopup(false);
                                setShowuptrue(true);
                            }}>Iya</Button>
                        </div>
                    </div>
                </div>
            )}

            {showPopuptrue && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-[#EBEDF0] w-[533px] h-[186px] rounded-[20px] shadow-lg flex flex-col items-center px-8 pt-5 pb-8 relative animate-[popup_0.2s_ease-out]">
                        <h1 className="font-jakarta text-base text-center">
                            “Selamat! Akun anda sudah berhasil dibuat nih. <br />
                            Silahkan kembali masuk untuk menggunakan <br />
                            layanan kami”
                        </h1>
                        <div className="flex gap-[73px] mt-[24px]">
                            <Button onClick={confirmSubmit}>Iya</Button>
                        </div>
                    </div>
                </div>
            )}

            {showSK && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35">
                    <div className="relative w-full h-[90vh] overflow-auto bg-white rounded-lg">
                        <button
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
                            onClick={() => setShowSK(false)}
                        >
                            ✕
                        </button>
                        <SKLayout onBack={() => setShowSK(false)} />
                    </div>
                </div>
            )}
        </>
    );
};

export default Register;