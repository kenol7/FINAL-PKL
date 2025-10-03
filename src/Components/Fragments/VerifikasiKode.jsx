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
    const { otp: otpFromAPI, phone } = location.state || {};
    const length = 4;
    const [otp, setOtp] = useState(new Array(length).fill(""));
    const inputRefs = useRef([]);
    const [count, setCount] = useState(120);
    const [isResendAllowed, setIsResendAllowed] = useState(false);
    const [otpReal, setOtpReal] = useState('')
    const [phoneReal, setPhoneReal] = useState('')
    const [namaLengkap, setNamaLengkap] = useState('')
    const [userEmail, setUserEmail] = useState('')

    const [toast, setToast] = useState({ message: "", type: "success", visible: false });

    const showToast = (message, type = "success") => {
        setToast({ message, type, visible: true });
    };

    const hideToast = () => {
        setToast(prev => ({ ...prev, visible: false }));
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
                setOtpReal(response.otp);
                setPhoneReal(response.nomer_telepon);
                setNamaLengkap(name); // dari props
                setUserEmail(email);       // dari props
            });
    }, [kode, name, email]); // dependensi

    // useEffect(() => {
    //     if (otpFromAPI) {
    //         const digits = otpFromAPI.toString().slice(0, length).split('');
    //         const newOtp = new Array(length).fill("");
    //         digits.forEach((d, i) => { if (!isNaN(d)) newOtp[i] = d; });
    //         setOtp(newOtp);

    //         const focusIndex = Math.min(digits.length, length - 1);
    //         setTimeout(() => inputRefs.current[focusIndex]?.focus(), 50);
    //     }
    //     console.log("OTP dari API:", otpFromAPI);
    // }, [otpFromAPI]);

    const handleChange = (target, index) => {
        const val = target.value;
        if (val && isNaN(val)) return;
        const newOtp = [...otp];
        newOtp[index] = val.slice(-1);
        setOtp(newOtp);
        if (val !== "" && index < length - 1) inputRefs.current[index + 1]?.focus();
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace") {
            if (otp[index] === "" && index > 0) inputRefs.current[index - 1]?.focus();
            else { const newOtp = [...otp]; newOtp[index] = ""; setOtp(newOtp); }
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData("text").replace(/\s/g, '').slice(0, length).split('');
        if (!pasteData.length) return;
        const newOtp = new Array(length).fill("");
        pasteData.forEach((char, idx) => { if (!isNaN(char)) newOtp[idx] = char; });
        setOtp(newOtp);
        setTimeout(() => inputRefs.current[Math.min(pasteData.length, length - 1)]?.focus(), 50);
    };

    useEffect(() => {
        if (count <= 0) return setIsResendAllowed(true);
        const intervalId = setInterval(() => setCount(prev => prev - 1), 1000);
        return () => clearInterval(intervalId);
    }, [count]);

    const handleSubmit = () => {
        const code = otp.join('').trim();

        if (code === otpReal) {
            localStorage.setItem('auth_phone', phoneReal);
            localStorage.setItem('auth_email', userEmail);
            localStorage.setItem('auth_fullname', namaLengkap);
            localStorage.setItem('tipe_time', Date.now());

            if (typeof onUpdateUser === 'function') {
                onUpdateUser();
            }

            showToast(`Halo, ${namaLengkap} Selamat Datang`, "success");

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

    const handleResend = () => {
        if (!isResendAllowed) return;
        setCount(120);
        setIsResendAllowed(false);
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
                <p className="text-center mb-6">Masukkan kode verifikasi yang dikirim ke nomor {phone}</p>
                <div className="flex space-x-3 mb-12 ">
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
                            className="w-12 h-12 text-center text-xl font-bold border bg-amber-50 rounded-lg focus:border-blue-500"
                        />
                    ))}
                </div>
                <label>{count > 0 ? `${count} detik` : 'Kirim ulang sekarang'}</label>
                <div className="flex gap-4 mt-6">
                    <Button onClick={handleSubmit}>Lanjut</Button>
                    <Button onClick={handleResend} disabled={!isResendAllowed}>Kirim Ulang</Button>
                </div>
            </div>
        </>
    );
};

export default OTPInput;
