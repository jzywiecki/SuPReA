import React, { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import "./styles.css";
import { useParams } from "react-router-dom";
import axios from "axios";

interface Risk {
    risk: string;
    description: string;
    prevention: string;
}

const ItemType = {
    RISK: "risk",
};

const DraggableRisk: React.FC<{ risk: Risk, index: number, moveRisk: (dragIndex: number, hoverIndex: number) => void }> = ({ risk, index, moveRisk }) => {
    const [, ref] = useDrag({
        type: ItemType.RISK,
        item: { index },
    });

    const [, drop] = useDrop({
        accept: ItemType.RISK,
        hover: (draggedItem: { index: number }) => {
            if (draggedItem.index !== index) {
                moveRisk(draggedItem.index, index);
                draggedItem.index = index;
            }
        },
    });

    return (
        <motion.li
            ref={(node) => ref(drop(node))}
            layout
            className="risk-item"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <strong>{risk.risk}:</strong> {risk.description} <br/>
            <strong>How to prevent it?: </strong>{risk.prevention}
        </motion.li>
    );
};


const RiskList: React.FC = () => {
    const { projectID } = useParams();
    const [risks, setRisks] = useState<Risk[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/risks/${projectID}`);
                console.log(response.data.risks);
                setRisks(response.data.risks);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        fetchData();

    }, [projectID]);

    const moveRisk = (dragIndex: number, hoverIndex: number) => {
        const updatedRisks = Array.from(risks);
        const [movedRisk] = updatedRisks.splice(dragIndex, 1);
        updatedRisks.splice(hoverIndex, 0, movedRisk);
        setRisks(updatedRisks);
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div className='riskList-container'>
                <h2>Lista ryzyk</h2>
                <AnimatePresence>
                    <motion.div
                        key="risks"
                        initial={{ opacity: 0, x: -100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 100 }}
                        transition={{ duration: 0.5 }}
                        className="risks-container"
                    >
                        <ScrollArea style={{ height: 'calc(100vh - 84px)' }} className="list-none p-0 w-[90%] flex justify-center flex-col items-start ">
                            {risks.map((risk, index) => (
                                <DraggableRisk
                                    key={risk.risk}
                                    risk={risk}
                                    index={index}
                                    moveRisk={moveRisk}
                                />
                            ))}
                        </ScrollArea>
                    </motion.div>
                </AnimatePresence>
            </div>
        </DndProvider>
    );
}

export default RiskList;
