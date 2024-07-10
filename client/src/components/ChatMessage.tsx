import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "@/components/ui/avatar"


const ChatMessage = ({ text, sender, date, confirmed, styleId }) => {


    return (
        <div className={`flex p-3 ${styleId % 2 == 1 ? 'justify-start bg-accent' : 'justify-end bg-background'}`}>
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