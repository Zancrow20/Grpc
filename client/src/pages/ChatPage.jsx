import React, { useEffect, useState, useReducer } from "react"
import { AuthData } from "../Auth/AuthWrapper";
import { ChatServiceClient } from "../Protos/ChatserviceServiceClientPb.ts";
import { Message } from "../Protos/chatservice_pb";
import google_protobuf_empty_pb from 'google-protobuf/google/protobuf/empty_pb.js'

export const ChatPage = () => {
    const { user, authorizedMetadata, logout } = AuthData();
    const [messages, setMessages] = useState([]);
    const [client, setClient] = useState(null);
    const [error, setError] = useState("");
    const [ formData, setFormData ] = useReducer((formData, newItem) => { return ( {...formData, ...newItem} )}, {text: ""});
    const [messageSent, setMessageSent] = useState(false);

    function onSendError(err) {
        console.log(err);
        setError("Ваше сообщение не отправленно.");
    }

    function onSendSuccess(sentText) {
        setMessages(old => [...old, {username: user.username, text: sentText, isMyMessage: true}]);
        setError("");
        setFormData({text: ""});
    }

    async function sendMessage(text) {
        const error = "Ошибка при отправке сообщения";
        setMessageSent(true);
        try {
            if (client == null)
            {
                setError(error);
                return;
            }
            
            text = text?.trim();

            if(text === "" || text === undefined || text === null || messageSent)
                return;
            const message = new Message();
            message.setText(text);
            await client.sendMessage(message, authorizedMetadata(), 
            (err) => {
                if (err)
                    onSendError(err);
                else
                    onSendSuccess(text);
            });
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
            const chatClient = new ChatServiceClient(process.env.REACT_APP_ENVOY_HOST);
            setClient(chatClient);
            try {
                const messagesStream = await chatClient.subscribeMessages(new google_protobuf_empty_pb.Empty(), authorizedMetadata());
                messagesStream.on("data", 
                    response => setMessages(old => [...old, {username: response.getUsername(), text: response.getText(), isMyMessage: false}]));
                messagesStream.on("end", () => logout());
            }
            catch{
                setError("Ошибка при подключении к чату");
            }
        })()
    }, []);

    return <div className="chat">
        <div>
            Общий чат
        </div>
        <div className="messages">
            <div className="messags-div">
                {
                    messages.map((message, i) =>
                    <div key={i} className={message.isMyMessage ? "message my" : "message other"}>
                        <div>{message.text}</div>
                        <div className="username">{message.username}</div>
                    </div>)
                }
            </div>
            <div className="inputs" disabled={client ? "" : "disabled"}>
                <input placeholder="Введите сообщение"
                    value={formData?.text}
                    onChange={(e) => setFormData({text: e.target.value})}/>
                <button disabled={messageSent ? "disabled" : ""} onClick={() => sendMessage(formData?.text)}>Отправить</button>
            </div>
            <div className="error">{error}</div>
        </div>
    </div>;
}
