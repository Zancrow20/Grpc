import { useState, useReducer } from "react";
import { useNavigate } from "react-router-dom"
import { AuthData } from "../Auth/AuthWrapper";

export const LoginPage = () => {
    const { login } = AuthData();
    const navigator = useNavigate();
    const [ formData, setFormData ] = useReducer((formData, newItem) => { return ( {...formData, ...newItem} )}, {login: "", password: ""});
    const [ error, setError ] = useState(null);

    async function tryGetToken() {
        if(formData.login == "" || formData.password == "")
        {
            setError("invalid login or password.");
            return;
        }

        try {
            await login(formData.login, formData.password);
            setFormData({login: "", password: ""});
            navigator("/chat");
        }
        catch {
            setError("error during request");
        }
    }

    return (
        <div className="form-holder">
            <h2>Sign Into Account</h2>
            <div className="inputs">
                <div className="input">
                    <input type="text" maxLength="256" minLength="6" placeholder="username" required={true}
                           value={formData?.login} 
                           onChange={(e) => setFormData({login: e.target.value?.trim()}) }/>
                </div>
                <div className="input">
                     <input placeholder="password" type="password" required={true}
                           value={formData?.password} 
                           onChange={(e) => setFormData({password: e.target.value?.trim()}) }/>
                </div>
                <div>
                    {error}
                </div>
                <button onClick={tryGetToken}>Log in</button>
            </div>
        </div>);
}