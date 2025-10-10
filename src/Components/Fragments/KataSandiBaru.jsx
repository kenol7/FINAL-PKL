import Button from "../Elements/Button";
import Input from "../Elements/Input";
import { useState, useEffect } from "react";
import axios from "axios";
import { ThreeCircles } from 'react-loader-spinner';

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

    const bgColor =
        type === "error"
            ? "bg-red-100 border-red-500 text-red-700"
            : "bg-green-100 border-green-500 text-green-700";

    return (
        <div
            className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-11/12 max-w-md p-4 rounded-lg shadow-lg border-l-4 ${bgColor}`}
            role="alert"
        >
            <p className="font-bold">{type === "error" ? "Error" : "Berhasil"}</p>
            <p>{message}</p>
        </div>
    );
};

const KSB = ({ close }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const email = localStorage.getItem("auth_email");
    const [loading, setLoading] = useState(false);

    const [toast, setToast] = useState({
        isVisible: false,
        message: "",
        type: "success",
    });

    const showToast = (message, type = "success") => {
        setToast({ isVisible: true, message, type });
    };

    const hideToast = () => {
        setToast((prev) => ({ ...prev, isVisible: false }));
    };

    const submit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            showToast("Password tidak sama!", "error");
            return;
        }

        setLoading(true); // 🔴 Aktifkan loader overlay

        try {
            const response = await axios.post(
                "https://smataco.my.id/dev/unez/CariRumahAja/routes/user.php", // ✅ tanpa spasi
                {
                    mode: "UPDATE",
                    action: "resetPassword",
                    email: email,
                    old_password: oldPassword,
                    new_password: newPassword,
                },
                {
                    headers: { "Content-Type": "application/json" },
                }
            );

            if (response.data?.status === "success") {
                showToast("Password berhasil diubah!", "success");
                setTimeout(() => {
                    close();
                }, 1000);
            } else {
                showToast(response.data?.message || "Gagal mengubah password!", "error");
            }
        } catch (error) {
            showToast("Terjadi kesalahan pada server!", "error");
        } finally {
            setLoading(false); // 🟢 Matikan loader
        }
    };

    return (
        <>
            {loading && (
                <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50 z-50">
                    <ThreeCircles
                        height="80"
                        width="80"
                        color="#E7C555"
                        visible={true}
                        ariaLabel="loading"
                    />
                </div>
            )}

            <ToastAlert
                isVisible={toast.isVisible}
                message={toast.message}
                type={toast.type}
                onClose={hideToast}
            />

            <form onSubmit={submit} className="flex flex-col">
                <p className="font-jakarta text-[14px] text-center mt-2 mb-6">
                    Masukkan kata sandi yang baru
                </p>

                <div className="flex flex-col ml-5">
                    <label className="font-jakarta text-xs">Kata Sandi Lama</label>
                    <div className="relative w-full">
                        <Input
                            type={showPassword ? "text" : "password"}
                            name="kata_sandi"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
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

                <div className="mt-6 flex flex-col ml-5">
                    <label className="font-jakarta text-xs">Kata Sandi Baru</label>
                    <div className="relative w-full">
                        <Input
                            type={showPassword ? "text" : "password"}
                            name="kata_sandi_baru"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
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

                <div className="mt-6 flex flex-col ml-5">
                    <label className="font-jakarta text-xs">Konfirmasi Kata Sandi</label>
                    <div className="relative w-full">
                        <Input
                            type={showPassword ? "text" : "password"}
                            name="konfirmasi_kata_sandi"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
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

                    <div className="mt-8 text-center">
                        <Button type="submit" className="mt-2">
                            Lanjut
                        </Button>
                    </div>
                </div>
            </form>
        </>
    );
};

export default KSB;