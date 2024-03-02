import "./App.css";
import { AuthWrapper } from "./Auth/AuthWrapper";
import { BrowserRouter } from "react-router-dom";

function App() {

  return <BrowserRouter>
            <AuthWrapper />
          </BrowserRouter>
}

export default App;