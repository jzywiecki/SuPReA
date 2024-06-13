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

const ElevatorSpeech = () => {
    const [content, setContent] = useState(" ");

    useEffect(() => {
        const mockedData = {
            content: "Our walking dog service aims to provide top-quality care and exercise for your furry friends. With experienced and reliable dog walkers, we ensure that your pet gets the attention and exercise they need while you're busy. Book with us today to give your dog the exercise and care they deserve!",
        };

        const timeout = setTimeout(() => {
            setContent(mockedData.content);
        }, 0);

        return () => clearTimeout(timeout);
    }, []);

    return (
        <Card className="max-w-lg mx-auto my-8">
            <CardHeader>
                <CardTitle>Elevator speech</CardTitle>
                <CardDescription>Content for pitching idea</CardDescription>
            </CardHeader>
            <CardContent>
                <ScrollArea style={{ height: 'calc(100vh - 300px)' }}>
                    <h1 className="text-2xl font-semibold">{content}</h1>
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

export default ElevatorSpeech;
