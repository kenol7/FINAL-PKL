import OTPInput from "../Components/Fragments/VerifikasiKode";
import VerifLayout from "../Components/Layouts/VerifikasiKodeLayout";

const HalamanVerif = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center ">
      <div className="absolute inset-0 bg-white blur-sm"></div>
      <div className="relative z-10">
        <VerifLayout title="Verifikasi Kode">
          <OTPInput />
        </VerifLayout>
      </div>
    </div>
  );
};

export default HalamanVerif;