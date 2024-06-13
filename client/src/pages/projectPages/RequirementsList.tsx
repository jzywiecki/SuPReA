import React, { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { motion, AnimatePresence } from "framer-motion";
import { RiFunctionAddLine } from "react-icons/ri";
import { RiRefundLine } from "react-icons/ri";
import { ScrollArea } from "@/components/ui/scroll-area";
import "./styles.css";


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
    const [functionalRequirements, setFunctionalRequirements] = useState<Requirement[]>([]);
    const [nonFunctionalRequirements, setNonFunctionalRequirements] = useState<Requirement[]>([]);
    const [showFunctional, setShowFunctional] = useState<boolean>(true);

    useEffect(() => {
        const mockedData = {
            functional_requirements: [
                {
                    name: "Rejestracja użytkowników",
                    description: "Możliwość rejestracji właścicieli psów w aplikacji"
                },
                {
                    name: "Tworzenie profilu psa",
                    description: "Możliwość dodawania informacji o psie do profilu, takich jak rasa, wiek, preferencje żywieniowe"
                },
                {
                    name: "Planowanie spacerów",
                    description: "Funkcja umożliwiająca ustalanie terminów i tras spacerów dla psów"
                },
                {
                    name: "Powiadomienia o spacerach",
                    description: "System powiadomień przypominających o zbliżającym się spacerze"
                },
                {
                    name: "Ocena spacerów",
                    description: "Możliwość oceniania przebiegu spacerów i opiekunów psów"
                },
                {
                    name: "Mapa tras spacerów",
                    description: "Wyświetlanie tras spacerów na interaktywnej mapie"
                },
                {
                    name: "Zarządzanie grupami spacerowymi",
                    description: "Możliwość tworzenia grup spacerowych i dołączania do istniejących"
                },
                {
                    name: "Chat w aplikacji",
                    description: "Funkcja umożliwiająca komunikację między użytkownikami przed lub po spacerze"
                },
                {
                    name: "Historia spacerów",
                    description: "Możliwość przeglądania historii poprzednich spacerów wraz z ocenami i komentarzami"
                },
                {
                    name: "Zarządzanie kontem",
                    description: "Możliwość edycji danych osobowych i ustawień konta"
                }
            ],
            non_functional_requirements: [
                {
                    name: "Wydajność",
                    description: "Aplikacja powinna działać płynnie i bez opóźnień, nawet przy dużej liczbie użytkowników"
                },
                {
                    name: "Bezpieczeństwo danych",
                    description: "Zabezpieczenie danych użytkowników, szczególnie informacji dotyczących zwierząt"
                },
                {
                    name: "Intuicyjny interfejs",
                    description: "Prosty i łatwy w obsłudze interfejs użytkownika, zapewniający wygodne korzystanie z aplikacji"
                },
                {
                    name: "Dostępność na różne platformy",
                    description: "Aplikacja powinna być dostępna zarówno na urządzenia mobilne z systemem Android, jak i iOS"
                },
                {
                    name: "Personalizacja profili",
                    description: "Możliwość dostosowania profilu psa oraz preferencji spacerów do indywidualnych potrzeb użytkownika"
                },
                {
                    name: "System oceniania",
                    description: "Precyzyjny system oceniania spacerów i opiekunów psów, aby zapewnić wysoką jakość usług"
                },
                {
                    name: "Geolokalizacja",
                    description: "Wykorzystanie funkcji geolokalizacji do precyzyjnego określania lokalizacji użytkowników i tras spacerów"
                },
                {
                    name: "Backup danych",
                    description: "Regularne tworzenie kopii zapasowych danych użytkowników, aby uniknąć ich utraty"
                },
                {
                    name: "Szybkość ładowania",
                    description: "Minimalizacja czasu ładowania aplikacji i jej funkcji, aby zapewnić szybką reakcję na działania użytkownika"
                },
                {
                    name: "Utrzymanie zgodności z przepisami",
                    description: "Zapewnienie zgodności z prawem dotyczącym zbierania danych osobowych oraz regulacji dotyczących usług dla zwierząt"
                }
            ]
        };

        const timeout = setTimeout(() => {
            setFunctionalRequirements(mockedData.functional_requirements);
            setNonFunctionalRequirements(mockedData.non_functional_requirements);
        }, 0);

        return () => clearTimeout(timeout);
    }, []);


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