import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const Chat = () => {

    return (
        <div>   
            <Tabs defaultValue="ai" className="w-[400px]">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="ai">AI Chat</TabsTrigger>
                <TabsTrigger value="discussion">Discussion</TabsTrigger>
            </TabsList>
            <TabsContent value="ai">
            <div className="border border-gray-300 p-2 mb-2">Wiadomość 1</div>
            <div className="border border-gray-300 p-2 mb-2">Wiadomość 2</div>
            <input type="text" className="border p-2 w-full" placeholder="Napisz wiadomość..." />
            </TabsContent>
            <TabsContent value="discussion">
                Change your password here.
            </TabsContent>
            </Tabs>
        </div>
    )
}

export default Chat;
