

const UserStats: React.FC = () => {
    const stats = {
        projects: 5,
        followers: 100,
        following: 50,
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">User stats</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                
                <div className="bg-white rounded-lg p-4 shadow">
                    <h2 className="text-xl font-bold">{stats.projects}</h2>
                    <p>Projects</p>
                </div>
                
                <div className="bg-white rounded-lg p-4 shadow">
                    <h2 className="text-xl font-bold">{stats.followers}</h2>
                    <p>Followers</p>
                </div>
                
                <div className="bg-white rounded-lg p-4 shadow">
                    <h2 className="text-xl font-bold">{stats.following}</h2>
                    <p>Following</p>
                </div>
            </div>
        </div>
    )
}

export default UserStats;
