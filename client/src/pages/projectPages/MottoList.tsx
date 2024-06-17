import { useContext, useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useParams } from "react-router-dom";
import axios from "axios";
import RegenerateContext from "@/components/contexts/RegenerateContext";

const MottoList: React.FC = () => {
    const { projectID } = useParams();
    const [motto, setMotto] = useState("");
    const { regenerate, setProjectRegenerateID, setComponentRegenerate } = useContext(RegenerateContext);

    function getComponentName() {
        return "motto";
    }
    const fetchData = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/motto/${projectID}`);
            setMotto(response.data.motto);
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

    return (
        <Card className="max-w-lg mx-auto my-8">
            <CardHeader>
                <CardTitle>Motto of the project</CardTitle>
                <CardDescription>A motivational quote to inspire your client.</CardDescription>
            </CardHeader>
            <CardContent>
                <h1 className="text-3xl font-semibold">{motto}</h1>
            </CardContent>
            <CardFooter className="flex justify-end">
                <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                    Edit
                </button>
            </CardFooter>
        </Card>
    );
}

export default MottoList;
