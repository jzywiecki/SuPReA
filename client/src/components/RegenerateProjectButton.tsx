// RegenerateProjectButton.tsx

import React from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const RegenerateProjectButton: React.FC = () => {
  const { projectID, component } = useParams();

  const handleClick = async () => {
    try {
      await axios.post(`http://localhost:8000/${component}/${projectID}`);
      console.log(`Successfully regenerated ${component} for project ${projectID}`);
    } catch (error) {
      console.error('Error regenerating project:', error);
    }
  };

  return (
    <button className="w-full bg-accent text-accent-foreground p-2 rounded-md hover:bg-accent-hover" onClick={handleClick}>
      Regenerate component
    </button>
  );
};

export default RegenerateProjectButton;
