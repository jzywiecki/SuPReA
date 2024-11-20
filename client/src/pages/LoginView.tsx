import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "@/components/LoginForm";
import { useUser } from "@/components/UserProvider";

const LoginView = () => {
  const { isLogged } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLogged) {
      navigate("/");
    }
  }, [isLogged, navigate]);

  return (
    <div>
      <LoginForm />
    </div>
  );
};

export default LoginView;
