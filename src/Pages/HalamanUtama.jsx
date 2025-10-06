import KataSandiBaru from "../Components/Fragments/KataSandiBaru";
import LupaKataSandi from "../Components/Fragments/LupaKataSandi";
import Login from "../Components/Fragments/Login";
import Register from "../Components/Fragments/Register";
import SK from "../Components/Fragments/SK";
import UbahProfile from "../Components/Fragments/UbahProfile";
import OTPInput from "../Components/Fragments/VerifikasiKode";
import LKS from "../Components/Fragments/LupaKataSandi";
import { DetailLayout, SKLayout } from "../Components/Layouts/LayoutUtama";
import { KSBLayout } from "../Components/Layouts/LayoutUtama";
import { LoginLayout } from "../Components/Layouts/LayoutUtama";
import { RegisterLayout } from "../Components/Layouts/LayoutUtama";
import { LKSLayout } from "../Components/Layouts/LayoutUtama";
import { VerifLayout } from "../Components/Layouts/LayoutUtama";
import { Juallayout } from "../Components/Layouts/LayoutUtama";
import { useParams } from "react-router-dom";
import { UbahProfileLayout } from "../Components/Layouts/LayoutUtama";

const HalamanKSB = ({close}) => {
  return (
    <div className="relative min-h-screen flex items-center justify-center ">
      <div className="absolute inset-0  blur-sm"></div>
      <div className="relative z-10">
        <KSBLayout title="Kata Sandi Baru" onBack={close}>
          <KataSandiBaru close={close} />
        </KSBLayout>
      </div>
    </div>
  );
};

const HalamanLKS = ({ close }) => {
  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <div className="absolute inset-0 blur-sm"></div>
      <div className="relative z-10">
        <LKSLayout title="Lupa Kata Sandi" onBack={close}>
          <LKS close={close} /> 
        </LKSLayout>
      </div>
    </div>
  );
};

const HalamanLogin = ({ close, routeLKS }) => {
  return (
    <div className="relative min-h-screen flex items-center justify-center ">
      <div className="absolute inset-0  blur-sm"></div>
      <div className="relative z-10">
        <LoginLayout title="Masuk" onBack={close}>
          <Login route={routeLKS} onClose={close} />
        </LoginLayout>
      </div>
    </div>
  );
};

const HalamanRegister = ({ close, onRegisterSuccess }) => {
  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <div className="absolute inset-0 blur-sm"></div>
      <div className="relative z-10">
        <RegisterLayout title={"Daftar"} onBack={close}>
          <Register close={close} onRegisterSuccess={onRegisterSuccess} />
        </RegisterLayout>
      </div>
    </div>
  );
};

const Halamansk = () => {
  return (
    <div>
      <div className="relative min-h-screen flex items-center justify-center ">
        <div className="absolute inset-0  blur-sm"></div>
        <div className="relative z-10">
          <SKLayout>
            <SK />
          </SKLayout>
        </div>
      </div>
    </div>
  );
};

const HalamanVerif = ({ data, close, onUpdateUser }) => {
  const { code, name, email } = useParams();
  const verifData = data || { kode: code, name, email };

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <div className="absolute inset-0 blur-sm"></div>
      <div className="relative z-10">
        <VerifLayout title="Verifikasi Kode">
          <OTPInput
            kode={verifData.kode}
            name={verifData.name}
            email={verifData.email}
            close={close}
            onUpdateUser={onUpdateUser}
          />
        </VerifLayout>
      </div>
    </div>
  );
};

const HalamanDetail = () => {
  return <DetailLayout />;
};

const HalamanJual = () => {
  return <Juallayout />;
};

const HalamanUbahProfile = ({ close, onUpdate }) => {
  return (
    <div className="relative min-h-screen flex items-center justify-center ">
      <div className="absolute inset-0  blur-sm"></div>
      <div className="relative z-10">
        <UbahProfileLayout title={"Ubah Data"} onBack={close}>
          <UbahProfile onUpdate={onUpdate} />
        </UbahProfileLayout>
      </div>
    </div>
  );
};

export {
  HalamanKSB,
  HalamanLKS,
  HalamanLogin,
  HalamanRegister,
  HalamanVerif,
  Halamansk,
  HalamanDetail,
  HalamanJual,
  HalamanUbahProfile
};
