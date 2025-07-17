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
            <header className="bg-gray-950 shadow-indigo-600 shadow-md">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    {/* Left: Logo/Home */}
                    <Link
                        href="/"
                        className="text-2xl font-bold text-violet-500"
                    >
                        🎵MySongApp
                    </Link>

                    {!user ? (
                        /* Guest Links */
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
                        /* Authenticated Layout */
                        <div className="flex items-center justify-end w-full">
                            {/* Middle Links (moved closer to logo) */}
                            <div className="flex gap-16 ml-16">
                                <Link
                                    href="/mysongs"
                                    className="ml-2 px-5 py-2 bg-blue-100 text-violet-500 rounded-lg hover:bg-violet-600 hover:text-white transition"
                                >
                                    My Songs
                                </Link>
                                <Link
                                    href="/post-song"
                                    className="px-4 py-2 bg-blue-100 text-violet-500 rounded-lg hover:bg-violet-600 hover:text-white transition"
                                >
                                    Store a Song
                                </Link>
                            </div>

                            {/* Logout Button */}
                            <form onSubmit={handleLogout} className="ml-auto">
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
