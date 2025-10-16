// src/Components/LKS.jsx
import Button from "../Elements/Button";
import Input from "../Elements/Input";
import { useState, useEffect } from "react";
import { ThreeCircles } from "react-loader-spinner";
import API from "../../Config/Endpoint";

// 👇 Salin komponen ToastAlert dari Login.jsx
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
            className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-11/12 max-w-md p-4 rounded-lg shadow-lg border-l-4 ${bgColor} transition-all duration-300 ease-in-out`}
            role="alert"
        >
            <p className="font-bold">{type === "error" ? "Error" : "Success"}</p>
            <p>{message}</p>
        </div>
    );
};

const LKS = ({ close, onBackToLogin }) => {
    const [email21, setEmail21] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // 👇 State untuk toast
    const [toast, setToast] = useState({ message: "", type: "error", visible: false });

    const showToast = (message, type = "error") => {
        setToast({ message, type, visible: true });
    };

    const hideToast = () => {
        setToast((prev) => ({ ...prev, visible: false }));
    };

    const handleEmailChange = (e) => {
        setEmail21(e.target.value); // Ambil nilai string dari event
        if (error) setError("");
    };


    const lksSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!email21 || !/\S+@\S+\.\S+/.test(email21)) {
            setError("Masukkan email yang valid");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(API.endpointregist, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    mode: "POST",
                    action: "forgotPassword",
                    email: email21,
                }),
            });

            const data = await res.json();

            if (data.status === "success") {
                // ✅ Tampilkan toast sukses
                showToast("Link reset password telah dikirim ke email Anda.", "success");

                setTimeout(() => {
                    close();
                }, 1800);
            } else {
                showToast(data.message || "Gagal mengirim email reset password", "error");
            }
        } catch (err) {
            console.error("Error:", err);
            showToast("Terjadi kesalahan jaringan", "error");
        } finally {
            setLoading(false);
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

            {loading && (
                <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50 z-50">
                    <ThreeCircles height="60" width="60" color="#E7C555" visible={true} />
                </div>
            )}

            <div className="w-full max-w-xs p-6">
                <p className="font-jakarta text-[14px] text-center mb-6">
                    Masukkan email yang terdaftar
                </p>

                <form onSubmit={lksSubmit}>
                    <div className="flex flex-col">
                        <label className="font-jakarta text-xs font-semibold mb-1">Email</label>
                        <Input
                            type="email"
                            name="email21"
                            value={email21}
                            onChange={handleEmailChange}
                            className="font-jakarta text-xs text-black text-center py-2"
                        />
                        {error && <p className="text-red-500 text-xs mt-1 text-center">{error}</p>}
                    </div>

                    <Button type="submit" className="w-[114px] mt-6 mx-auto block">
                        Kirim
                    </Button>

                    <button
                        type="button"
                        onClick={() => {
                            close(); 
                            if (onBackToLogin) onBackToLogin(); 
                        }}
                        className="text-xs text-black-500 mt-4 block mx-auto hover:underline"
                    >
                        Batal
                    </button>
                </form>
            </div>
        </>
    );
};

export default LKS;