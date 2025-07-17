import { Link } from "@inertiajs/react";

export default function AuthLayout({ children }) {
    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
            <header className="bg-emerald-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-4 ">
                    <Link
                        href="/"
                        className="text-xl font-semibold text-indigo-500"
                    >
                        🎵 MySongApp
                    </Link>
                </div>
            </header>

            <main className="w-full h-full bg-gray-50 ">{children}</main>

            <footer className="text-center text-gray-600 text-sm py-6">
                &copy; {new Date().getFullYear()} MySongApp. All rights
                reserved.
            </footer>
        </div>
    );
}
