import React, { useContext, useEffect, useState } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { motion } from "framer-motion";
import {
    Card,
    CardContent,
} from '@/components/ui/card';
import './styles.css';
import axios from "axios";
import { useParams } from "react-router-dom";
import RegenerateContext from '@/components/contexts/RegenerateContext';

interface DraggableCardProps {
    name: string;
    index: number;
    moveCard: (dragIndex: number, hoverIndex: number) => void;
    incrementPriority: (index: number) => void;
    decrementPriority: (index: number) => void;
    priority: number;
    maxPriority: number;
}

const DraggableCard: React.FC<DraggableCardProps> = ({ name, index, moveCard, incrementPriority, decrementPriority, priority, maxPriority }) => {
    const ref = React.useRef<HTMLDivElement>(null);

    const [, drop] = useDrop({
        accept: 'CARD',
        hover(item: { index: number }) {
            if (!ref.current) {
                return;
            }
            const dragIndex = item.index;
            const hoverIndex = index;

            if (dragIndex === hoverIndex) {
                return;
            }

            moveCard(dragIndex, hoverIndex);

            item.index = hoverIndex;
        },
    });

    const [{ isDragging }, drag] = useDrag({
        type: 'CARD',
        item: { index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    drag(drop(ref));

    const getBackgroundColor = () => {
        const intensity = 255 - Math.floor((priority / maxPriority) * 255);
        return `rgba(${intensity}, ${intensity}, ${intensity}, 0.5)`;
    };

    return (
        <motion.div
            ref={ref}
            style={{ opacity: isDragging ? 0.5 : 1 }}
            className="motiondiv"
            onClick={() => incrementPriority(index)}
            onContextMenu={(e) => {
                e.preventDefault();
                decrementPriority(index);
            }}
            layout
        >
            <Card
                style={{
                    // backgroundColor: getBackgroundColor(),
                    boxShadow: `0px 0px 10px 1px ${getBackgroundColor()}`
                }}>
                <CardContent className="namelist-cardcontent" style={{ padding: '20px 10px' }}>
                    <h2>{name}</h2>
                    {priority > 1 ? <p className="namelist-priority">{priority}</p> : <></>}
                </CardContent>
            </Card>
        </motion.div>
    );
};

const NameList: React.FC = () => {
    const { projectID } = useParams();
    const [names, setNames] = useState<string[]>([]);
    const [priorities, setPriorities] = useState<number[]>([]);
    const { regenerate, setProjectRegenerateID, setComponentRegenerate } = useContext(RegenerateContext);

    function getComponentName() {
        return "title";
    }
    const fetchData = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/title/${projectID}`);
            setNames(response.data.names);

            setPriorities(new Array(response.data.names.length).fill(1));
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    useEffect(() => {
        if (projectID) {
            setProjectRegenerateID(projectID);
        }
        setComponentRegenerate(getComponentName())
        fetchData();
    }, [projectID, regenerate]);

    const moveCard = (dragIndex: number, hoverIndex: number) => {
        const dragCard = names[dragIndex];
        const updatedNames = [...names];
        updatedNames.splice(dragIndex, 1);
        updatedNames.splice(hoverIndex, 0, dragCard);
        setNames(updatedNames);

        const dragPriority = priorities[dragIndex];
        const updatedPriorities = [...priorities];
        updatedPriorities.splice(dragIndex, 1);
        updatedPriorities.splice(hoverIndex, 0, dragPriority);
        setPriorities(updatedPriorities);
    };

    const incrementPriority = (index: number) => {
        setPriorities(prevPriorities => {
            const newPriorities = [...prevPriorities];
            if (newPriorities[index] < names.length) {
                newPriorities[index]++;
            }
            return newPriorities;
        });
    };

    const decrementPriority = (index: number) => {
        setPriorities(prevPriorities => {
            const newPriorities = [...prevPriorities];
            if (newPriorities[index] > 0) {
                newPriorities[index]--;
            }
            return newPriorities;
        });
    };


    return (
        <div style={{ position: "relative", height: "100%" }}>
            <h1 className="namelist-title">List of names:</h1>
            <DndProvider backend={HTML5Backend}>
                <div className="namelist-container">
                    <div className="namelist-list">
                        {names.map((name, index) => (
                            <DraggableCard
                                key={name}
                                index={index}
                                name={name}
                                moveCard={moveCard}
                                incrementPriority={incrementPriority}
                                decrementPriority={decrementPriority}
                                priority={priorities[index]}
                                maxPriority={names.length}
                            />
                        ))}
                    </div>

                </div>
            </DndProvider>
        </div>

    );
};

export default NameList;
