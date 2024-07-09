import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "@/components/ui/avatar"


const ChatMessage = ({ message, id }) => {


    return (
        <div className={`flex p-3 ${id % 2 == 1 ? 'justify-start bg-accent' : 'justify-end bg-background'}`}>
            <Avatar className="m-2">
                <AvatarImage src="" alt="@shadcn" />
                <AvatarFallback>?</AvatarFallback>
            </Avatar>
            <div className="flex-col">
            <div className="font-bold">{message.user}</div>
            <div className="">{message.content}</div>
            {!message.confirmed ? (
                    <div className="text-sm text-gray-500">Sending...</div>
            ) : null}
            </div>
        </div>
    )
}

export default ChatMessage;