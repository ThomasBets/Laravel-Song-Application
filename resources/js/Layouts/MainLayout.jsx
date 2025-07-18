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
        <div className="min-h-screen flex flex-col bg-neutral-900">
            <header className="bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 shadow-[0_4px_10px_rgba(139,92,246,0.6)]">
                {!user ? (
                    <div className="max-w-8xl mx-auto px-6 py-4 flex justify-between items-center">
                        <div>
                            <span className="text-3xl mr-2">🎧</span>
                            <Link
                                href="/"
                                className="text-2xl font-bold text-violet-500 "
                            >
                                MySongApp
                            </Link>
                        </div>
                        <div className="flex gap-4">
                            <Link
                                href="/login"
                                className="px-4 py-2 bg-violet-700 hover:bg-gray-700 rounded-lg text-violet-200 transition "
                            >
                                Login
                            </Link>
                            <Link
                                href="/register"
                                className="px-3 py-2 bg-violet-700 hover:bg-gray-700 rounded-lg text-violet-200 transition"
                            >
                                Register
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="max-w-8xl mx-auto px-6 py-4 flex justify-between items-center space-x-10">
                        <div>
                            <span className="text-3xl mr-2">🎧</span>
                            <Link
                                href="/"
                                className="text-2xl font-bold text-violet-500 "
                            >
                                MySongApp
                            </Link>
                        </div>

                        <Link
                            href="/mysongs"
                            className="ml-20 mr-10 mt-2 text-violet-200 hover:[text-shadow:_0_0_10px_#faf5ff] transition"
                        >
                            My Songs
                        </Link>
                        <Link
                            href="/post-song"
                            className="ml-20 mt-2 text-violet-200 hover:[text-shadow:_0_0_10px_#faf5ff] transition"
                        >
                            Store a Song
                        </Link>

                        {/* Logout Button */}
                        <form onSubmit={handleLogout} className="ml-auto">
                            <button className="px-4 py-2 bg-violet-700 hover:bg-gray-700 rounded-lg text-violet-200 transition">
                                Logout
                            </button>
                        </form>
                    </div>
                )}
            </header>

            {/* Main Content */}
            <main className="flex flex-1 items-center justify-center text-center">
                {children}
            </main>

            <footer className="text-center text-violet-400 text-sm py-6">
                &copy; {new Date().getFullYear()} MySongApp. All rights
                reserved.
            </footer>
        </div>
    );
}
