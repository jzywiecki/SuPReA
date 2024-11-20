import { useEffect } from "react";
import NewProjectInput from "@/components/NewProjectInput";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/components/UserProvider";

const CreateProject = () => {
  const { isLogged } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });

    if (isLogged === false) {
      navigate("/login");
    }
  }, [isLogged, navigate]);

  if (!isLogged) {
    return null;
  }

  return (
    <>
      <NewProjectInput />
    </>
  );
};

export default CreateProject;
