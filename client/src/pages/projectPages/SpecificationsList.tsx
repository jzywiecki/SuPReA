import { useContext, useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import axios from "axios";
import { useParams } from "react-router-dom";
import RegenerateContext from "@/components/contexts/RegenerateContext";

interface Specifications {
    name: string;
    description: string;
}

const SpecificationsList: React.FC = () => {
    const { projectID } = useParams();
    const [Specifications, setSpecifications] = useState<Specifications[]>([]);
    const { regenerate, setProjectRegenerateID, setComponentRegenerate } = useContext(RegenerateContext);

    function getComponentName() {
        return "specifications";
    }
    const fetchData = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/specifications/${projectID}`);
            setSpecifications(response.data.specifications);

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
        <div>
            <h1 className="text-3xl font-semibold text-center mt-8">Specifications</h1>
            <p className="text-center text-gray-700 mt-4 mx-auto max-w-lg"> Specifications of the current project.</p>

            {Specifications.map((specification, index) => (
                <Card className="max-w-lg mx-auto my-8">
                    <CardHeader>
                        <h1 className="text-2xl font-semibold">{specification.name}</h1>
                    </CardHeader>
                    <CardContent>
                        <p className="mt-4 text-base text-gray-700">{specification.description}</p>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                        <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                            Edit
                        </button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}




export default SpecificationsList;
