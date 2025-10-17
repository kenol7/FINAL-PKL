import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import API from "../../Config/Endpoint"

export default function ProtectedRoute({ children }) {
  const endPoint = API.endpointLogout;
  const authEmail = localStorage.getItem("auth_email");
  const loginTime = localStorage.getItem("tipe_time");
  const showToast = (msg) => alert(msg);
  

  const handleLogout = (e) => {
  try{
    const payload = {
      mode: 'POST',
      action: 'logout',
      email: authEmail
    };
    fetch(endPoint, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(payload) 
    })
    .then(res => res.json())
    .then(response => {
      if (response.status === "success") {
        showToast("Berhasil Logout!", "success");
    }})
  }
  catch{
    console.error("Logout error:", error);
  }
}
  useEffect(() => {
    if (loginTime) {
      const loginDate = new Date(loginTime);
      const now = new Date();
      const diff = now - loginDate;
      const oneDays =   10 * 60 * 1000;

      if (diff >= oneDays) {
        handleLogout();
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