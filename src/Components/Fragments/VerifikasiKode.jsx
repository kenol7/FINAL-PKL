import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from "../Elements/Button";
import API from '../../Config/Endpoint';

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

const OTPInput = ({ kode, name, email, close, onUpdateUser }) => {
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

        let payload = {
            kode: kode,
            action: 'decrypt'
        };

        fetch(API.endpointregist, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
            .then(res => res.json())
            .then(response => {
                if (response && response.otp) {
                    setOtpReal(response.otp);
                    setPhoneReal(response.nomer_telepon || phone);
                    setNamaLengkap(name || response.nama_lengkap || '');
                    setUserEmail(email || response.email || '');
                } else {
                    showToast('Gagal memuat data verifikasi.', 'error');
                }
            })
            .catch(err => {
                console.error('Decrypt error:', err);
                showToast('Terjadi kesalahan saat memuat data.', 'error');
            });
    }, [kode, name, email, phone]);

    useEffect(() => {
        if (count <= 0) return;
        const intervalId = setInterval(() => {
            setCount(prev => prev - 1);
        }, 1000);
        return () => clearInterval(intervalId);
    }, [count]);

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

    const handleSubmit = () => {
        const code = otp.join('').trim();

        if (!code || code.length !== length) {
            showToast('Masukkan kode OTP lengkap.', 'error');
            return;
        }

        if (code === otpReal) {
            localStorage.setItem('auth_phone', phoneReal);
            localStorage.setItem('auth_email', userEmail);
            localStorage.setItem('auth_fullname', namaLengkap);
            localStorage.setItem('tipe_time', Date.now().toString());

            if (typeof onUpdateUser === 'function') {
                onUpdateUser();
            }

            showToast(`Halo, ${namaLengkap}! Selamat datang.`, "success");

            setTimeout(() => {
                if (typeof close === 'function') {
                    close();
                }
                navigate('/');
            }, 1000);
        } else {
            setOtp(new Array(length).fill(""));
            inputRefs.current[0]?.focus();
            showToast('Kode OTP salah, silakan coba lagi.', "error");
        }
    };

    const handleResend = async () => {
        if (isResending) return;

        setIsResending(true);
        try {
            const payload = {
                nomor_telepon: phoneReal,
                email: userEmail,
                nama_lengkap: namaLengkap,
                action: 'kirim_ulang_otp'
            };

            const response = await fetch(API.endpointregist, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (result.status === 'success' || result.success) {
                setCount(120);
                showToast('Kode OTP baru telah dikirim!', 'success');

            } else {
                showToast(result.message || 'Gagal mengirim ulang OTP.', 'error');
            }
        } catch (error) {
            console.error('Resend OTP error:', error);
            showToast('Gagal menghubungi server. Coba lagi.', 'error');
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
                        Kode berlaku selama : <span className="font-mono">{formatTime(count)}</span>
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