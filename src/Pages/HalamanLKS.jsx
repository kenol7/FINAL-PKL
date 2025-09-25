import LupaKataSandi from "../Components/Fragments/LupaKataSandi";
import LKSLayout from "../Components/Layouts/LKSLayout";

const HalamanLKS = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center ">
      <div className="absolute inset-0 bg-white blur-sm"></div>
      <div className="relative z-10">
        <LKSLayout title="Lupa Kata Sandi">
          <LupaKataSandi />
        </LKSLayout>
      </div>
    </div>
  );
};

export default HalamanLKS;