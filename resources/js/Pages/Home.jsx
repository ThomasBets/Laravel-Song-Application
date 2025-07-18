import { Link } from "@inertiajs/react";
import { useContext } from "react";
import { AppContext } from "../Context/AppContext";
import MainLayout from "../Layouts/MainLayout";

export default function Home() {
    const { user, token, setUser, setToken } = useContext(AppContext);

    async function handleLogout(e) {
        e.preventDefault();

        const response = await fetch("/api/logout", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.ok) {
            setUser(null);
            setToken(null);
            localStorage.removeItem("token");
            router.visit("/");
        }
    }

    return (
        <MainLayout
            header={
                user ? (
                    <div className="max-w-8xl mx-auto px-6 py-4 flex justify-between items-center space-x-10">
                        <Link
                            href="/dashboard"
                            className="ml-20 mr-10 mt-2 text-violet-200 hover:[text-shadow:_0_0_10px_#faf5ff] transition"
                        >
                            {user.role === "admin" ? "All Songs" : "My Songs"}
                        </Link>
                        <Link
                            href="/store"
                            className="ml-20 mt-2 text-violet-200 hover:[text-shadow:_0_0_10px_#faf5ff] transition"
                        >
                            Store a Song
                        </Link>

                        <form onSubmit={handleLogout} className="ml-auto">
                            <button className="px-4 py-2 bg-violet-700 hover:bg-gray-700 rounded-lg text-violet-200 transition">
                                Logout
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="flex gap-4">
                        <Link
                            href="/login"
                            className="px-4 py-2 bg-violet-700 hover:bg-gray-700 rounded-lg text-violet-200 transition"
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
                )
            }
            main={
                <div className="flex flex-1 items-center justify-center text-center">
                    <div>
                        <h1 className="text-4xl font-bold text-violet-400 mb-4">
                            Welcome {user ? user.name : "to MySongsApp"}!
                        </h1>
                        <p className="text-lg text-violet-400">
                            Discover and share your favorite songs!
                        </p>
                    </div>
                </div>
            }
        />
    );
}
