import React from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
type UserCardAction = 'addFriend' | 'acceptInvitation' | 'rejectInvitation' | 'withdrawInvitation' | 'removeFriend';

interface UserCardProps {
    user: User;
    actionType: UserCardAction;  
    onAction: (user: User) => void;  
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
            case 'withdrawInvitation':
                return 'Withdraw Invitation';
            case 'removeFriend':
                return 'Remove Friend';
            default:
                return '';
        }
    };

    return (
        <Card className="flex justify-between shadow-md rounded-lg h-48">
            <CardContent className="flex items-center space-x-4">
            <Avatar>
                <AvatarImage src={user?.avatarurl} alt="@shadcn" />
                <AvatarFallback>?</AvatarFallback>
            </Avatar>
                <div>
                    <p className="text-lg font-semibold">{user.username}</p>
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
                {actionType === 'rejectInvitation' || actionType === 'withdrawInvitation' && (
                    <Button
                        onClick={() => onAction(user)}
                        className="bg-red-600 text-white hover:bg-red-700 rounded-md"
                    >
                        {getButtonLabel()}
                    </Button>
                )}
                {actionType !== 'acceptInvitation' && actionType !== 'rejectInvitation' && actionType !== 'withdrawInvitation' && (
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
