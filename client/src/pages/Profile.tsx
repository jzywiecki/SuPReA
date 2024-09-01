import { useParams } from "react-router-dom";

function Profile() {
  const { id } = useParams(); // Pobiera parametr id z URL
  return (
    <div>
      <h1>Profile Page</h1>
      <p>User ID: {id}</p>
    </div>
  );
}

export default Profile;