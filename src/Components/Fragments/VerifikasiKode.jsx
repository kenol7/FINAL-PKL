import React, { useState, useRef, useEffect } from 'react';
import Button from '../Elements/Button';

const OTPInput = () => {
    const [otp, setOtp] = useState(new Array(4).fill(""));
    const inputRefs = useRef([]);
    const [count, setCount] = useState(120)

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return false;

        setOtp([...otp.map((data, idx) => (idx === index ? element.value : data))]);

        if (element.value !== "" && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && index > 0 && otp[index] === "") {
            inputRefs.current[index - 1].focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData("text").slice(0, 4).split('');

        const newOtp = [...otp];
        pasteData.forEach((char, index) => {
            if (!isNaN(char)) {
                newOtp[index] = char;
            }
        });

        setOtp(newOtp);

        const lastFilledIndex = pasteData.length > 0 ? Math.min(pasteData.length - 1, 5) : 0;
        inputRefs.current[lastFilledIndex]?.focus();
    };

    
    useEffect(() => {
       const intervalId = setInterval(()=> {
            setCount(prevCount => prevCount-1)
       },1000)
       if(count!=0) {
            return ()=> clearInterval(intervalId)
            
       } else {
        clearInterval(intervalId)
       }
    }, [count])

    return (
        <div className="flex flex-col items-center justify-center w-full mt-15 gap-4">
            <p className="text-black font-jakarta text-sm text-center mb-6 opacity-90 max-w-xs">
                Lihat kotak masuk email kamu dan masukkan kode verifikasinya.
            </p>

            <div className="flex justify-center space-x-3 mb-12">
                {otp.map((data, index) => (
                    <input
                        key={index}
                        ref={(input) => (inputRefs.current[index] = input)}
                        type="text"
                        maxLength="1"
                        value={data}
                        onChange={(e) => handleChange(e.target, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        onPaste={handlePaste}
                        className="w-12 h-12 text-center text-xl font-bold bg-white border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition shadow-sm"
                    />
                ))}
            </div>
            <label> {count} detik </label>
            <Button className="text-center mx-auto mt-10">
                Lanjut
            </Button>
        </div>
    );
};

export default OTPInput;