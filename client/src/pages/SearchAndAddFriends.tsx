import React, { useState, useEffect } from 'react';
import UserCard from '@/components/UserCard';
import { useUser } from "@/components/UserProvider";
import Search from '@/components/Search';
import axiosInstance from '@/services/api';
import { API_URLS } from '@/services/apiUrls';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

export interface User {
    id: string;
    nickname: string;
    email: string;
    avatarurl: string;
    status: string;
}

const SearchAndAddFriends: React.FC = () => {
    const { user, isLogged } = useUser();
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const [friends, setFriends] = useState<User[]>([]);
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();


    useEffect(() => {
        if (isLogged === false) {
            navigate('/login');
        }

        if (user) {
            fetchFriends();
        }
    }, [user, isLogged]);

    const fetchFriends = async () => {
        try {
            const response = await axiosInstance.get<User[]>(`${API_URLS.BASE_URL}/users/friends?id=${user?.id}`);
            setFriends(response.data);
        } catch (error) {
            enqueueSnackbar(`Error fetching friends: ${error.response?.status ?? 'Unknown error'}`, { variant: 'error' });
            console.error('Error fetching friends:', error);
        }
    };

    const handleSearch = async (searchQuery: string) => {
        try {
            const response = await axiosInstance.get<User[]>(`${API_URLS.BASE_URL}/users/filter?user_id=${user?.id}&filter=${searchQuery}`);
            setSearchResults(response.data);
        } catch (error) {
            enqueueSnackbar(`Error searching users: ${error.response?.status ?? 'Unknown error'}`, { variant: 'error' });
            console.error('Error searching users:', error);
        }
    };

    const handleAddFriend = async (friendId: string) => {
        try {
            const url = `${API_URLS.BASE_URL}/users/friends/add?user_id=${encodeURIComponent(user.id)}&friend_id=${encodeURIComponent(friendId)}`;
            await axiosInstance.post(url);
            fetchFriends();
        } catch (error) {
            enqueueSnackbar(`Error adding friend: ${error.response?.status ?? 'Unknown error'}`, { variant: 'error' });
            console.error('Error adding friend:', error);
        }
    };

    const handleAcceptInvitation = async (friendId: string) => {
        try {
            await axiosInstance.post(`${API_URLS.BASE_URL}/users/friends/accept`, { user_id: user?.id, friend_id: friendId });
            fetchFriends();
        } catch (error) {
            enqueueSnackbar(`Error accepting invitation: ${error.response?.status ?? 'Unknown error'}`, { variant: 'error' });
            console.error('Error accepting invitation:', error);
        }
    };

    const handleRejectInvitation = async (friendId: string) => {
        try {
            await axiosInstance.post(`${API_URLS.BASE_URL}/users/friends/reject`, { user_id: user?.id, friend_id: friendId });
            fetchFriends();
        } catch (error) {
            enqueueSnackbar(`Error rejecting invitation: ${error.response?.status ?? 'Unknown error'}`, { variant: 'error' });
            console.error('Error rejecting invitation:', error);
        }
    };

    const handleRemoveFriend = async (friendId: string) => {
        try {
            await axiosInstance.post(`${API_URLS.BASE_URL}/users/friends/remove`, { user_id: user?.id, friend_id: friendId });
            fetchFriends();
        } catch (error) {
            enqueueSnackbar(`Error rejecting invitation: ${error.response?.status ?? 'Unknown error'}`, { variant: 'error' });
            console.error('Error rejecting invitation:', error);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
                <div className="relative isolate px-6 lg:px-8">
             {/* Background with gradient and blur */}
                <div
                    className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
                    aria-hidden="true"
                >
                <div
                    className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                    style={{
                        clipPath:
                            "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                    }}
                />
            </div>
            </div>

            {/* Content container */}
            <div className="container mx-auto px-4 py-8">
                {/* Friends Section */}
                <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-4">Your friends</h2>
                    {friends && friends.filter(friend => friend.status === "accepted").length > 0 ? (
                        <ul className="space-y-4">
                            {friends.filter(friend => friend.status === "accepted").map(friend => (
                                <Link to={`/users/${friend.id}`} className="hover:underline" key={friend.id}>
                                    <UserCard
                                        user={friend}
                                        actionType="removeFriend"
                                        onAction={() => handleRemoveFriend(friend.id)}
                                    />
                                </Link>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-600">You have no friends yet.</p>
                    )}
                </div>
    
                {/* Pending Invitations */}
                <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-4">Pending Invitations</h2>
                    {friends && friends.filter(friend => friend.status === "invited_by_friend").length > 0 ? (
                        <ul className="space-y-4">
                            {friends.filter(friend => friend.status === "invited_by_friend").map(friend => (
                                <UserCard
                                    user={friend}
                                    actionType="acceptInvitation"
                                    onAction={() => handleAcceptInvitation(friend.id)}
                                />
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-600">You have no pending invitations.</p>
                    )}
                </div>
    
                {/* Sent Invitations */}
                <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-4">Sent Invitations</h2>
                    {friends && friends.filter(friend => friend.status === "invited_by_user").length > 0 ? (
                        <ul className="space-y-4">
                            {friends.filter(friend => friend.status === "invited_by_user").map(friend => (
                                    <UserCard
                                        user={friend}
                                        actionType="withdrawInvitation"
                                        onAction={() => handleRejectInvitation(friend.id)}
                                    />
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-600">You have no sent invitations.</p>
                    )}
                </div>
    
                {/* Search component */}
                <Search
                    onSearch={handleSearch}
                    searchResults={searchResults}
                    friends={friends}
                    onClick={handleAddFriend}
                    userId={user?.id}
                    actionType='addFriend'
                />
            </div>
        </div>
    );
    
};

export default SearchAndAddFriends;
