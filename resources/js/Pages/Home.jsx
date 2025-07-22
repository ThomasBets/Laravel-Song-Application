import { Link, router } from "@inertiajs/react";
import { useContext } from "react";
import { AppContext } from "../Context/AppContext";
import MainLayout from "../Layouts/MainLayout";

export default function Home() {
    const { user, token, setUser, setToken } = useContext(AppContext);

    async function handleLogout(e) {
        e.preventDefault();

        const res = await fetch("/api/logout", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (res.ok) {
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
                    <div className="flex w-full justify-between items-center ml-12">
                        {/* Left side: Links */}
                        <div className="flex space-x-8">
                            {user.role === "admin" ? (
                                <div className="flex space-x-8">
                                    <Link
                                        href="/dashboard?view=allsongs"
                                        className="text-violet-300 text-xl hover:[text-shadow:_0_0_10px_#faf5ff] transition"
                                    >
                                        All Songs
                                    </Link>
                                    <Link
                                        href="/dashboard?view=mysongs"
                                        className="text-violet-300 text-xl hover:[text-shadow:_0_0_10px_#faf5ff] transition"
                                    >
                                        My Songs
                                    </Link>
                                </div>
                            ) : (
                                <Link
                                    href="/dashboard?view=mysongs"
                                    className="text-violet-300 text-xl hover:[text-shadow:_0_0_10px_#faf5ff] transition"
                                >
                                    My Songs
                                </Link>
                            )}

                            <Link
                                href="/store"
                                className="text-violet-300 text-xl hover:[text-shadow:_0_0_10px_#faf5ff] transition"
                            >
                                Add a Song
                            </Link>
                        </div>

                        <div className="flex items-center space-x-6">
                            <p className="text-violet-300">
                                {user.name}
                            </p>
                            <form onSubmit={handleLogout}>
                                <button className="button">Logout</button>
                            </form>
                        </div>
                    </div>
                ) : (
                    <div className="items-center space-x-5">
                        <Link href="/login" className="button">
                            Login
                        </Link>
                        <Link href="/register" className="button">
                            Register
                        </Link>
                    </div>
                )
            }
            main={
                <div>

                    <p className="text-3xl fancy_text">
                        Discover and share your favorite songs!
                    </p>
                </div>
            }
        />
    );
}
