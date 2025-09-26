import { useNavigate, useLocation } from "react-router-dom";
import SK from "../Fragments/SK";
import Logo from "../../assets/logo.png";
import DetailRumah from "../Fragments/DetailRumah";
import Footer from "../Elements/Footer";



const LoginLayout = (props) => {
  const { title, children, height = "640px", onBack } = props;

  return (
    <div
      className="bg-[#549AF8] w-[406px] rounded-lg shadow-lg flex flex-col items-center px-8 pt-5 pb-8 relative"
      style={{ height }}
    >
      <button
        onClick={onBack}
        className="w-[24px] h-[24px] rounded-md hover:bg-[#2067C5] transition absolute top-5 left-5"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <h1 className="font-jakarta font-semibold text-[20px] text-center mb-1">
        {title}
      </h1>

      {children}
    </div>
  );
};
const KSBLayout = (props) => {
  const { title, children } = props;
  return (
    <LoginLayout height="533px">
      {title}
      {children}
    </LoginLayout>
  );
};

const LKSLayout = (props) => {
  const { title, children, onBack } = props;
  return (
    <LoginLayout height="458px" onBack={onBack}>
      {title}
      {children}
    </LoginLayout>
  );
};

const RegisterLayout = (props) => {
  const { title, children, onBack } = props;

  return (
    <LoginLayout onBack={onBack}>
      {title}
      {children}
    </LoginLayout>
  );
};

const SKLayout = () => {
  const navigate = useNavigate();

  return (
    <div className="w-screen min-h-screen bg-white">
      <header className="sticky top-0 flex items-center w-full px-5 py-4 bg-[#549AF8] text-black shadow-md">
        <button
          className="w-8 h-8 rounded-md hover:bg-[#2067C5] transition flex items-center justify-center mr-4 "
          onClick={() => navigate("/register")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <h1 className="font-jakarta font-semibold text-lg">
          Syarat dan Ketentuan
        </h1>
      </header>
      <SK></SK>
    </div>
  );
};

const VerifLayout = (props) => {
  const { title, children } = props;
  return (
    <LoginLayout height="458px">
      {title}
      {children}
    </LoginLayout>
  );
};

const DetailLayout = () => {
  const location = useLocation
    const isActive = (path) =>
    location.pathname === path
      ? "text-gray-700 font-semibold"
      : "text-gray-700";

  return (
    <div className="min-h-screen flex flex-col">
      <div className="shadow">
        <header>
          <div className="flex justify-between items-center px-7 py-2.5">
            <a href="/">
              <img src={Logo} width="50" height="40" />
            </a>

            {/* <div className="block md:hidden lg:hidden">
              <div onClick={() => setMenuOpen(true)} aria-label="Open Menu">
                <img src={Menu} width="30" height="30" />
              </div>
            </div> */}

            <ul className="lg:flex md:flex hidden gap-5 items-center text-gray-700">
              <li>
                <a href="chatbot" className={`hover:text-gray-900 ${isActive("/chatbot")}`}>
                  Chatbot
                </a>
              </li>
              <li>
                <a href="" className={`hover:text-gray-900 ${isActive("/beli")}`}>
                  Beli Rumah
                </a>
              </li>
              <li>
                <a href="/kpr" className={`hover:text-gray-900 ${isActive("/kpr")}`}>
                  Hitung KPR
                </a>
              </li>
              <li>
                <a href="" className={`hover:text-gray-900 ${isActive("/profile")}`}>
                  Profile
                </a>
              </li>
            </ul>
          </div>
        </header>
      </div>

      <main className="flex-1">
        <DetailRumah />
      </main>

      <Footer />
    </div>
  );
};

export {
  LoginLayout,
  KSBLayout,
  LKSLayout,
  RegisterLayout,
  SKLayout,
  VerifLayout,
  DetailLayout,
};
