import { createContext, useEffect, useState } from "react";

// Create a new context to be shared across the app
export const AppContext = createContext();

export default function AppProvider({ children }) {
    // Store the auth token from localStorage (if available)
    const [token, setToken] = useState(localStorage.getItem("token"));

    // Store user information after authentication
    const [user, setUser] = useState(null);

    // Fetch the authenticated user using the stored token
    async function getUser() {
        const res = await fetch("/api/user", {
            headers: {
                Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
            },
        });

        const data = await res.json();

        // If the request is successful, update the user state
        if (res.ok) {
            setUser(data);
        }
    }

    // Run getUser when the token changes (e.g. after login)
    useEffect(() => {
        if (token) {
            getUser();
        }
    }, [token]);

    return (
        // Provide token and user data (and setters) to the rest of the app
        <AppContext.Provider value={{ token, setToken, user, setUser }}>
            {children}
        </AppContext.Provider>
    );
}
