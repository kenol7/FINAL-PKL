import { BrowserRouter, Routes, Route } from "react-router-dom";
import KprPage from "./Pages/KprPages.jsx";
import ChatBot from "./Pages/Chatbot.jsx";
import Profile from "./Pages/Profile.jsx";
import { LoadingProvider } from "./Context/Loader";
import GlobalLoader from "./Context/GlobalLoader";
import { HalamanKSB, HalamanLKS, HalamanLogin, HalamanRegister, HalamanVerif, Halamansk, HalamanDetail, HalamanJual,} from "./Pages/HalamanUtama";
import Home from "./Pages/Home.jsx";
import Beli from "./Pages/Beli.jsx";
import ProctectedRoute from "./Components/Fragments/ProtectRouter.jsx"
import "./App.css";

function App() {
  return (
    <LoadingProvider>
      <BrowserRouter>
        <GlobalLoader />
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/kpr" element={<ProctectedRoute><KprPage/> </ProctectedRoute>} />
          <Route path="/chatbot" element={<ProctectedRoute><ChatBot/> </ProctectedRoute>} />
          <Route path="/profile" element={<ProctectedRoute><Profile/> </ProctectedRoute>} />
          <Route path="/login" element={<HalamanLogin />} />
          <Route path="/register" element={<HalamanRegister />} />
          {/* <Route path="/lupakatasandi" element={<HalamanLKS />} /> */}
          <Route path="/katasandibaru" element={<HalamanKSB />} />
          <Route path="/jualrumah" element={<ProctectedRoute><HalamanJual/> </ProctectedRoute>} />
          <Route path="/verifikasikode/:code/:name/:email" element={<HalamanVerif />} />
          <Route path="/syaratdanketentuan" element={<Halamansk />} />
          <Route path="/beli" element={<ProctectedRoute><Beli/> </ProctectedRoute>} />
          <Route path="/detailrumah/:refid" element={<ProctectedRoute><HalamanDetail/> </ProctectedRoute>} />
        </Routes>
      </BrowserRouter>
    </LoadingProvider>
  );
}

export default App;
