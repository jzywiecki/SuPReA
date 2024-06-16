import { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useParams } from "react-router-dom";
import axios from "axios";

const StrategyList:React.FC = () => {
    const { projectID } = useParams();
    const [strategy, setStrategy] = useState(" ");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/strategy/${projectID}`);
                setStrategy(response.data.strategy);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        fetchData();



    }, [projectID]);

    return (
        <Card className="max-w-lg mx-auto my-8">
            <CardHeader>
                <CardTitle>Strategy</CardTitle>
                <CardDescription>Strategy for the current project.</CardDescription>
            </CardHeader>
            <CardContent>
                <ScrollArea style={{ height: 'calc(100vh - 300px)' }}>
                    <h1 className="text-2xl font-semibold">{strategy}</h1>
                </ScrollArea >
            </CardContent>
            <CardFooter className="flex justify-end">
                <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                    Edit
                </button>
            </CardFooter>
        </Card>
    );
}

export default StrategyList;
