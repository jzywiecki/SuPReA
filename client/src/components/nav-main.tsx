"use client"

import { ChevronRight, Loader, type LucideIcon } from "lucide-react" // Dodaj Loader do animacji
import {
  Collapsible,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useLocation, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { useSnackbar } from "notistack"

export function NavMain({
  items,
  generationStatus,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  const navigate = useNavigate();
  const location = useLocation()
  const normalize = (str) => String(str).toLowerCase().replace(/\s|-/g, "");
  const [pathName, setPathName] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  const getGeneratedStatus = (item) => {
    if (item) {
      if (item.id) {
        const isGenerated = generationStatus && generationStatus[item.id] !== undefined && generationStatus[item.id];
        return isGenerated;
      }
    }
    return false;
  }

  const handleClick = (item) => {
    if (!generationStatus[item.id]) {
      enqueueSnackbar(`${item.title} is still generating}`, { variant: 'error' });
    } else {
      navigate(item.url);
    }
  };

  useEffect(() => {
    if (location) {
      let tmp = String(location.pathname).slice(String(location.pathname).lastIndexOf("/"), String(location.pathname).length);
      setPathName(tmp);
    }
  }, [location])



  return (
    <SidebarGroup>
      <SidebarGroupLabel>Components</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const isGenerated = getGeneratedStatus(item);
          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={item.isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem
                onClick={() => handleClick(item)}
                className={!isGenerated ? "text-gray-500" : ""}
              >
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.title}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    {normalize(pathName) === normalize("/" + item.title) ? (
                      isGenerated ? (
                        <ChevronRight className="ml-auto" />
                      ) : (null
                      )
                    ) :
                      !isGenerated ? (
                        <Loader className="ml-auto animate-spin text-gray-400" />
                      ) : (null
                      )
                    }
                  </SidebarMenuButton>
                </CollapsibleTrigger>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}

//   return (
//     <SidebarGroup>
//       <SidebarGroupLabel>Components</SidebarGroupLabel>
//       <SidebarMenu>
//         {items.map((item) => (
//           const isGenerated = generationStatus[item.id] ?? false;
//         return (
//         <Collapsible
//           key={item.title}
//           asChild
//           defaultOpen={item.isActive}
//           className="group/collapsible"
//         >
//           <SidebarMenuItem
//             onClick={() => handleClick(item.id)}
//             className={!isGenerated ? "text-red-500" : ""}
//           >
//             <CollapsibleTrigger asChild>
//               <SidebarMenuButton tooltip={item.title}>
//                 {item.icon && <item.icon />}
//                 <span>{item.title}</span>
//                 {/* <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" /> */}
//                 {normalize(pathName) === (normalize("/" + item.title)) && (
//                   <ChevronRight className="ml-auto" />
//                 )}
//               </SidebarMenuButton>
//             </CollapsibleTrigger>
//             {/* <CollapsibleContent>
//                 <SidebarMenuSub>
//                   {item.items?.map((subItem) => (
//                     <SidebarMenuSubItem key={subItem.title}>
//                       <SidebarMenuSubButton asChild>
//                         <a href={subItem.url}>
//                           <span>{subItem.description}</span>
//                         </a>
//                       </SidebarMenuSubButton>
//                     </SidebarMenuSubItem>
//                   ))}
//                 </SidebarMenuSub>
//               </CollapsibleContent> */}
//           </SidebarMenuItem>
//         </Collapsible>
//         );
//         ))}
//       </SidebarMenu>
//     </SidebarGroup>
//   )
// }
