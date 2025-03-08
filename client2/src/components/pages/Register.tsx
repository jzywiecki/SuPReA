import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RegistrationForm from "@/components/account/RegistrationForm";
import { useUserContext } from "@/contexts/custom-context-hooks";

const Register = () => {
  const { isLogged } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLogged) {
      navigate("/");
    }
  });

  return (
    <div>
      <RegistrationForm />
    </div>
  );
};

export default Register;
