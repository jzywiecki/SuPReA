import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import Xarrow, { Xwrapper, useXarrow } from "react-xarrows";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Feature {
    feature_name: string;
    description: string;
}

const BusinessScenario = () => {
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [features, setFeatures] = useState<Feature[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);
    const updateXarrow = useXarrow();

    useEffect(() => {
        const mockedData = {
            business_scenario: {
                title: "On-demand dog walking service in urban areas",
                description: "Our app provides a platform for busy urban pet owners to easily schedule and pay for dog walking services at their convenience.",
                features: [
                    {
                        feature_name: "User profiles",
                        description: "Users can create profiles for their pets, set preferences for walks, and provide instructions for dog walkers."
                    },
                    {
                        feature_name: "Real-time GPS tracking",
                        description: "Pet owners can track their dog's walk in real-time and receive updates on the route taken and duration of the walk."
                    },
                    {
                        feature_name: "Real-time GPS tracking",
                        description: "Pet owners can track their dog's walk in real-time and receive updates on the route taken and duration of the walk."
                    }
                ]
            }
        };

        const timeout = setTimeout(() => {
            setTitle(mockedData.business_scenario.title);
            setDescription(mockedData.business_scenario.description);
            setFeatures(mockedData.business_scenario.features);
            updateXarrow();
        }, 0);

        return () => clearTimeout(timeout);
    }, [updateXarrow]);

    useEffect(() => {
        const handleScroll = () => {
            updateXarrow();
        };

        if (containerRef.current) {
            containerRef.current.addEventListener('scroll', handleScroll);
        }

        return () => {
            if (containerRef.current) {
                containerRef.current.removeEventListener('scroll', handleScroll);
            }
        };
    }, [updateXarrow]);

    const midIndex = Math.ceil(features.length / 2);
    const firstColumnFeatures = features.slice(0, midIndex);
    const secondColumnFeatures = features.slice(midIndex);
    const [showXarrows, setShowXarrows] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setShowXarrows(true);
        }, 2);

        return () => clearTimeout(timeout);
    }, []);
    return (
        <ScrollArea style={{ height: 'calc(100vh - 24px)' }} className="max-w-lg mx-auto my-8 p-4 border rounded-lg shadow-md">
            <div className="mb-4" id="title-description">
                <h1 className="text-2xl font-bold">{title}</h1>
                <p className="text-lg text-gray-700">{description}</p>
            </div>
            <div ref={containerRef}>
                <Xwrapper>
                    <div className="flex space-x-4">
                        <div className="space-y-4">
                            {firstColumnFeatures.map((feature, index) => (
                                <div key={index} id={`feature-${index}`}>
                                    <motion.div
                                        className="p-4 border rounded-lg shadow-sm"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5 }}
                                        style={{ margin: "30px 0" }}
                                    >
                                        <h2 className="text-xl font-semibold">{feature.feature_name}</h2>
                                        <p className="text-base text-gray-700">{feature.description}</p>
                                    </motion.div>
                                    {index < firstColumnFeatures.length - 1 && (
                                        <Xarrow
                                            start={`feature-${index}`}
                                            end={`feature-${index + 1}`}
                                            startAnchor="bottom"
                                            endAnchor="top"
                                            color="black"

                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="space-y-4">
                            {secondColumnFeatures.map((feature, index) => (
                                <div key={index} id={`feature-${midIndex + index}`}>
                                    <motion.div
                                        className="p-4 border rounded-lg shadow-sm"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5 }}
                                        style={{ margin: "30px 0" }}
                                    >
                                        <h2 className="text-xl font-semibold">{feature.feature_name}</h2>
                                        <p className="text-base text-gray-700">{feature.description}</p>
                                    </motion.div>
                                    {index < secondColumnFeatures.length - 1 && (
                                        <Xarrow
                                            start={`feature-${midIndex + index}`}
                                            end={`feature-${midIndex + index + 1}`}
                                            startAnchor="bottom"
                                            endAnchor="top"
                                            color="black"
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                    {showXarrows && <Xarrow
                        start="title-description"
                        end={`feature-0`}
                        startAnchor="bottom"
                        endAnchor="top"
                        color="black"

                    />}
                    {showXarrows && <Xarrow
                        start="title-description"
                        end={`feature-${midIndex}`}
                        startAnchor="bottom"
                        endAnchor="top"
                        color="black"

                    />}
                </Xwrapper>
            </div>
            <div className="flex justify-end mt-4">
                <button className="px-4 py-2 bg-black-500 text-white rounded-md hover:bg-black-600">
                    Edit
                </button>
            </div>
        </ScrollArea>
    );
}

export default BusinessScenario;
