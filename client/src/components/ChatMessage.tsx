import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"


type MessageType = "user" | "other";


interface ChatMessageProps {
    text: string;
    sender: string;
    date?: string;
    confirmed: boolean;
    messageType: MessageType;
}


const ChatMessage = ({ text, sender, date, confirmed, messageType } : ChatMessageProps) => {


    return (
        <div className={`flex p-3 ${messageType === "other" ? 'justify-start bg-accent' : 'justify-end bg-background'}`}>
            <Avatar className="m-2">
                <AvatarImage src="" alt="@shadcn" />
                <AvatarFallback>?</AvatarFallback>
            </Avatar>
            <div className="flex-col">
            <div className="font-bold">{sender}</div>
            <div>{text}</div>
            {!confirmed && (
                <div className="text-sm text-gray-500">Sending...</div>
            )}
            {date && (
                <div className="text-sm text-gray-500">{date}</div>
            )}
            </div>
        </div>
    )
}

export default ChatMessage;