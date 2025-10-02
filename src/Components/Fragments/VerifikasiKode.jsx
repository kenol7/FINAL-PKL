import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from "../Elements/Button";
import API from '../../Config/Endpoint';

const OTPInput = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { otp: otpFromAPI, phone } = location.state || {};
    const length = 4;
    const [otp, setOtp] = useState(new Array(length).fill(""));
    const inputRefs = useRef([]);
    const [count, setCount] = useState(120);
    const [isResendAllowed, setIsResendAllowed] = useState(false);
    const [otpReal,setOtpReal] = useState('')
    const [phoneReal,setPhoneReal] = useState('')
    const [namaLengkap,setNamaLengkap] = useState('')
    const [email, setEmail] = useState('')

    let paramCode = ''

    useEffect(()=> {
        const path = window.location.pathname;
        const segments = path.split('/');
        paramCode = segments[2];
        setNamaLengkap(segments[3])
        setEmail(segments[4])
        let payload = {
            kode : paramCode,
            action : 'decrypt'
        }
        fetch (API.endpointregist,{
            method: 'POST',
            headers : {
                'Content-Type' : 'application/json'
            },
            body : JSON.stringify(payload)
        })
        .then(res=>res.json())
        .then(response=> {
            setOtpReal(response.otp)
            setPhoneReal(response.nomer_telepon)
        })
    },[])

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
        
        console.log(code + ' = ' + otpReal + "=" + namaLengkap)

        if (code === otpReal) {
            localStorage.setItem('auth_phone',phoneReal)
            localStorage.setItem('auth_email',email)
            localStorage.setItem('auth_fullname',namaLengkap)
            localStorage.setItem('tipe_time',Date.now())
      
            navigate('/');
        } else {
            setOtp(new Array(length).fill(""));
            inputRefs.current[0]?.focus();
            alert('Kode OTP salah, silakan coba lagi');
        }
    };

    const handleResend = () => {
        if (!isResendAllowed) return;
        setCount(120);
        setIsResendAllowed(false);
    };

    return (
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
    );
};

export default OTPInput;
