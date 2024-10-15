import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UserCard from '@/components/UserCard';
import { useUser } from "@/components/UserProvider";
import { Link } from 'react-router-dom';
import Search from '@/components/Search';
import axiosInstance from '@/services/api';
import { API_URLS } from '@/services/apiUrls';

export interface User { 
    id: string; 
    nickname: string; 
    email: string; 
    avatarurl: string; 
    status: string; 
}

const SearchAndAddFriends: React.FC = () => {
    const { user } = useUser(); 
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const [friends, setFriends] = useState<User[]>([]);

    if (!user) {
        return <div>You are not logged in!</div>; 
    }

    useEffect(() => {
        if (user) { 
            fetchFriends();
        }
    }, [user]);

    const fetchFriends = async () => {
        try {
            const response = await axiosInstance.get<User[]>(`${API_URLS.BASE_URL}/users/friends?id=${user?.id}`);
            setFriends(response.data);
        } catch (error) {
            console.error('Error fetching friends:', error);
        }
    };

    const handleSearch = async (searchQuery: string) => {
        try {
            const response = await axiosInstance.get<User[]>(`${API_URLS.BASE_URL}/users/filter?user_id=${user?.id}&filter=${searchQuery}`);
            setSearchResults(response.data);
        } catch (error) {
            console.error('Error searching users:', error);
        }
    };

    const handleAddFriend = async (friendId: string) => {
        try {
            const url = `${API_URLS.BASE_URL}/users/friends/add?user_id=${encodeURIComponent(user.id)}&friend_id=${encodeURIComponent(friendId)}`;
            await axiosInstance.post(url);
            fetchFriends(); 
        } catch (error) {
            console.error('Error adding friend:', error);
        }
    };

    const handleAcceptInvitation = async (friendId: string) => {
        try {
            await axiosInstance.post(`${API_URLS.BASE_URL}/users/friends/accept`, { user_id: user?.id, friend_id: friendId });
            fetchFriends(); 
        } catch (error) {
            console.error('Error accepting invitation:', error);
        }
    };

    const handleRejectInvitation = async (friendId: string) => {
        try {
            await axiosInstance.post(`${API_URLS.BASE_URL}/users/friends/reject`, { user_id: user?.id, friend_id: friendId });
            fetchFriends();
        } catch (error) {
            console.error('Error rejecting invitation:', error);
        }
    };

    const handleRemoveFriend = async (friendId: string) => {
        try {
            await axiosInstance.post(`${API_URLS.BASE_URL}/users/friends/remove`, { user_id: user?.id, friend_id: friendId });
            fetchFriends();      
        } catch (error) {
            console.error('Error removing friend:', error);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Your friends</h3>
                {friends && friends.length > 0 ? (
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
                    <p>You have no friends yet.</p>
                )}
            </div>
            
            {/* Pending Invitations */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Pending Invitations</h3>
                {friends && friends.length > 0 ? (
                    <ul className="space-y-4">
                        {friends.filter(friend => friend.status === "invited_by_friend").map(friend => (
                            <Link to={`/profile/${friend.id}`} className="hover:underline" key={friend.id}>
                                <UserCard
                                    user={friend}
                                    actionType="acceptInvitation"
                                    onAction={() => handleAcceptInvitation(friend.id)}
                                />
                            </Link>
                        ))}
                    </ul>
                ) : (
                    <p>You have no pending invitations.</p>
                )}
            </div>

            {/* Sent Invitations */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Sent Invitations</h3>
                {friends && friends.length > 0 ? (
                    <ul className="space-y-4">
                        {friends.filter(friend => friend.status === "invited_by_user").map(friend => (
                            <Link to={`/profile/${friend.id}`} className="hover:underline" key={friend.id}>
                                <UserCard
                                    user={friend}
                                    actionType="withdrawInvitation"
                                    onAction={() => handleRejectInvitation(friend.id)}
                                />
                            </Link>
                        ))}
                    </ul>
                ) : (
                    <p>You have no sent invitations.</p>
                )}
            </div>

            {/* Search component */}
            <Search
                onSearch={handleSearch}
                searchResults={searchResults}
                friends={friends}
                onClick={handleAddFriend}
                userId={user.id}
                actionType='addFriend'
            />
        </div>
    );
};

export default SearchAndAddFriends;
