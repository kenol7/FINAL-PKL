import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from "../Elements/Button";
import API from '../../Config/Endpoint';
import axios from "axios";

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

    const bgColor = type === "error"
        ? "bg-red-100 border-red-500 text-red-700"
        : "bg-green-100 border-green-500 text-green-700";

    return (
        <div
            className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-11/12 max-w-md p-4 rounded-lg shadow-lg border-l-4 ${bgColor} transition-all duration-300 ease-in-out`}
            role="alert"
        >
            <p className="font-bold">{type === "error" ? "Error" : "Sukses"}</p>
            <p>{message}</p>
        </div>
    );
};

const OTPInput = ({ kode, name, email, password, close, onUpdateUser }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { phone } = location.state || {};
    const length = 4;
    const [otp, setOtp] = useState(new Array(length).fill(""));
    const inputRefs = useRef([]);
    const [count, setCount] = useState(120);
    const [otpReal, setOtpReal] = useState('');
    const [phoneReal, setPhoneReal] = useState('');
    const [namaLengkap, setNamaLengkap] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [isResending, setIsResending] = useState(false);

    const [toast, setToast] = useState({ message: "", type: "success", visible: false });

    const showToast = (message, type = "success") => {
        setToast({ message, type, visible: true });
    };

    const hideToast = () => {
        setToast(prev => ({ ...prev, visible: false }));
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    useEffect(() => {
        if (!kode) return;

        const fetchDecrypt = async () => {
            try {
                const response = await axios.post(
                    `${API.endpointregist}`,
                    {
                        mode: "POST",
                        action: "decrypt",
                        nomer_telepon: phone || '',
                        email: email || '',
                        nama_lengkap: name || '',
                        kode: kode,
                    },
                    {
                        headers: { "Content-Type": "application/json" },
                    }
                );

                const data = response.data;

                if (data && data.otp) {
                    setOtpReal(data.otp);
                    const realPhone = data.nomer_telepon || phone;
                    if (!realPhone) {
                        throw new Error("Nomor telepon tidak ditemukan");
                    }
                    setPhoneReal(realPhone);
                    setNamaLengkap(name || data.nama_lengkap || "");
                    setUserEmail(email || data.email || "");
                    console.log("KODE OTP YANG DITERIMA DARI BACKEND:", data.otp);
                } else {
                    showToast("Gagal memuat data verifikasi.", "error");
                }
            } catch (err) {
                console.error("Decrypt error:", err);
                showToast("Terjadi kesalahan saat memuat data.", "error");
            }
        };

        fetchDecrypt();

    }, [kode]);

    useEffect(() => {
        if (count <= 0) return;
        const intervalId = setInterval(() => {
            setCount(prev => prev - 1);
        }, 1000);
        return () => clearInterval(intervalId);
    }, []);

    // useEffect(() => {
    //     console.log('OTP saat ini:', otp);
    // }, [otp]);

    const handleChange = (target, index) => {
        const val = target.value;
        if (val && isNaN(val)) return;
        const newOtp = [...otp];
        newOtp[index] = val.slice(-1);
        setOtp(newOtp);
        if (val !== "" && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    // console.log(otp);

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace") {
            if (otp[index] === "" && index > 0) {
                inputRefs.current[index - 1]?.focus();
            } else {
                const newOtp = [...otp];
                newOtp[index] = "";
                setOtp(newOtp);
            }
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData("text").replace(/\s/g, '').slice(0, length).split('');
        if (!pasteData.length) return;
        const newOtp = new Array(length).fill("");
        pasteData.forEach((char, idx) => {
            if (!isNaN(char)) newOtp[idx] = char;
        });
        setOtp(newOtp);
        setTimeout(() => {
            inputRefs.current[Math.min(pasteData.length, length - 1)]?.focus();
        }, 50);
    };

    const handleSubmit = async () => {
        const code = otp.join('').trim();
        if (!code || code.length !== 4) {
            showToast('Masukkan kode OTP lengkap.', 'error');
            return;
        }

        try {
            const response = await fetch(API.endpointregist, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    mode: "UPDATE",
                    action: "otp",
                    phone: phoneReal || phone,
                    otp: code
                })
            });

            const result = await response.json();

            if (result.status === "success") {
                localStorage.setItem("auth_email", email);
                localStorage.setItem("auth_fullname", name);
                localStorage.setItem("auth_phone", phoneReal || phone);
                if (result.foto_profil) {
                    localStorage.setItem("foto_profil", '/images/noprofile.png');
                }

                showToast(`Halo, ${name}! Akun Anda telah diverifikasi.`, "success");
                setTimeout(() => {
                    if (typeof onUpdateUser === "function") onUpdateUser();
                    if (typeof close === "function") close();
                    navigate("/");
                }, 1000);
            } else {
                throw new Error(result.message || "Kode OTP salah.");
            }
        } catch (err) {
            console.error("Verifikasi gagal:", err);
            showToast("Verifikasi gagal: " + err.message, "error");
            setOtp(new Array(4).fill(""));
            inputRefs.current[0]?.focus();
        }
    };

    // const handleSubmit = async () => {
    //     const code = otp.join('').trim();
    //     if (!code || code.length !== 4) {
    //         showToast('Masukkan kode OTP lengkap.', 'error');
    //         return;
    //     }

    //     try {
    //         const response = await fetch(API.endpointregist, {
    //             method: "POST", // atau sesuaikan jika backend terima PUT/UPDATE via POST
    //             headers: { "Content-Type": "application/json" },
    //             body: JSON.stringify({
    //                 mode: "POST",
    //                 action: "register",
    //                 name: name,
    //                 email: email,
    //                 phone: phoneReal || phone,
    //                 password: password
    //             })
    //         });

    //         const result = await response.json();
    //         if (result.status === "success") {
    //             // Simpan data user ke localStorage
    //             localStorage.setItem("auth_phone", phoneReal || phone);
    //             localStorage.setItem("auth_email", email);
    //             localStorage.setItem("auth_fullname", name);
    //             localStorage.setItem("foto_profil", '/images/noprofile.png');


    //             showToast(`Halo, ${name}! Akun Anda telah diverifikasi.`, "success");
    //             setTimeout(() => {
    //                 if (typeof close === "function") close();
    //                 navigate("/");
    //             }, 1000);
    //         } else {
    //             throw new Error(result.message || "Verifikasi gagal.");
    //         }
    //     } catch (err) {
    //         console.error("Verifikasi gagal:", err);
    //         showToast("Verifikasi gagal: " + err.message, "error");
    //         // Reset input OTP
    //         setOtp(new Array(4).fill(""));
    //         inputRefs.current[0]?.focus();
    //     }
    // };


    const handleResend = async () => {
        if (isResending || !phoneReal) return;
        setIsResending(true);

        try {
            const response = await fetch(API.endpointregist, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    mode: "POST",
                    action: "generate_otp",
                    phone: phoneReal
                })
            });

            const result = await response.json();
            if (result.status === 'success') {
                // 2. Ambil kode baru
                const newKode = result.kode;

                // 3. Decrypt untuk lihat OTP (opsional, hanya untuk debug)
                try {
                    const decryptRes = await axios.post(
                        `${API.endpointregist}`,
                        {
                            mode: "POST",
                            action: "decrypt",
                            nomer_telepon: phoneReal || phone,
                            email: userEmail || email,
                            nama_lengkap: namaLengkap || name,
                            kode: newKode,
                        },
                        {
                            headers: { "Content-Type": "application/json" },
                        }
                        
                    );

                    const decrypted = decryptRes.data;
                    if (decrypted && decrypted.otp) {
                        console.log("🆕 OTP BARU YANG DIKIRIM:", decrypted.otp);
                    }
                } catch (decryptErr) {
                    console.warn("Gagal decrypt OTP baru:", decryptErr);
                }
                setCount(120);
                showToast('OTP baru dikirim!', 'success');
            } else {
                showToast(result.message, 'error');
            }
        } catch (err) {
            showToast('Gagal mengirim ulang OTP.', 'error');
        } finally {
            setIsResending(false);
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
            <div className="flex flex-col items-center mt-15 gap-4">
                <p className="text-center mb-6">
                    Masukkan kode verifikasi yang dikirim ke nomor {phoneReal || phone}
                </p>
                <div className="flex space-x-3 mb-8">
                    {otp.map((data, index) => (
                        <input
                            key={index}
                            ref={(el) => (inputRefs.current[index] = el)}
                            type="text"
                            maxLength="1"
                            value={data}
                            onChange={(e) => handleChange(e.target, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            onPaste={handlePaste}
                            className="w-12 h-12 text-center text-xl font-bold border bg-amber-50 rounded-lg focus:border-blue-500 focus:outline-none"
                        />
                    ))}
                </div>

                {count > 0 ? (
                    <p className="text-sm text-black-600">
                        Kode berlaku selama: <span className="font-mono">{formatTime(count)}</span>
                    </p>
                ) : (
                    <button
                        onClick={handleResend}
                        disabled={isResending}
                        className={`text-blue-600 font-medium hover:underline focus:outline-none ${isResending ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {isResending ? 'Mengirim...' : 'Kirim ulang kode'}
                    </button>
                )}

                <div className="mt-6">
                    <Button onClick={handleSubmit} disabled={otp.join('').length !== length}>
                        Lanjut
                    </Button>
                </div>
            </div>
        </>
    );
};

export default OTPInput;