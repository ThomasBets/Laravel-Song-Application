import { Link } from "@inertiajs/react";
import { useContext } from "react";
import { AppContext } from "../Context/AppContext";
import { router } from "@inertiajs/react";

export default function MainLayout({ header, main }) {
    // Access token and setter functions from global context
    const { token, setUser, setToken } = useContext(AppContext);

    // Handle user logout when "Logout" is clicked
    async function handleLogout(e) {
        e.preventDefault();

        // Send POST request to logout endpoint with the current token
        const response = await fetch("/api/logout", {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
            // Clear user/token from context and localStorage on success
            setUser(null);
            setToken(null);
            localStorage.removeItem("token");
            router.visit("/"); // Redirect to homepage
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-neutral-900">
            {/* Header Section */}
            <header className="w-full h-20 bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 shadow-[0_4px_10px_rgba(139,92,246,0.6)]">
                <div className="mx-auto px-6 flex justify-between items-center h-full">
                    {/* Logo and App Title */}
                    <div className="flex items-center space-x-2">
                        <span className="text-4xl mr-2">🎧</span>
                        <Link href="/" className="text-2xl fancy_text">
                            MySongApp
                        </Link>
                    </div>

                    {/* Injected header content*/}
                    {header}
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex flex-1 items-center justify-center text-center px-4">
                {main}
            </main>

            {/* Footer Section */}
            <footer className="text-center text-gray-500 text-sm py-6">
                &copy; {new Date().getFullYear()} MySongApp. All rights
                reserved.
            </footer>
        </div>
    );
}
