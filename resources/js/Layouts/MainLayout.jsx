import { Link } from "@inertiajs/react";

export default function MainLayout({ children }) {
    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 flex-col">
            <header className="bg-emerald-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <Link
                        href="/dashboard"
                        className="text-xl font-semibold text-indigo-500"
                    >
                        🎵 MySongApp
                    </Link>
                    <div className="flex gap-4">
                        <>
                            <Link
                                href="/login"
                                className="text-sm text-indigo-500 hover:underline"
                            >
                                Login
                            </Link>

                            <button className="text-sm text-red-600 hover:underline">
                                Logout
                            </button>
                        </>
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-5xl mx-auto py-10 px-4">
                {children}
            </main>

            <footer className="mt-10 text-center text-gray-600 text-sm">
                &copy; {new Date().getFullYear()} MySongApp. All rights
                reserved.
            </footer>
        </div>
    );
}
