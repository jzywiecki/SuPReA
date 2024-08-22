import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import UserCard from '@/components/UserCard';
import { useUser } from "@/components/UserProvider"; 

interface User {
    id: string;
    nickname: string;
    email: string;
    avatar_id: string;
    status: string;
}

const SearchAndAddFriends: React.FC = () => {
    const { user } = useUser(); 
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const [friends, setFriends] = useState<User[]>([]);

    if (!user) {
        return <div>You are not logged in!</div>; 
    }

    useEffect(() => {
        if (user) { 
            console.log(user)
            fetchFriends();
        }
    }, [user]); 

    const fetchFriends = async () => {
        try {
            const response = await axios.get<User[]>(`http://localhost:3333/users/friends?id=${user?.id}`);
            console.log(response)
            setFriends(response.data);
        } catch (error) {
            console.error('Error fetching friends:', error);
        }
    };

    const handleSearch = async () => {
        if (!searchQuery) return;

        try {
            const response = await axios.get<User[]>(`http://localhost:3333/users/filter?user_id=${user?.id}&filter=${searchQuery}`);
            setSearchResults(response.data);
        } catch (error) {
            console.error('Error searching users:', error);
        }
    };

    const handleAddFriend = async (friend_id: string) => {
        try {
            console.log(user?.id)
            const url = `http://localhost:3333/users/friends/add?user_id=${encodeURIComponent(user.id)}&friend_id=${encodeURIComponent(friend_id)}`;

            await axios.post(url);  
            fetchFriends(); 
        } catch (error) {
            console.error('Error adding friend:', error);
        }
    };

    const handleAcceptInvitation = async (friendId: string) => {
        try {
            await axios.post(`http://localhost:3333/users/friends/accept`, { userId: user?.id, friendId });
            fetchFriends(); 
        } catch (error) {
            console.error('Error accepting invitation:', error);
        }
    };

    const handleRejectInvitation = async (friendId: string) => {
        try {
            await axios.post(`http://localhost:3333/users/friends/reject`, { userId: user?.id, friendId });
        } catch (error) {
            console.error('Error rejecting invitation:', error);
        }
    };

    const handleRemoveFriend = async (friendId: string) => {
        try {
            await axios.post(`http://localhost:3333/users/friends/remove`, { user_id: user?.id, friend_id: friendId });
            fetchFriends(); 
        } catch (error) {
            console.error('Error removing friend:', error);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Your friends</h3>
                {friends.length > 0 ? (
                    <ul className="space-y-4">
                        {friends.filter(friend => friend.status == "accepted").map(friend => (
                            <UserCard 
                                key={friend.id} 
                                user={friend} 
                                actionType="removeFriend" 
                                onAction={() => handleRemoveFriend(friend.id)} 
                            />
                        ))}
                    </ul>
                ) : (
                    <p>You have no friends yet.</p>
                )}
            </div>
            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Pending Invitations</h3>
                {friends.length > 0 ? (
                    <ul className="space-y-4">
                        {friends.filter(friend => friend.status == "invited_by_friend").map(friend => (
                            <UserCard 
                                key={friend.id} 
                                user={friend} 
                                actionType="acceptInvitation" 
                                onAction={() => handleAcceptInvitation(friend.id)} 
                            />
                        ))}
                    </ul>
                ) : (
                    <p>You have no pending invitations.</p>
                )}
            </div>
            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Sent Invitations</h3>
                {friends.length > 0 ? (
                    <ul className="space-y-4">
                        {friends.filter(friend => friend.status == "invited_by_user").map(friend => (
                            <UserCard 
                                key={friend.id} 
                                user={friend} 
                                actionType="rejectInvitation" 
                                onAction={() => handleRejectInvitation(friend.id)} 
                            />
                        ))}
                    </ul>
                ) : (
                    <p>You have no sent invitations.</p>
                )}
            </div>
            <div className="mb-6">
                <label htmlFor="search" className="block text-sm font-semibold leading-6">
                    Search Users
                </label>
                <div className="mt-2.5 flex">
                    <Input
                        id="search"
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Enter nickname or email"
                        className="flex-grow"
                    />
                    <Button
                        onClick={handleSearch}
                        className="ml-2 bg-indigo-600 text-white px-4 py-2 rounded-md"
                    >
                        Search
                    </Button>
                </div>
            </div>

            {searchResults.length > 0 && (
                <div>
                    <h3 className="text-lg font-semibold mb-4">Search Results</h3>
                    <ul className="space-y-4">
                        {searchResults.map(user => (
                            <UserCard 
                                key={user.id} 
                                user={user} 
                                actionType="addFriend" 
                                onAction={() => handleAddFriend(user.id)} 
                            />
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default SearchAndAddFriends;
