import React, { useState } from 'react';
import axios from 'axios';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import UserCard from '@/components/UserCard';

interface User {
    id: string;
    nickname: string;
    email: string;
    avatar_id: string;
}

const SearchAndAddFriends: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [searchResults, setSearchResults] = useState<User[]>([]);

    const handleSearch = async () => {
        if (!searchQuery) return;

        try {
            const response = await axios.get<User[]>(`http://localhost:3333/users`);
            setSearchResults(response.data);
        } catch (error) {
            console.error('Error searching users:', error);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
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
                    <h3 className="text-lg font-semibold mb-4">Search Results:</h3>
                    <ul className="space-y-4">
                        {searchResults.map(user => (
                           <UserCard key={user.id} user={user} /> 
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default SearchAndAddFriends;