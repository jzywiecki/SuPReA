import React from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Avatar, { genConfig } from 'react-nice-avatar';
import { Button } from "@/components/ui/button";

// Typ akcji, która będzie wykonywana przez przyciski
type UserCardAction = 'addFriend' | 'acceptInvitation' | 'rejectInvitation' | 'removeFriend';

interface UserCardProps {
    user: User;
    actionType: UserCardAction;  // Typ akcji, którą ma obsłużyć karta
    onAction: (user: User) => void;  // Callback dla danej akcji
}

const UserCard: React.FC<UserCardProps> = ({ user, actionType, onAction }) => {
    const getButtonLabel = () => {
        switch (actionType) {
            case 'addFriend':
                return 'Add Friend';
            case 'acceptInvitation':
                return 'Accept Invitation';
            case 'rejectInvitation':
                return 'Reject Invitation';
            case 'removeFriend':
                return 'Remove Friend';
            default:
                return '';
        }
    };

    return (
        <Card className="flex justify-between shadow-md rounded-lg h-48">
            <CardContent className="flex items-center space-x-4">
                <Avatar className="w-16 h-16" {...genConfig(user.email)} />
                <div>
                    <p className="text-lg font-semibold">{user.nickname}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
            </CardContent>
            <CardFooter className="space-x-2">
                {actionType === 'acceptInvitation' && (
                    <Button
                        onClick={() => onAction(user)}
                        className="bg-green-600 text-white hover:bg-green-700 rounded-md"
                    >
                        {getButtonLabel()}
                    </Button>
                )}
                {actionType === 'rejectInvitation' && (
                    <Button
                        onClick={() => onAction(user)}
                        className="bg-red-600 text-white hover:bg-red-700 rounded-md"
                    >
                        {getButtonLabel()}
                    </Button>
                )}
                {actionType !== 'acceptInvitation' && actionType !== 'rejectInvitation' && (
                    <Button
                        onClick={() => onAction(user)}
                        className="bg-green-600 text-white hover:bg-green-700 rounded-md"
                    >
                        {getButtonLabel()}
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
};

export default UserCard;
