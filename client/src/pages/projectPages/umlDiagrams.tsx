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
import { useParams } from 'react-router-dom';
import axiosInstance from '../../services/api';
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
    const { projectID } = useParams();
    const [plantUMLCodes, setPlantUMLCodes] = useState("");
    const [isLoading, setIsLoading] = useState(true)
    const { regenerate, setProjectRegenerateID, setComponentRegenerate } = useContext(RegenerateContext);

    function getComponentName() {
        return "uml";
    }
    const fetchData = async () => {
        try {
            const response = await axiosInstance.get(`${api}/model/uml/${projectID}`);
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
