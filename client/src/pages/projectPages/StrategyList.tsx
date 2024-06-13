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

const StrategyList = () => {
    const [strategy, setStrategy] = useState(" ");

    useEffect(() => {
        const mockedData = {
            strategy: "Nasza strategia marketingowa skupia się na promowaniu naszej aplikacji do wyprowadzania psów poprzez wykorzystanie mediów społecznościowych oraz kampanii influencerskich. Naszym celem jest dotarcie do właścicieli psów poprzez tworzenie angażującej treści, konkursów i materiałów edukacyjnych na temat zdrowia i zachowań psów. Dodatkowo planujemy współpracować z influencerami z branży zoologicznej oraz trenerami psów, aby zwiększyć świadomość naszej aplikacji i budować zaufanie do naszej marki. Pragniemy również organizować eventy oraz warsztaty dla właścicieli psów, aby rozbudować społeczność użytkowników naszej aplikacji. Naszym celem jest stworzenie pozytywnego wizerunku naszej marki oraz zwiększenie liczby pobrań naszej aplikacji."
        };

        const timeout = setTimeout(() => {
            setStrategy(mockedData.strategy);
        }, 0);

        return () => clearTimeout(timeout);
    }, []);

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
