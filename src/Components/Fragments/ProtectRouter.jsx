import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const authEmail = localStorage.getItem("auth_email");
  const loginTime = localStorage.getItem("tipe_time");

  useEffect(() => {
    if (loginTime) {
      const loginDate = new Date(loginTime);
      const now = new Date();

      // Hitung selisih waktu dalam jam
      const diff = now - loginDate;
      const oneDays =   1 * 60 * 1000;

      if (diff >= oneDays) {
        localStorage.clear();
        alert("Sesi login Anda telah kedaluwarsa. Silakan login kembali.");
        window.location.href = "/"; 
      }
    }
  }, [loginTime]);

  if (!authEmail) {
    alert("Anda harus login terlebih dahulu!");
    return <Navigate to="/" replace />;
  }

  return children;
}