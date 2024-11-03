import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";
import { RiRobot3Fill } from "react-icons/ri";

type MessageType = "user" | "other";

interface ChatMessageProps {
    text: string;
    sender: string;
    date?: string;
    confirmed: boolean;
    messageType: MessageType;
}

const ChatMessage = ({ isAI, text, sender, date, confirmed, messageType, senderInfo }: ChatMessageProps) => {

    const formatDate = (dateTimeString: string): string => {
        try {
            const dateObj = new Date(dateTimeString);
            const formattedDate = `${dateObj.getFullYear()}-${padNumber(dateObj.getMonth() + 1)}-${padNumber(dateObj.getDate())}`;
            const formattedTime = `${padNumber(dateObj.getHours())}:${padNumber(dateObj.getMinutes())}`;
            return `${formattedDate} ${formattedTime}`;
        } catch (error) {
            console.error(`Invalid date format: ${dateTimeString}`);
            return dateTimeString;
        }
    };


    const padNumber = (number: number): string => {
        return number.toString().padStart(2, '0');
    };


    const renderDate = (date?: string): JSX.Element | null => {
        if (date) {
            const formattedDate = formatDate(date);
            return <div className="text-sm text-gray-500">{formattedDate}</div>;
        }
        return null;
    };


    return (
        <div className={`flex p-3 ${messageType === "other" ? 'justify-start bg-accent' : 'justify-end bg-background'}`} style={{ width: '25vw' }}>
            {isAI ? <Avatar className="m-2">
                {/* <AvatarImage src={senderInfo?.avatarurl} alt={`@${sender}`} /> */}
                <AvatarFallback><RiRobot3Fill size={30} /></AvatarFallback>
            </Avatar> : <Avatar className="m-2">
                <AvatarImage src={senderInfo?.avatarurl} alt={`@${sender}`} />
                <AvatarFallback>?</AvatarFallback>
            </Avatar>}
            <div className="flex-col" style={{ width: "80%" }}>
                <div className="font-bold">{senderInfo?.username}</div>
                <div style={{
                    wordWrap: "break-word",
                    overflowWrap: "break-word",
                    width: "100%",
                    height: "fit-content"
                }}>
                    {text}
                </div>                {!confirmed && (
                    <div className="text-sm text-gray-500">Sending...</div>
                )}
                {renderDate(date)}
            </div>
        </div>
    );
};

export default ChatMessage;
