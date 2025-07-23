import { Link, router } from "@inertiajs/react";
import { useContext } from "react";
import { AppContext } from "../Context/AppContext";
import MainLayout from "../Layouts/MainLayout";

export default function Home() {
    // Access global user and token state from context
    const { user, token, setUser, setToken } = useContext(AppContext);

    // Handle logout functionality
    async function handleLogout(e) {
        e.preventDefault();

        // Send logout request to the server
        const res = await fetch("/api/logout", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (res.ok) {
            // Clear user session and redirect to home page
            setUser(null);
            setToken(null);
            localStorage.removeItem("token");
            router.visit("/");
        }
    }

    return (
        <MainLayout
            // Header section of the layout
            header={
                user ? (
                    // If the user is logged in
                    <div className="flex w-full justify-between items-center ml-12">
                        <div className="flex space-x-8">
                            {user.role === "admin" ? (
                                // Admin sees both "All Songs" and "My Songs"
                                <div className="flex space-x-8">
                                    <Link
                                        href="/dashboard?view=allsongs"
                                        className="link"
                                    >
                                        All Songs
                                    </Link>
                                    <Link
                                        href="/dashboard?view=mysongs"
                                        className="link"
                                    >
                                        My Songs
                                    </Link>
                                </div>
                            ) : (
                                // Regular users see only "My Songs"
                                <Link
                                    href="/dashboard?view=mysongs"
                                    className="link"
                                >
                                    My Songs
                                </Link>
                            )}

                            {/* Add song link (visible to all logged-in users) */}
                            <Link
                                href="/store"
                                className="link"
                            >
                                Add a Song
                            </Link>
                        </div>

                        {/* User info and logout*/}
                        <div className="flex items-center space-x-6">
                            <p className="text-violet-300 text-xl">{user.name}</p>
                            <form onSubmit={handleLogout}>
                                <button className="link">Logout</button>
                            </form>
                        </div>
                    </div>
                ) : (
                    // If the user is NOT logged in, show login/register buttons
                    <div className="items-center space-x-5">
                        <Link href="/login" className="link">
                            Login
                        </Link>
                        <Link href="/register" className="link">
                            Register
                        </Link>
                    </div>
                )
            }
            // Main content of the home page
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
