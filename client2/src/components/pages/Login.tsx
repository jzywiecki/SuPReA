import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "@/components/account/LoginForm";
import { useUserContext } from "@/contexts/custom-context-hooks";

const Login = () => {
  const { isLogged } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLogged) {
      navigate("/");
    }
  });

  return (
    <div>
      <LoginForm />
    </div>
  );
};

export default Login;
