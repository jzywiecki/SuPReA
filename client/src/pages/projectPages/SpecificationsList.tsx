import { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

const SpecificationsList = () => {
    const [name, setName] = useState(" ");
    const [description, setDescription] = useState(" ");

    useEffect(() => {
        const mockedData = {
            specifications: {
                name: "Aplikacja do wyprowadzania psów",
                description: "Aplikacja mobilna, która umożliwia właścicielom psów znalezienie dogodnych tras do spacerów oraz dzielenie się informacjami o ulubionych miejscach z innymi użytkownikami. Aplikacja zawiera także funkcje pozwalające na rezerwację wizyt u profesjonalnych wyprowadzaczy psów oraz śledzenie aktywności i zdrowia czworonogów."
            }
        };

        const timeout = setTimeout(() => {
            setName(mockedData.specifications.name);
            setDescription(mockedData.specifications.description);
        }, 0);

        return () => clearTimeout(timeout);
    }, []);

    return (
        <Card className="max-w-lg mx-auto my-8">
            <CardHeader>
                <CardTitle>Project Details</CardTitle>
                <CardDescription>Specifications of the current project.</CardDescription>
            </CardHeader>
            <CardContent>
                <h1 className="text-2xl font-semibold">{name}</h1>
                <p className="mt-4 text-base text-gray-700">{description}</p>
            </CardContent>
            <CardFooter className="flex justify-end">
                <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                    Edit
                </button>
            </CardFooter>
        </Card>
    );
}

export default SpecificationsList;
