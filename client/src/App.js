import React, { useEffect, useState } from "react";
import "./App.css";
import { AuthWrapper } from "./Auth/AuthWrapper";
import { BrowserRouter } from "react-router-dom";

//export const ChatClient = new ChatServiceClient("http://localhost:8080");

function App() {
  const [chatMessages, setChatMessages] = useState([]);
 
  useEffect(() => {
    (() => {
      /*
      chatReq.setId(user.id);
      const chatStream = client.chatStream(chatReq);
      chatStream.on("data", (chunk) => {
        const msg = chunk.toObject();
        setChatMessages((prev) => [...prev, msg]);
      });
      */
    })();
  });

  return <BrowserRouter>
          <AuthWrapper />
        </BrowserRouter>
}

export default App;