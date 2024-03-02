import { createContext, useContext, useEffect, useState } from "react"
import { RenderRoutes } from "./RenderRoutes";
import { useLocation } from "react-router-dom";
import { OpenServiceClient } from "../Protos/JwtServiceClientPb.ts";
import { User } from "../Protos/jwt_pb";

export const getTokenFromStorage = () => sessionStorage.getItem("token");
const setTokenToStorage = (token) => sessionStorage.setItem("token", token);

const authClient = new OpenServiceClient(process.env.REACT_APP_ENVOY_HOST);


const AuthContext = createContext();
export const AuthData = () => useContext(AuthContext);

export const AuthWrapper = () => {
     const location = useLocation();
     const [ user, setUser ] = useState({username: sessionStorage.getItem("username") ?? "", isAuthenticated: getTokenFromStorage() != undefined })

     const login = async (username, password) => {
        const request = new User();
        request.setUsername(username);
        request.setPassword(password);
        
        const reply = await authClient.getToken(request, (err) => { if (err) throw new Error()});
        const token = reply.getToken();
        
        setTokenToStorage(token);
        setUser({...user, username: username, isAuthenticated: true});
     }

     const authorizedMetadata = () => {
          return { "Authorization": `Bearer ${getTokenFromStorage()}` };
     }

     const logout = () => {
          sessionStorage.removeItem("token");
          setUser({...user, isAuthenticated: false})
     }

     useEffect(() => {
          (async function validateToken() {
               //todo: test token
               const isValidSession = false // await API.testSession();
               if (isValidSession == false){
                    logout();
               }
          })();

     }, []);

     return (
               <AuthContext.Provider value={{user, login, logout, authorizedMetadata}}>
                         <RenderRoutes />
               </AuthContext.Provider>
     )
}