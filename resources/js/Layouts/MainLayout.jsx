import { Link } from "@inertiajs/react";
import { useContext } from "react";
import { AppContext } from "../Context/AppContext";
import { router } from "@inertiajs/react";

export default function MainLayout({ children }) {
    const { user, token, setUser, setToken } = useContext(AppContext);

    async function handleLogout(e) {
        e.preventDefault();

        const response = await fetch("/api/logout", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await response.json();

        if (response.ok) {
            setUser(null);
            setToken(null);
            localStorage.removeItem("token");
            router.visit("/");
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <Link to="/" className="text-2xl font-bold text-blue-600">
                        🎵 MySongApp
                    </Link>

                    {!user ? (
                        <div className="flex gap-4">
                            <Link
                                href="/login"
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                            >
                                Login
                            </Link>
                            <Link
                                href="/register"
                                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                            >
                                Register
                            </Link>
                        </div>
                    ) : (
                        <div>
                            <form onSubmit={handleLogout}>
                                <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
                                    Logout
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </header>

            {/* Main Content */}
            <main className="flex flex-1 items-center justify-center text-center">
                {children}
            </main>
        </div>
    );
}
