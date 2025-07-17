import { Link } from "@inertiajs/react";

export default function AuthLayout({ children }) {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <header className="bg-gray-950 shadow-indigo-600 shadow-md py-1">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <Link
                        href="/"
                        className="text-2xl font-bold text-violet-500"
                    >
                        🎵 MySongApp
                    </Link>
                </div>
            </header>

            <main className="w-full h-full bg-gray-50 mt-1">{children}</main>

            <footer className="text-center text-gray-600 text-sm py-6">
                &copy; {new Date().getFullYear()} MySongApp. All rights
                reserved.
            </footer>
        </div>
    );
}
