import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RegistrationForm from "@/components/RegistrationForm";
import { useUser } from "@/components/UserProvider";

const RegisterView = () => {
  const { isLogged } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLogged) {
      navigate("/");
    }
  }, [isLogged, navigate]);

  return (
    <div>
      <RegistrationForm />
    </div>
  );
};

export default RegisterView;
