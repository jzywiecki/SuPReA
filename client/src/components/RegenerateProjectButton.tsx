import React, { useContext } from 'react';
import axios from 'axios';
import RegenerateContext from './contexts/RegenerateContext';

const RegenerateProjectButton: React.FC = () => {
  const { triggerRegenerate, projectRegenerateID, componentRegenerate } = useContext(RegenerateContext);

  const handleClick = async () => {
    try {
      console.log(`Regenerating for ${componentRegenerate}/${projectRegenerateID}...`);
      await axios.post(`http://localhost:8000/${componentRegenerate}/generate/${projectRegenerateID}`);
      console.log(`Successfully regenerated ${componentRegenerate} for project ${projectRegenerateID}`);
      triggerRegenerate();
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
