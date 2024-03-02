import { useContext, useEffect } from "react"

export const Logout = () => {
    const {logout} = useContext();
    useEffect(() => logout(), []);

    return <></>
}