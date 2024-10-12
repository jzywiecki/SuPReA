import { useContext, useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { FaAnglesUp, FaArrowsToEye, FaBoxesStacked, FaBraille, FaCloudsmith } from "react-icons/fa6";
import './styles.css'
import { useParams } from "react-router-dom";
import axios from "axios";
import RegenerateContext from "@/components/contexts/RegenerateContext";

interface Actor {
    name: string;
    description: string;
    icon: JSX.Element;
}
// kolory text-blue-500
const icons = [
    <FaAnglesUp size={40} className="text-black-500" />,
    <FaCloudsmith size={40} className="text-black-500" />,
    <FaBoxesStacked size={40} className="text-black-500" />,
    <FaBraille size={40} className="text-black-500" />,
    <FaArrowsToEye size={40} className="text-black-500" />
];

const getRandomIcon = () => {
    const randomIndex = Math.floor(Math.random() * icons.length);
    return icons[randomIndex];
};
const ActorList: React.FC = () => {
    const { projectID } = useParams();
    const [actors, setActors] = useState<Actor[]>([]);
    const { regenerate, setProjectRegenerateID, setComponentRegenerate } = useContext(RegenerateContext);

    function getComponentName() {
        return "actors";
    }
    const fetchData = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/model/actors/${projectID}`);

            const actorsWithIcons = response.data.actors.map((actor: Actor) => ({
                ...actor,
                icon: getRandomIcon()
            }));

            setActors(actorsWithIcons);

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

    return (

        <ScrollArea style={{ height: 'calc(100vh - 24px)', width: "100%", padding: "5%", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
            <div className="w-full flex flex-col items-center justify-center">
                {actors.map((actor, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.2 }}
                        className="actor-card"
                    >
                        <div className="actor-background" />
                        <div className="actor-icon">{actor.icon}</div>
                        <div className="actor-description">
                            <h2> {actor.name} </h2>
                            <p> {actor.description} </p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </ScrollArea>
    );
}

export default ActorList;
