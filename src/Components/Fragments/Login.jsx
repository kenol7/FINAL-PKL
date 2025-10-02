import Button from "../Elements/Button";
import Input from "../Elements/Input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../Firebase/config";
import { ThreeCircles } from "react-loader-spinner";
import API from "../../Config/Endpoint";

const Login = ({route,onClose}) => {
  // const endPoint = `${API.endpointlogin}&email=${encodeURIComponent(email)}&password=${encodeURIComponent(kataSandi)}`;

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [kataSandi, setKataSandi] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleEmailChange = (newValue) => {
    setEmail(newValue);
  };
  const handleKataSandiChange = (newValue) => {
    setKataSandi(newValue);
  };

  async function signIn() {
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      setTimeout(() => {
        navigate("/register");
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error login Google:", error.code, error.message);
      alert(`Login gagal: ${error.code}`);
      setLoading(false);
    }
  }

  const checkLogin = async (event) => {
    event.preventDefault();

    if (!email || !kataSandi) {
      alert("Isi email dan password dulu");
      return;
    }

    const url = new URL(API.endpointlogin);
    url.searchParams.set("email", email);
    url.searchParams.set("password", kataSandi);

    console.log("Request URL:", url.toString());

    try {
      const res = await fetch(url.toString(), { method: "GET" });
      const response = await res.json();
      console.log("Response:", response);

      if (response.status === "success") {
        alert(`Hello, ${response.user.nama_lengkap}`);
        localStorage.setItem("auth_phone", response.user.nomer_telepon);
        localStorage.setItem("auth_email",response.user.email);
        localStorage.setItem("auth_fullname",response.user.nama_lengkap);
        localStorage.setItem("tipe_time", new Date().toISOString());
        window.dispatchEvent(new Event("storage"))
        onClose();
      } else {
        alert(response.message || "Password atau Email Salah");
        setEmail("");
        setKataSandi("");
      }
    } catch (err) {
      console.error("Error login:", err);
      alert("Terjadi kesalahan koneksi");
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
            ariaLabel="three-circles-loading"
          />
        </div>
      )}

      <form
        className="w-full flex flex-col items-center gap-6 mt-15"
        method="POST"
        onSubmit={checkLogin}
      >
        <Input
          label="Email"
          type="email"
          name="email"
          onChange={handleEmailChange}
        />

        <div className="flex flex-col items-start w-[278px]">
          <label className="font-jakarta text-sm mb-1">Kata Sandi</label>
          <div className="relative w-full">
            <Input
              type={showPassword ? "text" : "password"}
              className="w-full h-[29px] rounded-full border border-[#F4D77B] px-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-[#2067C5] bg-white"
              name="kata_sandi"
              onChange={handleKataSandiChange}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-2 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              <img
                src="/Component 2.png"
                alt="show/hide password"
                className="w-4 h-4 mt-1"
              />
            </button>
          </div>
        </div>

        <button
          type="button"
          className="text-xs text-black mt-6 hover:underline"
          onClick={route}

        >
          Lupa Kata Sandi?
        </button>

        <Button type="submit" className="w-[114px] mt-7">
          Masuk
        </Button>

        <div className="flex items-center w-[278px] my-4 mx-auto mt-8">
          <img src="/Line 12.png" alt="line" className="flex-1 h-[1px]" />
          <p className="text-xs text-center mx-2 font-jakarta">Atau</p>
          <img src="/Line 12.png" alt="line" className="flex-1 h-[1px]" />
        </div>

        <Button
          type="button"
          className="w-auto flex items-center gap-3 mt-4"
          onClick={signIn}
        >
          <img src="/SOCIAL MEDIA.png" alt="Google logo" className="w-5 h-5" />
          Masuk Dengan Google
        </Button>
      </form>
    </>
  );
};

export default Login;