import Button from "../Elements/Button";
import Input from "../Elements/Input";
import { useState } from "react";
import axios from "axios";
import { ThreeCircles } from 'react-loader-spinner'

const KSB = ({ close }) => {



    const [showPassword, setShowPassword] = useState(false);
    const [newPasswrod, setNewPassword] = useState("");
    const [oldPasswrod, setOldPassword] = useState("");
    const [confirmPasswrod, setConfirmPassword] = useState("");
    const email = localStorage.getItem("auth_email")
    const [loading, setLoading] = useState(false);

    const handleConfirmPasswordChange = (newValue) => {
        setConfirmPassword(newValue);
    };
    const handleOldPasswordChange = (newValue) => {
        setOldPassword(newValue);
    }; const handleNewPasswordChange = (newValue) => {
        setNewPassword(newValue);
    };

    const submit = async (e) => {
        e.preventDefault();

        if (newPasswrod !== confirmPasswrod) {
            alert("Password tidak sama!");
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(
                "https://smataco.my.id/dev/unez/CariRumahAja/routes/user.php",
                {
                    mode: "UPDATE",
                    action: "resetPassword",
                    email: email,
                    old_password: oldPasswrod,
                    new_password: newPasswrod,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );


            if (response.data?.status === "success") {
                alert("Password berhasil diubah!");
                close();
            } else {
                alert(response.data?.message || "Gagal mengubah password!");
            }
        } catch (error) {
            alert("Terjadi kesalahan pada server!");
        } finally {
            setLoading(false);
        }
    };
    return (
        <form className="vh-100 d-flex"
            method="POST"
        >
            <p className="font-jakarta text-[14px] text-center justify-content-center mt-7">Masukkan kata sandi yang baru</p>
            <div className="mt-15 flex flex-col ml-5 ">
                <label className="font-jakarta text-xs">Kata Sandi Lama</label>
                <div className="relative w-full">
                    <Input
                        type={showPassword ? "text" : "password"}
                        name="kata_sandi"
                        className="w-full h-[29px] rounded-full border border-[#F4D77B] px-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#2067C5] bg-white"
                        onChange={handleOldPasswordChange}
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
                <label className="font-jakarta text-xs">Kata Sandi Baru</label>
                <div className="relative w-full">
                    <Input
                        type={showPassword ? "text" : "password"}
                        name="kata_sandi"
                        className="w-full h-[29px] rounded-full border border-[#F4D77B] px-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#2067C5] bg-white"
                        onChange={handleNewPasswordChange}
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
                        onChange={handleConfirmPasswordChange}
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
                <div className="mt-10 text-center">
                    {loading ? (
                        <ThreeCircles
                            height="50"
                            width="50"
                            color="#2067C5"
                            visible={true}
                            ariaLabel="loading"
                        />
                    ) : (
                        <Button className="mt-5" onClick={submit}>
                            Lanjut
                        </Button>
                    )}
                </div>
            </div>

        </form>
    );
}

export default KSB;