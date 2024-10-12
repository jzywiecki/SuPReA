import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import {
    Card,
    CardContent,
} from "@/components/ui/card"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import plantumlEncoder from "plantuml-encoder";
import './styles.css'
import axios from 'axios';
import { useParams } from 'react-router-dom';
import RegenerateContext from '@/components/contexts/RegenerateContext';

interface UMLDiagram {
    code: string;
    title: string;
}

interface PlantUMLCarouselProps {
    diagrams: UMLDiagram[];
    isLoading: boolean;
}

const PlantUMLCarousel: React.FC<PlantUMLCarouselProps> = ({ diagrams, isLoading }) => {

    if (isLoading) {
        return (<div>Loading</div>)
    }
    const [currentTab, setCurrentTab] = useState<'uml' | 'code'>('code');
    const [currentDiagramIndex, setCurrentDiagramIndex] = useState(0);
    const [umlCodes, setUmlCodes] = useState<string[]>(diagrams.map(diagram => diagram.code));
    const [urls, setUrls] = useState<string[]>(diagrams.map(diagram => ''));
    const [imageLoaded, setImageLoaded] = useState<boolean[]>(diagrams.map(diagram => false));
    const [regenerate, setRegenerate] = useState(false);

    const handleTabChange = (value: 'uml' | 'code') => {
        setCurrentTab(value);
    };

    const handleCodeChange = (event: React.ChangeEvent<HTMLTextAreaElement>, index: number) => {
        const updatedCodes = [...umlCodes];
        updatedCodes[index] = event.target.value;
        setUmlCodes(updatedCodes);
        updateUrl(index, updatedCodes[index]);
    };

    useEffect(() => {
        diagrams.forEach((_, index) => updateUrl(index, umlCodes[index]));
    }, []);

    useEffect(() => {
        if (!isLoading) {
            updateUrls();
        }
    }, [umlCodes, isLoading]);

    const updateUrls = () => {
        diagrams.forEach((_, index) => updateUrl(index, umlCodes[index]));
    };

    const updateUrl = (index: number, code: string) => {
        return new Promise<void>((resolve) => {
            const encodedMarkup = plantumlEncoder.encode(code);
            const updatedUrls = [...urls];
            updatedUrls[index] = `http://www.plantuml.com/plantuml/svg/${encodedMarkup}`;
            setUrls(updatedUrls);

            const img = new Image();
            img.src = updatedUrls[index];
            img.onload = () => {
                const updatedImageLoaded = [...imageLoaded];
                updatedImageLoaded[index] = true;
                setImageLoaded(updatedImageLoaded);
                resolve();
            };
        });
    };

    const handleRegen = (index: number) => {
        const updatedCodes = [...umlCodes];
        updatedCodes[index] = updatedCodes[index] + "";
        setUmlCodes(updatedCodes);
        updateUrl(index, updatedCodes[index]);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            diagrams.forEach((_, index) => handleRegen(index));
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    return (
        (!isLoading && <div style={{ height: 'calc(100vh - 84px)' }} className="w-[100%] flex justify-center items-center">
            <Carousel className="w-11/12 flex justify-center items-center">
                <CarouselContent className=" ">
                    {diagrams.map((diagram, index) => (
                        <CarouselItem key={index} className=" flex justify-center items-center flex-col" onClick={() => setCurrentDiagramIndex(index)}>
                            <h2 className='uml-title'>{diagram.title}</h2>
                            <Tabs defaultValue="code" className="w-11/12" style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
                                <TabsList className="grid w-[40%] grid-cols-2">
                                    <TabsTrigger value="uml" onClick={() => handleTabChange('uml')}>UML</TabsTrigger>
                                    <TabsTrigger value="code" onClick={() => handleTabChange('code')}>Code</TabsTrigger>
                                </TabsList>
                                <TabsContent value="uml" className='w-[90%] flex justify-center items-center '>
                                    <Card className='w-[100%] flex justify-center items-center'>
                                        <CardContent className="space-y-2">
                                            {imageLoaded[index] ? (
                                                <motion.img alt="plantuml-graph" src={urls[index]} />
                                            ) : (
                                                <div>Loading...</div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                                <TabsContent value="code" className='w-[90%] flex justify-center items-center '>
                                    <textarea
                                        value={umlCodes[index]}
                                        onChange={(event) => handleCodeChange(event, index)}
                                        className="w-full h-[300px] p-2 border rounded flex justify-center items-center text-left"
                                        placeholder="Enter PlantUML code..."
                                    />
                                </TabsContent>
                            </Tabs>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className='m-8' />
                <CarouselNext className='m-8' />
            </Carousel>
        </div>
        )
    );
};

const UMLDiagrams: React.FC = () => {
    // const plantUMLCodes = [
    //     { code: 'Alice -> Bob : Hi', title: "Simple Greeting" },
    //     {
    //         code: `@startuml
    //         left to right direction
    //         actor Uzytkownik as User
    //         actor SystemZewnetrzny as ExternalSystem

    //         package "System Powiadomień" {
    //             usecase (Wysyłanie powiadomień o rezerwacji) as UC1
    //             usecase (Wysyłanie przypomnień o nadchodzących wydarzeniach) as UC2
    //             usecase (Wysyłanie alertów systemowych) as UC3
    //             usecase (Wysyłanie powiadomień o nowych wiadomościach) as UC4
    //         }

    //         User --> UC1
    //         User --> UC2
    //         User --> UC4
    //         ExternalSystem --> UC3

    //         note right of UC1
    //           Powiadomienia rezerwacyjne mogą być wysyłane
    //           poprzez email, SMS czy in-app notifications.
    //         end note

    //         note right of UC2
    //           Przypomnienia zawierają kalendarzowe alerty
    //           przed nadchodzącymi wydarzeniami oraz
    //           potencjalnie informacje o zmianach.
    //         end note

    //         note right of UC3
    //           Alert systemowy może być wywołany przez
    //           zasilanie awaryjne, błędy systemu,
    //           lub inne krytyczne alerty.
    //         end note

    //         note right of UC4
    //           Nowe wiadomości mogą dotyczyć komunikacji
    //           użytkownika z użytkownikiem lub
    //           systemem komunikatów.
    //         end note

    //         @enduml`, title: "Payment System"
    //     },

    // ];
    const { projectID } = useParams();
    const [plantUMLCodes, setPlantUMLCodes] = useState("");
    const [isLoading, setIsLoading] = useState(true)
    const { regenerate, setProjectRegenerateID, setComponentRegenerate } = useContext(RegenerateContext);

    function getComponentName() {
        return "uml";
    }
    const fetchData = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/model/uml/${projectID}`);
            console.log(response.data)


            if (response.data.umls) {
                setPlantUMLCodes(response.data.umls);
            }
            else {
                setPlantUMLCodes(null)
            }


        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setIsLoading(false);
        }
    }
    useEffect(() => {
        if (projectID) {
            setProjectRegenerateID(projectID);
        }
        setComponentRegenerate(getComponentName())
        fetchData();
    }, [projectID, regenerate]);

    return (plantUMLCodes ?
        <div className="App">
            <PlantUMLCarousel diagrams={plantUMLCodes} isLoading={isLoading} />
        </div>
        :
        <div>Error </div>
    );
};

export default UMLDiagrams;




// import React, { useState, useEffect, useCallback } from 'react';
// import axios from 'axios';
// import ReactFlow, {
//     ReactFlowProvider,
//     addEdge,
//     MiniMap,
//     Controls,
//     Background,
//     useNodesState,
//     useEdgesState,
//     ReactFlowInstance,
//     Handle,
//     Position
// } from 'react-flow-renderer';

// // Custom Node Component
// const CustomNode = ({ id, data }) => {
//     const handleRemoveNode = () => {
//         data.onRemove(id);
//     };

//     return (
//         <div style={{ display: 'flex', alignItems: 'center', padding: '10px', background: '#fff', border: '1px solid #ddd', borderRadius: '5px' }}>
//             <Handle type="target" position={Position.Top} />
//             <div>{data.label}</div>
//             <button style={{ marginLeft: '10px' }} onClick={handleRemoveNode}>-</button>
//             <Handle type="source" position={Position.Bottom} />
//         </div>
//     );
// };

// const nodeTypes = {
//     customNode: CustomNode
// };

// interface PlantUMLGraphProps {
//     plantUMLCode: string;
// }

// const PlantUMLGraph: React.FC<PlantUMLGraphProps> = ({ plantUMLCode }) => {
//     const [loading, setLoading] = useState(true);
//     const [nodes, setNodes, onNodesChange] = useNodesState([]);
//     const [edges, setEdges, onEdgesChange] = useEdgesState([]);
//     const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);

//     useEffect(() => {
//         const fetchParsedData = async () => {
//             try {
//                 const response = await axios.post('http://localhost:3001/parse', { plantUMLCode }, {
//                     headers: {
//                         'Content-Type': 'application/json'
//                     }
//                 });

//                 const parsedDiagramData = response.data;

//                 if (!parsedDiagramData || !Array.isArray(parsedDiagramData[0].elements)) {
//                     throw new Error("Invalid data structure");
//                 }
//                 console.log(parsedDiagramData[0].elements)
//                 const nodes = parsedDiagramData[0].elements
//                     .filter(el => el.name)
//                     .map((node, index) => ({
//                         id: node.name,
//                         type: 'customNode',
//                         data: { label: node.name, onRemove: handleRemoveNode },
//                         position: { x: 100 * index, y: 100 * index }
//                     }));

//                 const edges = parsedDiagramData[0].elements
//                     .filter(el => el.left && el.right)
//                     .map(edge => ({
//                         id: `e${edge.left}-${edge.right}`,
//                         source: edge.left,
//                         target: edge.right,
//                         label: `${edge.leftArrowBody}${edge.leftArrowHead} ${edge.rightArrowBody}${edge.rightArrowHead}`
//                     }));

//                 setNodes(nodes);
//                 setEdges(edges);
//                 setLoading(false);
//             } catch (error) {
//                 console.error('Error fetching parsed data:', error);
//                 setLoading(false);
//             }
//         };

//         fetchParsedData();
//     }, [plantUMLCode]);

//     const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);

//     const handleAddNode = () => {
//         const newNode = {
//             id: `node-${nodes.length + 1}`,
//             type: 'customNode',
//             data: { label: `Node ${nodes.length + 1}`, onRemove: handleRemoveNode },
//             position: { x: Math.random() * 250, y: Math.random() * 250 }
//         };
//         setNodes((nds) => [...nds, newNode]);
//     };

//     const handleRemoveNode = (nodeId) => {
//         setNodes((nds) => nds.filter(node => node.id !== nodeId));
//         setEdges((eds) => eds.filter(edge => edge.source !== nodeId && edge.target !== nodeId));
//     };

//     if (loading) {
//         return <div>Loading...</div>; // Placeholder for loading state
//     }

//     return (
//         <div style={{ width: '100%', height: '500px' }}>
//             <button onClick={handleAddNode}>Add Node</button>
//             <ReactFlow
//                 nodes={nodes}
//                 edges={edges}
//                 onNodesChange={onNodesChange}
//                 onEdgesChange={onEdgesChange}
//                 onConnect={onConnect}
//                 onInit={setReactFlowInstance}
//                 nodeTypes={nodeTypes}
//             >
//                 <MiniMap />
//                 <Controls />
//                 <Background />
//             </ReactFlow>
//         </div>
//     );
// };

// const UMLDiagrams: React.FC = () => {
//     const plantUMLCode = `
//       @startuml
//       Alice -> Bob: test
//       Bob --> Alice: test response
//       @enduml
//     `;

//     return (
//         <div>
//             <h1>PlantUML Graph</h1>
//             <ReactFlowProvider>
//                 <PlantUMLGraph plantUMLCode={plantUMLCode} />
//             </ReactFlowProvider>
//         </div>
//     );
// };

// export default UMLDiagrams;
