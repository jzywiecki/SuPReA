import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Outlet, useNavigate, useParams, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Chat from "@/components/Chat";
import { API_URLS } from "@/services/apiUrls";
import axiosInstance from "@/services/api";
import { useSnackbar } from 'notistack';
import { ScrollArea } from "@/components/ui/scroll-area";
import { checkProjectExists } from '../services/checkProjectExists';

type SidePanelType = 'ai' | 'discussion' | null;

export default function Layout({ children }: { children: React.ReactNode }) {
    const navigate = useNavigate();
    const { projectID } = useParams<{ projectID: string }>();
    const { enqueueSnackbar } = useSnackbar();
    const [sidePanel, setSidePanel] = useState<SidePanelType>(null);
    const [isValidProject, setIsValidProject] = useState<boolean | null>(null);

    useEffect(() => {
        async function validateProject() {
            if (projectID) {
                const exists = await checkProjectExists(projectID);
                setIsValidProject(exists);
            } else {
                setIsValidProject(false);
            }
        }

        validateProject();
    }, [projectID]);

    useEffect(() => {
        if (!isValidProject) {
            navigate("summary");
        }
    }, [isValidProject, navigate]);

    const handleDownloadPDF = async () => {
        if (!projectID) return;

        try {
            enqueueSnackbar(`Exporting...`, { variant: 'info' });
            const response = await axiosInstance.get(`${API_URLS.API_SERVER_URL}/download/pdf/${projectID}`, { responseType: 'blob' });
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = `project_${projectID}.pdf`;
            link.click();

            window.URL.revokeObjectURL(url);
        } catch (error) {
            enqueueSnackbar(`Error downloading PDF: ${error.response?.status ?? 'Unknown error'}`, { variant: 'error' });
        }
    };

    const handleProjectClick = (projectName: string) => {
        switch (projectName) {
            case "AI chat":
                setSidePanel('ai');
                break;
            case "Team chat":
                setSidePanel('discussion');
                break;
            case "Settings":
                navigate("settings");
                break;
            case "Export":
                break;
            case "Export pdf":
                setSidePanel(sidePanel);
                handleDownloadPDF();
                break;
            default:
                setSidePanel(null);
        }
    };

    if (isValidProject === null) {
        return <div>Loading...</div>;
    }

    if (!isValidProject) {
        return <Navigate to="/not-found" replace />;
    }

    return (
        <SidebarProvider>
            <AppSidebar onProjectClick={handleProjectClick} />
            <div style={{ display: "flex", flexDirection: "row", width: '100%', height: "100%" }}>
                <main style={{ width: "100%", position: 'relative' }}>
                    <SidebarTrigger style={{ position: 'absolute', left: '0', zIndex: '10' }} />
                    {children}
                    <ScrollArea className="h-screen w-full rounded-md border p-0">
                        <Outlet />
                    </ScrollArea>
                </main>
                <Chat
                    key_info={sidePanel}
                    onProjectClick={handleProjectClick}
                />
            </div>
        </SidebarProvider>
    );
}
