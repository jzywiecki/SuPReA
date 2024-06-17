import React, { useState, useEffect, useContext } from 'react';
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { motion, AnimatePresence } from "framer-motion";
import { RiFunctionAddLine } from "react-icons/ri";
import { RiRefundLine } from "react-icons/ri";
import { ScrollArea } from "@/components/ui/scroll-area";
import "./styles.css";
import { useParams } from "react-router-dom";
import axios from 'axios';
import RegenerateContext from '@/components/contexts/RegenerateContext';


interface Requirement {
    name: string;
    description: string;
}

const ItemType = {
    REQUIREMENT: "requirement",
};

const DraggableRequirement: React.FC<{ requirement: Requirement, index: number, moveRequirement: (dragIndex: number, hoverIndex: number) => void }> = ({ requirement, index, moveRequirement }) => {
    const [, ref] = useDrag({
        type: ItemType.REQUIREMENT,
        item: { index },
    });

    const [, drop] = useDrop({
        accept: ItemType.REQUIREMENT,
        hover: (draggedItem: { index: number }) => {
            if (draggedItem.index !== index) {
                moveRequirement(draggedItem.index, index);
                draggedItem.index = index;
            }
        },
    });

    return (
        <motion.li
            ref={(node) => ref(drop(node))}
            layout
            className="requirement-item"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <strong>{requirement.name}:</strong> {requirement.description}
        </motion.li>
    );
};

const RequirementsList: React.FC = () => {
    const { projectID } = useParams();
    const [functionalRequirements, setFunctionalRequirements] = useState<Requirement[]>([]);
    const [nonFunctionalRequirements, setNonFunctionalRequirements] = useState<Requirement[]>([]);
    const [showFunctional, setShowFunctional] = useState<boolean>(true);
    const { regenerate, setProjectRegenerateID, setComponentRegenerate } = useContext(RegenerateContext);

    function getComponentName() {
        return "requirements";
    }

    const fetchData = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/requirements/${projectID}`);
            setFunctionalRequirements(response.data.functional_requirements);
            setNonFunctionalRequirements(response.data.non_functional_requirements);
            if (projectID) {
                setProjectRegenerateID(projectID);
            }
            setComponentRegenerate(getComponentName())
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    useEffect(() => {

        fetchData();

    }, [projectID, regenerate]);


    const moveRequirement = (dragIndex: number, hoverIndex: number, items: Requirement[], setItems: React.Dispatch<React.SetStateAction<Requirement[]>>) => {
        const updatedItems = Array.from(items);
        const [movedItem] = updatedItems.splice(dragIndex, 1);
        updatedItems.splice(hoverIndex, 0, movedItem);
        setItems(updatedItems);
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div>
                <div className='checkbox-container'>
                    <div className="checkbox">
                        <input id="checkbox_toggle" type="checkbox" className="check" onChange={() => setShowFunctional(!showFunctional)} checked={showFunctional} />
                        <label className="slide" htmlFor="checkbox_toggle">
                            <span className="toggle"></span>
                            <span className="text">{<RiRefundLine />}</span>
                            <span className="text">{<RiFunctionAddLine />}</span>
                        </label>
                    </div>
                    <h2>{showFunctional ? 'Funkcjonalne' : 'Niefunkcjonalne'}</h2>
                </div>

                <AnimatePresence >
                    <motion.div
                        key={showFunctional ? "functional" : "nonfunctional"}
                        initial={{ opacity: 0, x: -100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 100 }}
                        transition={{ duration: 0.5 }}
                        className="requirements-container"
                    >
                        <ScrollArea style={{ height: 'calc(100vh - 84px)' }} className="requirements-list">
                            {(showFunctional ? functionalRequirements : nonFunctionalRequirements).map((requirement, index) => (
                                <DraggableRequirement
                                    key={requirement.name}
                                    requirement={requirement}
                                    index={index}
                                    moveRequirement={(dragIndex, hoverIndex) => moveRequirement(dragIndex, hoverIndex, showFunctional ? functionalRequirements : nonFunctionalRequirements, showFunctional ? setFunctionalRequirements : setNonFunctionalRequirements)}
                                />
                            ))}
                        </ScrollArea>
                    </motion.div>
                </AnimatePresence>
            </div>
        </DndProvider>
    );
}


export default RequirementsList;