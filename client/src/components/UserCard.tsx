import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Avatar, { genConfig } from 'react-nice-avatar';
import { Button } from "@/components/ui/button";

export default function UserCard({ user, addFriend }) {
    return (
        <Card className="flex justify-between shadow-md rounded-lg h-48">
            <CardContent className="flex items-center space-x-4">
                <Avatar className="w-16 h-16" {...genConfig(user.email)} />
                <div>
                    <p className="text-lg font-semibold">{user.nickname}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
            </CardContent>
            <CardFooter>
                <Button
                    onClick={() => addFriend(user)}
                    className="bg-green-600 text-white hover:bg-green-700 rounded-md"
                >
                    Add Friend
                </Button>
            </CardFooter>
        </Card>
    );
}