import { useState, FormEvent } from "react";
import ReactMarkdown from "react-markdown";

interface Message {
    role: "user" | "assistant";
    content: string;
}

function Chatbot() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const chatgptInput = formData.get("chatgptInput") as string;
        if (!chatgptInput) return;

        setIsLoading(true);
        const newMessages: Message[] = [...messages, { role: "user", content: chatgptInput }];
        setMessages(newMessages);

        fetch('/api/chatbot', {
            method: "POST",
            headers: {
                "Content-Type": 'application/json'
            },
            body: JSON.stringify({"theme": chatgptInput })
            // body: JSON.stringify({"theme": chatgptInput, "category": category, "perk": perk, "Time Period": timePeriod})
        })   
            .then((response) => response.json())
            .then((data) => {
                setIsLoading(false);
                console.log(data.data);
                setMessages([...newMessages, { role: "assistant", content: data.data }]);
            })
            .catch((e) => {
                setIsLoading(false);
                console.log(e);
                setMessages([...newMessages, { role: "assistant", content: e.message }]);
            });
    }

    return (
        <div className="Chatbot w-full">
            <div>
                {messages.map(({ role, content }, index) => (
                    <div key={index} className={role === "user" ? "max-w-[90%] w-full float-right bg-neutral-100" : "max-w-[90%] assistant"}>
                        {role === "user" ? content : <ReactMarkdown>{content}</ReactMarkdown>}
                    </div>
                ))}
            </div>
            <form method="post" className="form" onSubmit={handleSubmit}>
                <input name="chatgptInput" />
                <button type="submit" disabled={isLoading}>Submit</button>
            </form>
        </div>
    );
}

export default Chatbot;