import LoginLayout from "./LoginLayout"; 
import { useNavigate } from "react-router-dom";

const RegisterLayout = (props) => {
  const { title, children} = props;
  const navigate = useNavigate();

  return (
    <LoginLayout onBack={() => navigate("/login")}>
      {title}
      {children}
    </LoginLayout>
  );
};

export default RegisterLayout;
