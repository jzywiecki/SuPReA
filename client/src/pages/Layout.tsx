import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Outlet, useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react";
import Chat from "@/components/Chat";
import { useUser } from "@/components/UserProvider";
import { API_URLS } from "@/services/apiUrls";
import axiosInstance from "@/services/api";


export default function Layout({ children }: { children: React.ReactNode }) {
    const navigate = useNavigate()
    const { projectID } = useParams();
    const { user } = useUser();

    useEffect(() => {
        navigate("summary")
    }, []);
    const [isCollapsedRight, setIsCollapsedRight] = useState(true);

    const handleProjectClick = (projectName) => {
        if (projectName === "AI chat") {
            setSidePanel('ai')
        }
        else if (projectName === "Team chat") {
            setSidePanel('discussion')
        }
        else if (projectName === "Settings") {
            navigate("settings")
        }
        else if (projectName === "Export pdf") {
            console.log(`${API_URLS.API_SERVER_URL}/download/pdf/${projectID}`)

            axiosInstance.get(`${API_URLS.API_SERVER_URL}/download/pdf/${projectID}`)
                .then(response => { // TODO: test if this works
                    console.log(response.data);
                    const blob = response.blob();
                    const url = window.URL.createObjectURL(blob);

                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `project_${projectID}.pdf`;
                    link.click();

                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(link);
                })
                .catch(error => {
                    console.error("There was an error fetching dowloading pdf!", error);
                });
        }
        else {
            setSidePanel(null)
        }

    };
    const [sidePanel, setSidePanel] = useState(null);

    return (
        <SidebarProvider>
            <AppSidebar onProjectClick={handleProjectClick} />
            <div style={{ display: "flex", flexDirection: "row", width: '100%', height: "100%" }}>
                <main style={{ width: "100%", position: 'relative' }}>
                    <SidebarTrigger style={{ position: 'absolute', left: '0', zIndex: '10' }} />
                    {children}
                    <Outlet />
                </main>
                <Chat
                    isCollapsed={isCollapsedRight}
                    key_info={sidePanel}
                    onProjectClick={handleProjectClick}
                />
            </div>

        </SidebarProvider>
    )
}
