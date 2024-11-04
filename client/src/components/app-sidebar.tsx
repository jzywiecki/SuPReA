import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,

  Text,
  Lightbulb,
  Cpu,
  ShieldEllipsis,
  PersonStanding,
  Skull,
  ChevronsUp,
  Crosshair,
  Speech,
  Banknote,
  View,
  CalendarCheck,
  Database,
  FileDown,
  Image
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import ConnectionStatus from '@/components/ui/connection-status';
import { User } from '@/pages/SearchAndAddFriends';
import { useUser } from '@/components/UserProvider';
import { API_URLS } from '@/services/apiUrls';
import axiosInstance from '@/services/api';
import { socket } from '@/utils/sockets';
import { getComponentById } from '@/utils/enums';
import { GenerationResponse } from '@/utils/generation';

import { useSnackbar } from 'notistack';
import { Skeleton } from "./ui/skeleton"
const data = {
  user: {
    name: "placeholdervalue",
    email: "placeholdervalue",
    avatar: "placeholdervalue",
  },
  projects_snapshots:
    [
      {
        name: "placeholdervalue",
        logo: 'placeholdervalue',
        plan: "placeholdervalue",
      },
    ],
  navMain: [
    {
      title: "Summary",
      url: "summary",
      icon: Text,
      isActive: true,
      items: [
        {
          title: "#",
          url: "#",
          description: "Sumary for project"
        },
        // {
        //   title: "Starred",
        //   url: "#",
        // },
        // {
        //   title: "Settings",
        //   url: "#",
        // },
      ],
    },
    {
      title: "Name",
      url: "name",
      icon: Lightbulb,
      items: [
        {
          title: "#",
          url: "#",
          description: "Name for your project"
        },
      ],
    },
    //////
    {
      title: "Specifications",
      url: "specifications",
      icon: Cpu,
      items: [
        {
          title: "#",
          url: "#",
          description: "Specifications of the project"
        },
      ],
    },
    {
      title: "Requirements",
      url: "requirements",
      icon: ShieldEllipsis,
      items: [
        {
          title: "#",
          url: "#",
          description: "Functional and non-functional requirements"
        },
      ],
    },
    {
      title: "Actors",
      url: "actors",
      icon: PersonStanding,
      items: [
        {
          title: "#",
          url: "#",
          description: "Defining actors of the project"
        },
      ],
    },
    {
      title: "Risk",
      url: "risk",
      icon: Skull,
      items: [
        {
          title: "#",
          url: "#",
          description: "Risk management for your project"
        },
      ],
    },
    {
      title: "Motto",
      url: "motto",
      icon: ChevronsUp,
      items: [
        {
          title: "#",
          url: "#",
          description: "Motto for your project"
        },
      ],
    },
    {
      title: "Strategy",
      url: "strategy",
      icon: Crosshair,
      items: [
        {
          title: "#",
          url: "#",
          description: "Strategy for your project"
        },
      ],
    },
    {
      title: "Elevator speech",
      url: "elevator-speech",
      icon: Speech,
      items: [
        {
          title: "#",
          url: "#",
          description: "Content for pitching idea"
        },
      ],
    },
    {
      title: "Business scenario",
      url: "business-scenario",
      icon: Banknote,
      items: [
        {
          title: "#",
          url: "#",
          description: "Business scenario for your project"
        },
      ],
    },
    {
      title: "UML",
      url: "uml",
      icon: View,
      items: [
        {
          title: "#",
          url: "#",
          description: "UML diagrams"
        },
      ],
    },
    {
      title: "Schedule",
      url: "schedule",
      icon: CalendarCheck,
      items: [
        {
          title: "#",
          url: "#",
          description: "Estimate project schedul"
        },
      ],
    },
    {
      title: "Database diagram",
      url: "database-diagram",
      icon: Database,
      items: [
        {
          title: "#",
          url: "#",
          description: "Draw initial database diagram"
        },
      ],
    },
    {
      title: "Logo",
      url: "logo",
      icon: Image,
      items: [
        {
          title: "#",
          url: "#",
          description: "Get logos for your app"
        },
      ],
    },
  ],
  projects: [
    {
      name: "Settings",
      url: "#",
      icon: Frame,
    },

    {
      name: "AI chat",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Team chat",
      url: "#",
      icon: Map,
    },
    {
      name: "Export",
      url: "#",
      options: ["pdf"],
      icon: FileDown,
    }
  ],
}


