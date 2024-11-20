import { useEffect, useState } from 'react';
import 'tailwindcss/tailwind.css';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { useUser } from '@/components/UserProvider';
import axiosInstance from '@/services/api';
import { API_URLS } from '@/services/apiUrls';
import { useSnackbar } from 'notistack';
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MdSupervisorAccount } from "react-icons/md";
import { Skeleton } from "@/components/ui/skeleton"
import { MdOutlineFreeCancellation } from "react-icons/md";
import ProjectDetails from './ProjectDetails';

// type Project = {
//     id: string;
//     name: string;
//     description: string;
//     created_at: string;
//     additional_info: string;
//     doing_what: string;
//     for_who: string;
//     owner: string;
//     members: string[];
//     actors: {
//         actors: string[];
//     };
//     business_scenarios: {
//         business_scenario: Record<string, unknown>;
//     };
//     elevator_speech: {
//         content: string;
//     };
//     motto: {
//         motto: string;
//     };
//     project_schedule: {
//         milestones: Record<string, unknown>[];
//     };
//     requirements: {
//         functional_requirements: Record<string, unknown>[];
//         non_functional_requirements: Record<string, unknown>[];
//     };
//     risks: {
//         risks: Record<string, unknown>[];
//     };
//     specifications: {
//         specifications: Record<string, unknown>[];
//     };
//     strategy: {
//         strategy: string;
//     };
//     title: {
//         names: string[];
//     };
// };

const ProjectList = ({ projects, onSelect, selectedProjectId, sortOrder, toggleSortOrder, searchQuery, setSearchQuery }) => {
    const filteredProjects = projects
        .filter((project) => project.name.toLowerCase().includes(searchQuery.toLowerCase()) || project.description.toLowerCase().includes(searchQuery.toLowerCase()))
        .sort((a, b) => sortOrder === "newest" ? new Date(b.created_at) - new Date(a.created_at) : new Date(a.created_at) - new Date(b.created_at));

    return (
        <div className="h-[calc(100vh-5rem)]">
            <div className='project-list-header'>
                <h1>Your Projects</h1>
                <TabsList>
                    <TabsTrigger value="owned">Owned</TabsTrigger>
                    <TabsTrigger value="member">Member</TabsTrigger>
                </TabsList>
            </div>
            <Separator />
            <div className="project-list-searchbar">
                <Input type="search" placeholder="Search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                <button onClick={toggleSortOrder} className="project-list-sortbutton">
                    {sortOrder === "newest" ? "Newest" : "Oldest"}
                </button>
            </div>
            <ScrollArea className="project-list-container">
            {filteredProjects.map((project) => (
    <div
        key={project.id}
        className={`project-list-menu-item ${selectedProjectId === project.id ? 'bg-gray-200' : ''}`}
        onClick={() => onSelect(project)}
    >
        <div className='project-list-menu-item-header'>
            <h1>{project.name}</h1>
            <p>{new Date(project.created_at).toLocaleDateString("pl-PL", { month: "numeric", day: "numeric" })}</p>
        </div>
        <p className='project-list-menu-item-description'>
            {project.description.length > 40 
                ? `${project.description.slice(0, 40)}...` 
                : project.description}
        </p>
        <p className='project-list-menu-item-members'>
            <MdSupervisorAccount /> {project.members.length + 1}
        </p>
    </div>
))}

            </ScrollArea>
        </div>
    );
};

const SkeletonLoading = () => (
    <div className="flex justify-center items-around">
        <div className="w-[35%] h-30 space-y-3">
            <Skeleton className="h-40 w-80" />
            <Skeleton className="h-40 w-80" />
            <Skeleton className="h-40 w-80" />
        </div>
        <div className="w-[60%] flex justify-center items-center">
            <Skeleton className="h-[80vh] w-full rounded-xl" />
        </div>
    </div>
);

const NoProjects = () => (
    <div className="flex flex-col items-center justify-center h-4/5">
        <MdOutlineFreeCancellation size={50} className="text-red-700" />
        <h2 className="my-4 text-4xl font-medium">You seem to not participate in any project.</h2>
        <div className='flex space-x-4'>
            <Link to={`/collaborators`}><Button>Search for project owner</Button></Link>
            <Link to={`/create-project`}><Button className='bg-green-600 text-white'>Create your own</Button></Link>
        </div>
    </div>
);

const ProjectsView = () => {
    const { user } = useUser();
    const [projects, setProjects] = useState({ owner: [], member: [] });
    const [loading, setLoading] = useState(true);
    const { enqueueSnackbar } = useSnackbar();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedProject, setSelectedProject] = useState(null);
    const [sortOrder, setSortOrder] = useState("newest");

    useEffect(() => {
        const fetchProjects = async () => {
            if (!user?.id) return;
            try {
                const response = await axiosInstance.get(`${API_URLS.API_SERVER_URL}/projects/list/${user.id}`);
                const processedOwnerProjects = response.data.owner.map((project) => ({
                    ...project,
                    members: project.members.filter(member => member !== project.owner),
                }));
                const processedMemberProjects = response.data.member.map((project) => ({
                    ...project,
                    members: project.members.filter(member => member !== project.owner),
                }));
                setProjects({ owner: processedOwnerProjects, member: processedMemberProjects });
                setSelectedProject(processedOwnerProjects[0] || null);
            } catch (error) {
                enqueueSnackbar(`Error fetching projects ${error.response?.status ?? 'Unknown error'}`, { variant: 'error' });
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, [user?.id]);

    const toggleSortOrder = () => setSortOrder((prevSortOrder) => prevSortOrder === "newest" ? "oldest" : "newest");

    if (loading) return <SkeletonLoading />;
    if (!projects.owner.length && !projects.member.length) return <NoProjects />;

    return (
        <div className="h-[calc(100vh-5rem)]" style={{ padding: '0 1rem 1rem 1rem' }}>
            <Tabs defaultValue="owned">
                <TabsContent value="owned">
                    <ResizablePanelGroup direction="horizontal" className="rounded-lg border">
                        <ResizablePanel defaultSize={35} minSize={25}>
                            <ProjectList
                                projects={projects.owner}
                                onSelect={setSelectedProject}
                                selectedProjectId={selectedProject?.id}
                                sortOrder={sortOrder}
                                toggleSortOrder={toggleSortOrder}
                                searchQuery={searchQuery}
                                setSearchQuery={setSearchQuery}
                            />
                        </ResizablePanel>
                        <ResizableHandle withHandle />
                        <ResizablePanel>
                            <ProjectDetails project={selectedProject} />
                        </ResizablePanel>
                    </ResizablePanelGroup>
                </TabsContent>

                <TabsContent value="member">
                    <ResizablePanelGroup direction="horizontal" className="rounded-lg border">
                        <ResizablePanel defaultSize={35} minSize={25}>
                            <ProjectList
                                projects={projects.member}
                                onSelect={setSelectedProject}
                                selectedProjectId={selectedProject?.id}
                                sortOrder={sortOrder}
                                toggleSortOrder={toggleSortOrder}
                                searchQuery={searchQuery}
                                setSearchQuery={setSearchQuery}
                            />
                        </ResizablePanel>
                        <ResizableHandle withHandle />
                        <ResizablePanel>
                            <ProjectDetails project={selectedProject} />
                        </ResizablePanel>
                    </ResizablePanelGroup>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default ProjectsView;