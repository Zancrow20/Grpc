import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"
 
export const NotFoundPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    useEffect(() => {
        if (location == "/")
            navigate("/login");
    }, []);
        
    return <div>Not Found</div>
}
