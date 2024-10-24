import { useState, useEffect, ChangeEvent } from 'react';
import { useParams } from 'react-router-dom';
import { FaPencilAlt, FaSave, FaUser, FaGlobe, FaBuilding, FaMapMarkerAlt } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import Modal from 'react-modal';
import rehypeRaw from 'rehype-raw';
import { API_URLS } from '@/services/apiUrls';
import axiosInstance from '@/services/api';
import { useSnackbar } from 'notistack';
interface User {
  id: string;
  username: string;
  email: string;
  avatarurl: string;
  name: string;
  description: string;
  readme: string;
  organization: string;
  location: string;
  website: string;
}

Modal.setAppElement('#root');

function Profile() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<{ [key in keyof User]?: boolean }>({});
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    axiosInstance.get<User>(`${API_URLS.BASE_URL}/users/${id}`)
      .then(response => {
        setUser(response.data);
        console.log(response.data);
        setPreviewAvatar(response.data.avatarurl);
      })
      .catch(error => {
        console.error("There was an error fetching the user data!", error);
      });
  }, [id]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (user) {
      setUser({
        ...user,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleResetAvatar = () => {
    axiosInstance.post(`${API_URLS.BASE_URL}/users/${id}/reset-avatar`)
      .then(response => {
        enqueueSnackbar('Avatar reset successfully!', { variant: 'success' });

        setPreviewAvatar(response.data);
        setIsAvatarModalOpen(false);
        console.log(response.data);
      })
      .catch(error => {
        console.error("There was an error resetting the avatar!", error);
        enqueueSnackbar(`There was an error! ${error.response?.status ?? 'Unknown error'}`, { variant: 'error' });
      });
  }

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatar(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFieldSubmit = (field: keyof User) => {
    if (!user) return;

    const formData = new FormData();
    formData.append(field, (user as any)[field]);

    axiosInstance.patch(`${API_URLS.BASE_URL}/users/${id}`, formData, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(() => {
        enqueueSnackbar(`${field} updated successfully!`, { variant: 'success' });
        setIsEditing({ ...isEditing, [field]: false });
      })
      .catch(error => {
        enqueueSnackbar(`There was an error updating the ${field}! ${error.response?.status ?? 'Unknown error'}`, { variant: 'error' });
        console.log(error)
      });
  };

  const handleAvatarSubmit = () => {
    if (!avatar) return;

    const formData = new FormData();
    formData.append('avatar', avatar);

    axiosInstance.put(`${API_URLS.BASE_URL}/api/users/${id}/avatar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(response => {
        enqueueSnackbar("Avatar updated successfully!", { variant: 'success' });

        setUser(response.data);
        setPreviewAvatar(response.data.avatarurl);
        setIsAvatarModalOpen(false);
      })
      .catch(error => {
        enqueueSnackbar(`There was an error updating the avatar! ${error.response?.status ?? 'Unknown error'}`, { variant: 'error' });
        console.log(error)
      });
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
    setIsEditing({});
  };

  return (
    <div className="max-w-5xl mt-6 mx-auto p-5 grid grid-cols-1 md:grid-cols-2 gap-10">
      {user && (
        <>
          <div>
            <div className="text-center mb-4">
              <img
                src={user.avatarurl}
                alt="Profile Avatar"
                className="w-96 h-96 rounded-full object-cover mx-auto cursor-pointer border-1 border-gray-300"
                onClick={() => setIsAvatarModalOpen(true)}
              />

            </div>
            <div className="space-y-0 border-b-2">
              <h2 className="text-2xl font-bold">{user.username}</h2>
              <p className="text-gray-500">{user.email}</p>
              <div className='space-y-0'>
                {[
                  { field: 'description' },
                ].map(({ field }) => (
                  <div key="description" className="relative flex items-center">
                    <div className="relative mt-2 flex-1">
                      <textarea
                        id={field}
                        name={field}
                        role="textbox"
                        value={user[field as keyof User]}
                        disabled={!isEditMode || !isEditing[field as keyof User]}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 rounded-md resize-none overflow-y-auto overflow-x-auto ${isEditMode && isEditing[field as keyof User]
                          ? 'border border-gray-300'
                          : 'border-none bg-white dark:bg-inherit'
                          }`}
                        rows={3}
                      />
                      {isEditMode && (
                        <>
                          {isEditing["description" as keyof User] ? (
                            <FaSave
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                              onClick={() => handleFieldSubmit("description" as keyof User)}
                            />
                          ) : (
                            <FaPencilAlt
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                              onClick={() => setIsEditing({ ...isEditing, ["description"]: true })}
                            />
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center mt-4">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer"
                onClick={toggleEditMode}
              >
                {isEditMode ? 'Cancel Edit' : 'Edit Profile'}
              </button>
            </div>
            <div className="space-y-0">
              {[
                { field: 'name', icon: FaUser },
                { field: 'organization', icon: FaBuilding },
                { field: 'location', icon: FaMapMarkerAlt },
                { field: 'website', icon: FaGlobe },
              ].map(({ field, icon: Icon }) => (
                <div key={field} className="relative flex items-center">
                  <Icon className="text-gray-700 mr-2" />
                  <div className="relative mt-2 flex-1">
                    <input
                      type={field === 'email' ? 'email' : 'text'}
                      id={field}
                      name={field}
                      value={user[field as keyof User]}
                      disabled={!isEditMode || !isEditing[field as keyof User]}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 rounded-md ${isEditMode && isEditing[field as keyof User] ? 'border border-gray-300' : 'border-none bg-white  dark:bg-inherit'}`}
                    />
                    {isEditMode && (
                      <>
                        {isEditing[field as keyof User] ? (
                          <FaSave
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                            onClick={() => handleFieldSubmit(field as keyof User)}
                          />
                        ) : (
                          <FaPencilAlt
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                            onClick={() => setIsEditing({ ...isEditing, [field]: true })}
                          />
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="border-2 border-gray-300 rounded-lg p-10">
              {isEditing.readme ? (
                <div className="relative">
                  <textarea
                    name="readme"
                    value={user.readme}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-md border border-gray-300 h-64"
                  />
                  <FaSave
                    className="absolute right-3 top-3 text-gray-500 cursor-pointer"
                    onClick={() => handleFieldSubmit('readme')}
                  />
                </div>
              ) : (
                <div className="relative">
                  {user.username}/about the user
                  <ReactMarkdown rehypePlugins={[rehypeRaw]} className="prose mt-5 p-5 border-t-2">

                    {user.readme}
                  </ReactMarkdown>
                  {isEditMode && (
                    <FaPencilAlt
                      className="absolute right-3 top-1 text-gray-500 cursor-pointer"
                      onClick={() => setIsEditing({ ...isEditing, readme: true })}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      <Modal
        isOpen={isAvatarModalOpen}
        onRequestClose={() => setIsAvatarModalOpen(false)}
        contentLabel="Upload Avatar"
        className="absolute inset-0 flex items-center justify-center bg-white dark:bg-black"
        overlayClassName="fixed inset-0"
      >
        <div className="p-6 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-xl font-bold mb-4">Upload New Avatar</h2>
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="w-full px-4 py-2 mb-4"
          />
          {previewAvatar && (
            <img
              src={previewAvatar}
              alt="Preview Avatar"
              className="w-32 h-32 rounded-full object-cover mx-auto mb-4"
            />
          )}
          <div className="flex justify-end">
            <button
              className="px-4 py-2 bg-red-600 text-white rounded-lg cursor-pointer"
              onClick={handleResetAvatar}
            >
              Reset avatar
            </button>
            <button
              className="mr-4 px-4 py-2  text-white rounded-lg cursor-pointer"
              onClick={() => setIsAvatarModalOpen(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-green-600 text-white rounded-lg cursor-pointer"
              onClick={handleAvatarSubmit}
            >
              Save Avatar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Profile;
