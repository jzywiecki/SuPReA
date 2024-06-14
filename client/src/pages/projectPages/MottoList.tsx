import { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

const MottoList = () => {
    const [motto, setMotto] = useState(" ");

    useEffect(() => {
        const mockedData = {
            motto: "Spacer z psem to najlepszy sposób na poprawę nastroju i zdrowia!",
        };

        const timeout = setTimeout(() => {
            setMotto(mockedData.motto);
        }, 0);

        return () => clearTimeout(timeout);
    }, []);

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
