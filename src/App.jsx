import { BrowserRouter, Routes, Route } from "react-router-dom";
import KprPage from "./Pages/KprPages.jsx";
import ChatBot from "./Pages/Chatbot.jsx";
import Profile from "./Pages/Profile.jsx";
import { LoadingProvider } from "./Context/Loader";
import GlobalLoader from "./Context/GlobalLoader";
import { HalamanKSB, HalamanLKS, HalamanLogin, HalamanRegister, HalamanVerif, Halamansk, HalamanDetail } from "./Pages/HalamanUtama";
import Home from "./Pages/Home.jsx";
import Beli from "./Pages/Beli.jsx";
import "./App.css";

function App() {
  return (
    <LoadingProvider>
      <BrowserRouter>
        <GlobalLoader />
        <Routes>
          <Route path="/" element={<HalamanDetail />} />
          <Route path="/kpr" element={<KprPage />} />
          <Route path="/chatbot" element={<ChatBot />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<HalamanLogin />} />
          <Route path="/register" element={<HalamanRegister />} />
          <Route path="/lupakatasandi" element={<HalamanLKS />} />
          <Route path="/katasandibaru" element={<HalamanKSB />} />
          <Route path="/verifikasikode" element={<HalamanVerif />} />
          <Route path="/syaratdanketentuan" element={<Halamansk />} />
          <Route path="/beli" element={<Beli />} />
        </Routes>
      </BrowserRouter>
    </LoadingProvider>
  );
}

export default App;
