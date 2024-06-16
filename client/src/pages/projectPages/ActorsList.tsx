import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { FaBone, FaCat, FaDog, FaPaw, FaUserTie } from "react-icons/fa";
import './styles.css'
import { useParams } from "react-router-dom";
import axios from "axios";

interface Actor {
    name: string;
    description: string;
    icon: JSX.Element;
}
// kolory text-blue-500
const icons = [
    <FaDog size={40} className="text-black-500" />,
    <FaUserTie size={40} className="text-black-500" />,
    <FaCat size={40} className="text-black-500" />,
    <FaPaw size={40} className="text-black-500" />,
    <FaBone size={40} className="text-black-500" />
];

const getRandomIcon = () => {
    const randomIndex = Math.floor(Math.random() * icons.length);
    return icons[randomIndex];
};
const ActorList: React.FC = () => {
    const { projectID } = useParams();
    const [actors, setActors] = useState<Actor[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/actors/${projectID}`);

                const actorsWithIcons = response.data.actors.map((actor: Actor) => ({
                    ...actor,
                    icon: getRandomIcon()
                }));

                setActors(actorsWithIcons);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        fetchData();

    }, [projectID]);

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
