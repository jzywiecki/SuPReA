import { Navigate, Outlet, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { checkProjectExists } from './checkProjectExists'; // Hypothetical API call to verify project existence

function ProtectedRoute({ redirectTo }) {
  const { projectID } = useParams(); // Get projectID from the URL
  const [isValidProject, setIsValidProject] = useState(null); // Null initially for loading state

  useEffect(() => {
    async function validateProject() {
      const exists = await checkProjectExists(projectID); // Call your service
      setIsValidProject(exists);
    }

    validateProject();
  }, [projectID]);

  if (isValidProject === null) {
    return <div>Loading...</div>; // Optional: Replace with a loader component
  }

  return isValidProject ? <Outlet /> : <Navigate to={redirectTo} replace />;
}

export default ProtectedRoute;