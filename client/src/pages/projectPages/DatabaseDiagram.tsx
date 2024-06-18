import React, { useState, useCallback, useRef, useContext, useEffect } from 'react';
import ReactFlow, {
    addEdge,
    Background,
    Controls,
    MiniMap,
    updateEdge,
    useEdgesState,
    useNodesState,
    Handle,
    ReactFlowProvider,
    useReactFlow,
    useViewport
} from 'react-flow-renderer';
import { v4 as uuidv4 } from 'uuid';
// import 'reactflow/dist/style.css';
import { useParams } from 'react-router-dom';
import RegenerateContext from '@/components/contexts/RegenerateContext';
import axios from 'axios';

const initialSchema = {
    "schema": [
        {
            "Users": {
                "user_id": "INT PK",
                "username": "VARCHAR(50)",
                "email": "VARCHAR(100)",
                "password": "VARCHAR(100)"
            }
        },

        {
            "Bookings": {
                "user_id": "INT FK",
                "date": "DATE",
                "status": "ENUM()"
            }
        }
    ],
    "relationships": [
        "Users ||--o{ Bookings : books",
    ]
};

const generateFlowElements = (schema) => {
    const nodes = [];
    const edges = [];


    schema.schema.forEach((entity, index) => {
        for (const entityName in entity) {
            const attributes = entity[entityName];
            let attributeList = Object.entries(attributes).map(([key, value]) => {
                return (
                    <tr key={key}>
                        <td style={{ border: '0px solid #ddd', padding: '8px', textAlign: 'left' }}>{key}</td>
                        <td style={{ border: '0px solid #ddd', padding: '8px', textAlign: 'left' }}>{value}</td>
                    </tr>
                );
            });

            nodes.push({
                id: entityName,
                data: {
                    label: (
                        <div style={{ textAlign: 'left' }}>
                            <strong>{entityName}</strong>
                            <table style={{ marginTop: '5px', borderCollapse: 'collapse' }}>
                                <tbody>
                                    {attributeList}
                                </tbody>
                            </table>
                        </div>
                    ),
                },
                position: { x: 100 + index * 300, y: 100 },
                style: { border: '1px solid #ddd', padding: '10px', borderRadius: '5px', background: '#fff' },
            });
        }
    });


    schema.relationships.forEach((relationship, index) => {
        const [entity1, connector, entity2, label] = relationship.split(' ');
        if (entity1 && entity2) {
            edges.push({
                id: `e-${entity1}-${entity2}-${index}`,
                source: entity1,
                target: entity2,
                type: 'smoothstep',
                animated: true,
                label: label,
            });
        }
    });

    return { nodes, edges };
};

const DatabaseNode = ({ data }) => {
    const [label, setLabel] = useState(data.label);
    return (
        <div>
            <textarea
                style={{ width: '100%', height: '100px' }}
                value={label}
                onChange={(e) => setLabel(e.target.value)}
            />
            <Handle type="source" position="right" id="a" />
            <Handle type="target" position="left" id="b" />
        </div>
    );
};

const nodeTypes = { databaseNode: DatabaseNode };

