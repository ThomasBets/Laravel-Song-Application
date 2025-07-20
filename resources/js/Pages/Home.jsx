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
                    <div className="flex items-center justify-between space-x-250">
                        <div className="flex space-x-20">
                            <Link
                                href="/dashboard"
                                className="text-violet-300 text-xl hover:[text-shadow:_0_0_10px_#faf5ff] transition"
                            >
                                {user.role === "admin" ? "All Songs" : "My Songs"}
                            </Link>
                            <Link
                                href="/store"
                                className="text-violet-300 text-xl hover:[text-shadow:_0_0_10px_#faf5ff] transition"
                            >
                                Store a Song
                            </Link>
                        </div>
                        <div className="flex items-center space-x-10">
                            <p className="text-violet-300 ">
                                Welcome {user.name}
                            </p>
                            <form onSubmit={handleLogout} className="ml-auto">
                                <button className="px-4 py-2 bg-violet-700 hover:bg-gray-700 rounded-lg text-violet-200 transition">
                                    Logout
                                </button>
                            </form>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-4">
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
                <div>
                    <p className="text-3xl text-violet-400">
                        Discover and share your favorite songs!
                    </p>
                </div>
            }
        />
    );
}
