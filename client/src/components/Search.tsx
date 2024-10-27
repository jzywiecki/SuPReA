import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import UserCard from '@/components/UserCard';
import { User } from '@/pages/SearchAndAddFriends';

type UserCardAction = 'addFriend' | 'acceptInvitation' | 'rejectInvitation' | 'withdrawInvitation' | 'removeFriend' | 'addMember';

interface SearchProps {
    onSearch: (query: string) => void;
    searchResults: User[];
    friends: User[];
    onClick: (friendId: string) => void;
    userId: string;
    actionType: UserCardAction;  // Add the actionType prop here
}

const Search: React.FC<SearchProps> = ({ onSearch, searchResults, friends, onClick, userId, actionType }) => {
    const [searchQuery, setSearchQuery] = useState<string>('');

    const handleSearch = () => {
        if (searchQuery.trim()) {
            onSearch(searchQuery);
        }
    };

    return (
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

            {searchResults.length > 0 && (
                <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-4">Search Results</h3>
                    <div className="space-y-4 overflow-y-auto" style={{ maxHeight: '300px' }}>
                        {searchResults
                            .filter(result => userId !== result.id && !friends.flatMap(friend => friend.id).includes(result.id))
                            .map(user => (

                                <UserCard
                                    user={user}
                                    actionType={actionType}  // Pass the actionType prop here
                                    onAction={() => onClick(user.id)}
                                />
                            ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Search;
