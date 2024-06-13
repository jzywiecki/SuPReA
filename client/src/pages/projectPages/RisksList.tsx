import React, { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import "./styles.css";

interface Risk {
    risk: string;
    description: string;
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
            <strong>{risk.risk}:</strong> {risk.description}
        </motion.li>
    );
};

const RiskList: React.FC = () => {
    const [risks, setRisks] = useState<Risk[]>([]);

    useEffect(() => {
        const mockedData = {
            risks: [
                {
                    risk: "Niskie zaangażowanie użytkowników",
                    description: "Możliwość braku zainteresowania aplikacją przez właścicieli psów, co może prowadzić do niskiej liczby pobrań i użytkowników."
                },
                {
                    risk: "Konkurencja na rynku",
                    description: "Występowanie innych aplikacji do wyprowadzania psów, które mogą być bardziej znane i popularne wśród użytkowników."
                },
                {
                    risk: "Problemy z integracją z lokalizacją",
                    description: "Trudności z precyzyjnym określeniem lokalizacji psa i właściciela, co może wpłynąć na funkcjonalność i użyteczność aplikacji."
                },
                {
                    risk: "Problemy z bezpieczeństwem danych",
                    description: "Ryzyko wycieku danych osobowych użytkowników, takich jak lokalizacja czy informacje kontaktowe, co może zaszkodzić reputacji startupu."
                },
                {
                    risk: "Niska jakość interfejsu użytkownika",
                    description: "Brak intuicyjności i atrakcyjności interfejsu może wpłynąć na użyteczność i popularność aplikacji wśród użytkowników."
                },
                {
                    risk: "Brak zabezpieczeń przed atakami cybernetycznymi",
                    description: "Narażenie aplikacji na ataki hakerów i kradzież danych, co może spowodować poważne konsekwencje dla startupu i jego użytkowników."
                },
                {
                    risk: "Ograniczenia prawne związane z wyprowadzaniem psów",
                    description: "Możliwe konflikty z przepisami prawnymi dotyczącymi wyprowadzania psów, co może skutkować koniecznością dostosowania funkcjonalności aplikacji."
                },
                {
                    risk: "Błędy w nawigacji i wskazówkach",
                    description: "Nieprawidłowe wskazania trasy czy błędy w nawigacji mogą prowadzić do dezorientacji użytkowników i utraty zaufania do aplikacji."
                },
                {
                    risk: "Zmiany w preferencjach użytkowników",
                    description: "Możliwość szybkich zmian w oczekiwaniach i potrzebach użytkowników, co może wymagać ciągłego dostosowywania funkcji i usług."
                },
                {
                    risk: "Brak wsparcia inwestorów",
                    description: "Odmowa udzielenia finansowania przez inwestorów może negatywnie wpłynąć na rozwój i dalsze funkcjonowanie startupu."
                }
            ]
        };

        const timeout = setTimeout(() => {
            setRisks(mockedData.risks);
        }, 0);

        return () => clearTimeout(timeout);
    }, []);

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