export function AppSidebar({ onProjectClick, ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser();
  const { enqueueSnackbar } = useSnackbar();
  const { projectID } = useParams();
  const navigate = useNavigate();

  const [projectName, setProjectName] = useState<string>(null);
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isCollapsedLeft, setIsCollapsedLeft] = useState(true);
  const [isCollapsedRight, setIsCollapsedRight] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [connected, setConnected] = useState<boolean>(false);

  useEffect(() => {
    const fetchProjectName = async () => {
      try {
        const response = await axiosInstance.get(`${API_URLS.API_SERVER_URL}/projects/${projectID}`);
        setProjectName(response.data.name);
      } catch (error) {
        console.error("Error fetching project data:", error);
      }
    };
    fetchProjectName();
  }, [projectID]);

  useEffect(() => {
    if (!user?.id || !projectName) return;

    const updateData = (data, user, project) => {
      data.user = { ...user };
      data.projects_snapshots = { ...project };
      return data;
    };

    const nuser = {
      name: user.username,
      email: user.email,
      avatar: user.avatarurl,
    };

    const project = [{
      name: projectName,
      logo: GalleryVerticalEnd,
      plan: "",
    }];

    updateData(data, nuser, project);

    socket.auth = {
      projectId: projectID,
      userId: user.id,
      discussionChatOffset: 0,
      aiChatOffset: 0
    };
    socket.connect();

    const handleConnect = () => setConnected(true);
    const handleDisconnect = () => setConnected(false);
    const handleError = (err) => console.error("[ERROR]", err);

    function handleGenerationComplete(response: GenerationResponse): void {
      const component = getComponentById(response.component);
      console.log("Generated: ")
      console.log(component)
      // For Krzysiek.
      // After components generation (after creating a project), we receive notifications here.
      // You receive a notification in the format (GenerationResponse):
      // {
      //     component: "<specific id>",
      //     code: 1
      // }
      // where "component" is the ID of the component, and "code" is a constant indicating the notification type.
    }

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('error', handleError);
    socket.on('notify-generation-complete', handleGenerationComplete);

    navigate("summary");
    setIsLoading(false);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('error', handleError);
      socket.off('notify-generation-complete', handleGenerationComplete);
      socket.disconnect();
    };
  }, [user?.id, projectName]);

  const handleSearch = async (searchQuery: string) => {
    try {
      const response = await axiosInstance.get<User[]>(`${API_URLS.BASE_URL}/users/filter`, {
        params: { user_id: user?.id, filter: searchQuery }
      });
      setSearchResults(response.data);
    } catch (error) {
      enqueueSnackbar(`Error searching users: ${error.response?.status ?? 'Unknown error'}`, { variant: 'error' });
      console.error("Error searching users:", error);
    }
  };

  const toggleCollapseLeft = () => setIsCollapsedLeft((prev) => !prev);
  const toggleCollapseRight = () => setIsCollapsedRight((prev) => !prev);

  return (
    !isLoading ? (
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          {projectName && <TeamSwitcher teams={data.projects_snapshots} />}
        </SidebarHeader>
        <SidebarContent>
          <NavProjects projects={data.projects} onProjectClick={onProjectClick} />
          <NavMain items={data.navMain} />
        </SidebarContent>
        <SidebarFooter>
          <NavUser
            userInfo={data.user}
            onSearch={handleSearch}
            searchResults={searchResults}
            friends={[]}
            userId={user?.id}
            projectID={projectID}
          />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    ) : (
      <div style={{ width: "25vw", display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: "column" }}>
        <Skeleton style={{ width: "90%", height: "10%" }} />
        <Skeleton style={{ width: "90%", height: "10%" }} />
        <Skeleton style={{ width: "90%", height: "10%" }} />
        <Skeleton style={{ width: "90%", height: "10%" }} />
        <Skeleton style={{ width: "90%", height: "10%" }} />
        <Skeleton style={{ width: "90%", height: "10%" }} />
        <Skeleton style={{ width: "90%", height: "10%" }} />
        <Skeleton style={{ width: "90%", height: "10%" }} />
      </div>

    )
  );
}

