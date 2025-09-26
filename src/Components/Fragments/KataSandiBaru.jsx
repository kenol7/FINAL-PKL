import Button from "../Elements/Button";
import Input from "../Elements/Input";
import { useState } from "react";
// import { useNavigate } from "react-router-dom";
import { ThreeCircles } from 'react-loader-spinner'

const KSB = () => {

    // const navigate = useNavigate()

    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="vh-100 d-flex">
            <p className="font-jakarta text-[14px] text-center justify-content-center mt-7">Masukkan kata sandi yang baru</p>
            <div className="mt-15 flex flex-col ml-5 ">
                <label className="font-jakarta text-xs">Kata Sandi</label>
                <div className="relative w-full">
                    <Input
                        type={showPassword ? "text" : "password"}
                        name="kata_sandi"
                        className="w-full h-[29px] rounded-full border border-[#F4D77B] px-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#2067C5] bg-white"

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
            <div className="mt-8 flex flex-col ml-5 ">
                <label className="font-jakarta text-xs">Konfirmasi Kata Sandi</label>
                <div className="relative w-full">
                    <Input
                        type={showPassword ? "text" : "password"}
                        name="konfirmasi_kata_sandi"
                        className="w-full h-[29px] rounded-full border border-[#F4D77B] px-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#2067C5] bg-white"

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
                <Button className="text-center mx-auto mt-20">
                    Lanjut
                </Button>
            </div>

        </div>
    );
}

export default KSB;