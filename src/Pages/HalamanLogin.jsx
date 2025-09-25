import LoginLayout from "../Components/Layouts/LoginLayout";
import Login from "../Components/Fragments/Login";

const HalamanLogin = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center ">
      <div className="absolute inset-0 bg-white blur-sm"></div>
      <div className="relative z-10">
        <LoginLayout title="Masuk">
          <Login />
        </LoginLayout>
      </div>
    </div>
  );
};

export default HalamanLogin;