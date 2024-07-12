import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button";

import React from 'react';
import ProjectsView from "./ProjectsView";
import UserStats from "./UserStats";

const ProfilePage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
        <div className="rounded-lg p-6 border-b">
            <div className="flex items-center space-x-4">
                <Avatar className="w-60 h-60 rounded-full"/>
            <div>
                <h1 className="text-3xl font-bold">TurboAIGenerator</h1>
                <p className="text-gray-600">@turboaigen</p>
                <Button className="mt-2">Follow</Button>
            </div>
        </div>
    </div>

        <UserStats />

        <ProjectsView / >
    </div>
  );
};

export default ProfilePage;
