import { checkProjectExists } from './checkProjectExists'; // Your function for validation

export async function validateProject({ params }) {
  const { projectID } = params;

  const exists = await checkProjectExists(projectID);

  if (!exists) {
    throw new Response("Project not found", { status: 404 });
  }

  return null; // If valid, continue with route rendering
}

export default validateProject;