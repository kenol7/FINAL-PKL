import KataSandiBaru from "../Components/Fragments/KataSandiBaru";
import KSBLayout from "../Components/Layouts/KSBLayout";

const HalamanKSB = () => {
    return (
    <div className="relative min-h-screen flex items-center justify-center ">
      <div className="absolute inset-0 bg-white blur-sm"></div>
      <div className="relative z-10">
        <KSBLayout title="Kata Sandi Baru">
          <KataSandiBaru />
        </KSBLayout>
      </div>
    </div>
    );
}

export default HalamanKSB;