const DatabaseDiagram = () => {
    const { nodes: initialNodes, edges: initialEdges } = generateFlowElements(initialSchema);
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const reactFlowWrapper = useRef(null);
    const connectingNodeId = useRef(null);
    const { x, y, zoom } = useViewport();

    const { projectID } = useParams();
    const { regenerate, setProjectRegenerateID, setComponentRegenerate } = useContext(RegenerateContext);

    function getComponentName() {
        return "database_schema";
    }

    const fetchData = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/database_schema/${projectID}`);
            console.log(response.data);
            const { nodes: initialNodes, edges: initialEdges } = generateFlowElements(response.data);
            setNodes(initialNodes);
            setEdges(initialEdges);

            // setContent(response.data.content);

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        if (projectID) {
            setProjectRegenerateID(projectID);
        }
        setComponentRegenerate(getComponentName())
        fetchData();
    }, [projectID, regenerate]);



    const onConnect = useCallback(
        (params) => {
            connectingNodeId.current = null;
            setEdges((eds) => addEdge(params, eds));
        },
        [setEdges]
    );

    const onConnectStart = useCallback((_, { nodeId }) => {
        connectingNodeId.current = nodeId;
    }, []);

    const onConnectEnd = useCallback(
        (event) => {
            if (!connectingNodeId.current) return;

            const targetIsPane = event.target.classList.contains('react-flow__pane');

            if (targetIsPane) {
                const rect = reactFlowWrapper.current.getBoundingClientRect();
                const id = uuidv4();
                const newNode = {
                    id,
                    position: {
                        x: (event.clientX - rect.left - x) / zoom,
                        y: (event.clientY - rect.top - y) / zoom,
                    },
                    data: { label: `New Table` },
                    type: 'databaseNode',
                    style: { border: '1px solid #ddd', padding: 10, borderRadius: 5, background: '#fff' },
                };

                setNodes((nds) => nds.concat(newNode));
                setEdges((eds) =>
                    eds.concat({ id, source: connectingNodeId.current, target: id })
                );
            }
        },
        [setNodes, setEdges, x, y, zoom]
    );

    const addNode = useCallback((event) => {
        const rect = reactFlowWrapper.current.getBoundingClientRect();
        const id = uuidv4();
        const newNode = {
            id,
            data: { label: 'New Table' },
            position: { x: (event.clientX - rect.left - x) / zoom, y: (event.clientY - rect.top - y) / zoom },
            type: 'databaseNode',
            style: { border: '1px solid #ddd', padding: 10, borderRadius: 5, background: '#fff' },
        };
        setNodes((nds) => [...nds, newNode]);
    }, [setNodes, x, y, zoom]);

    const onNodeDoubleClick = useCallback((event, node) => {
        setNodes((nds) => nds.filter((n) => n.id !== node.id));
    }, [setNodes]);

    return (
        <div style={{ height: 600 }} ref={reactFlowWrapper}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onConnectStart={onConnectStart}
                onConnectEnd={onConnectEnd}
                onNodeDoubleClick={onNodeDoubleClick}
                nodeTypes={nodeTypes}
                fitView
                fitViewOptions={{ padding: 2 }}
                nodeOrigin={[0.5, 0]}
            >
                <Background />
                <Controls />
                {/* <MiniMap /> */}
            </ReactFlow>
        </div>
    );
};

export default () => (
    <ReactFlowProvider>
        <DatabaseDiagram />
    </ReactFlowProvider>
);


// import React, { useEffect, useRef, useState } from 'react';
// import Mermaid from "./Mermaid"
// interface Schema {
//     schema: Array<Record<string, Record<string, string>>>;
//     relationships: string[];
// }

// const jsonToMermaid = (json_data: Schema) => {
//     let mermaid_code = 'erDiagram\n';
//     json_data.schema.forEach(entity => {
//         for (const entity_name in entity) {
//             mermaid_code += `    ${entity_name} {\n`;
//             const attributes = entity[entity_name];
//             for (const attribute in attributes) {
//                 mermaid_code += `        ${attribute} ${attributes[attribute]}\n`;
//             }
//             mermaid_code += '    }\n\n';
//         }
//     });

//     json_data.relationships.forEach(relationship => {
//         const [entity1, rest] = relationship.split(' ', 2);
//         const [connector, entity2, label] = rest.split(' ', 3);
//         const formattedConnector = connector.replace('o', '|');
//         mermaid_code += `    ${entity1} ${formattedConnector} ${entity2} : ${label}\n`;
//     });
//     return mermaid_code;
// };

// const DatabaseDiagram = () => {
//     const containerRef = useRef<HTMLDivElement>(null);
//     const schema = {
//         "schema": [
//             {
//                 "Users": {
//                     "user_id": "INT PK",
//                     "username": "VARCHAR(50)",
//                     "email": "VARCHAR(100)",
//                     "password": "VARCHAR(100)"
//                 }
//             },
//             {
//                 "Cars": {
//                     "car_id": "INT PK",
//                     "brand": "VARCHAR(50)",
//                     "model": "VARCHAR(50)",
//                     "year": "INT",
//                     "color": "VARCHAR(20)",
//                     "seats": "INT"
//                 }
//             },
//             {
//                 "Locations": {
//                     "location_id": "INT PK",
//                     "name": "VARCHAR(100)",
//                     "address": "VARCHAR(255)"
//                 }
//             },
//             {
//                 "Bookings": {
//                     "booking_id": "INT PK",
//                     "car_id": "INT FK",
//                     "user_id": "INT FK",
//                     "pickup_location_id": "INT FK",
//                     "dropoff_location_id": "INT FK",
//                     "date": "DATE",
//                     "status": "ENUM(Pending_Confirmed_Completed_Cancelled)"
//                 }
//             }
//         ],
//         "relationships": [
//             "Users ||--o{ Bookings : books",
//             "Cars ||--o{ Bookings : reserved",
//             "Locations ||--o{ Bookings : pickup",
//             "Locations ||--o{ Bookings : dropoff"
//         ]
//     };
//     const [code, setCode] = useState(`graph TD;\n  A-->B;\n  A-->C;\n  B-->D;\n  C-->D;`);


//     useEffect(() => {
//         const trawerse = jsonToMermaid(schema);
//         setCode(trawerse);
//     }, []);



//     return (
//         <div>
//             <Mermaid chart={code} />
//         </div>
//     );
// };
// export default DatabaseDiagram;
