import RegisterLayout from "../Components/Layouts/RegisterLayout";
import Register from "../Components/Fragments/Register";

const HalamanRegister = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center ">
      <div className="absolute inset-0 bg-white blur-sm"></div>
      <div className="relative z-10">
        <RegisterLayout title={"Daftar"}>
          <Register />
        </RegisterLayout>
      </div>
    </div>
  );
};

export default HalamanRegister;