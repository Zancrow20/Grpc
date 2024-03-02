import React, { useEffect, useState, useReducer } from "react"
import { AuthData } from "../Auth/AuthWrapper";
import { ChatServiceClient } from "../Protos/ChatserviceServiceClientPb.ts";
import { Message } from "../Protos/chatservice_pb";
import google_protobuf_empty_pb from 'google-protobuf/google/protobuf/empty_pb.js'

export const ChatPage = () => {
    const { user, authorizedMetadata } = AuthData();
    const [messages, setMessages] = useState([]);
    const [client, setClient] = useState(null);
    const [error, setError] = useState("");
    const [ formData, setFormData ] = useReducer((formData, newItem) => { return ( {...formData, ...newItem} )}, {text: ""});
    const [messageSent, setMessageSent] = useState(false);

    async function sendMessage(text) {
        const error = "Error during sending request";
        setMessageSent(true);
        try{
            if (client == null)
            {
                setError(error);
                return;
            }
            
            if(text == "" || messageSent)
                return;
    
            const message = new Message();
            message.setText(text);
            await client.sendMessage(message, authorizedMetadata());
            setError("");
        }
        catch{
            setError(error);
        }
        finally{
            setMessageSent(false);
        }
    }

    useEffect(() => {
        (async () => {
            const chatClient = new ChatServiceClient("http://localhost:8080"/* proccess.env.ENVOY_HOST */);
            setClient(chatClient);
            
            const messagesStream = await chatClient.subscribeMessages(new google_protobuf_empty_pb.Empty(), authorizedMetadata());
            messagesStream.on("data", 
                response => setMessages(old => [...old, {username: response.getUsername(), text: response.getText()}]));
        })()
    }, []);


    return <>
        <div>
            Общий чат
        </div>
        <div>
            <div>
                {messages.map(message => {
                    <div>
                        <div>{message.text}</div>
                        <div>{message.username}</div>
                    </div>
                })}
            </div>
            <div disabled={client ? "" : "disabled"}>
                <input placeholder="Введите сообщение"
                    value={formData?.text}
                    onChange={(e) => setFormData({text: e.target.value?.trim()})}/>
                <button disabled={messageSent ? "disabled" : ""} onClick={sendMessage}>Отправить</button>
            </div>
            <div>{error}</div>
        </div>
    </>;
}