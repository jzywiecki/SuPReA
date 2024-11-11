import { useEffect } from "react";
import NewProjectInput from "@/components/NewProjectInput";

const CreateProject = () => {

useEffect(() => {
    window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth", // Dodajemy płynne przewijanie
    });
}, []);

  return (
    <>
      <NewProjectInput />
    </>
  );
};

export default CreateProject;
