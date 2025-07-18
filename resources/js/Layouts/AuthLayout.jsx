import { Link } from "@inertiajs/react";

export default function AuthLayout({ children }) {
    return (
        <div className="min-h-screen flex flex-col bg-neutral-900">
            <header className="bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 shadow-[0_4px_10px_rgba(139,92,246,0.6)] py-1">
                <div className="max-w-8xl mx-auto px-6 py-4 flex items-center">
                    <span className="text-3xl mr-2">🎧</span>
                    <Link
                        href="/"
                        className="text-2xl font-bold text-violet-500"
                    >
                        MySongApp
                    </Link>
                </div>
            </header>

            <main className="w-full h-full mt-1">{children}</main>

            <footer className="text-center text-violet-400 text-sm py-6">
                &copy; {new Date().getFullYear()} MySongApp. All rights
                reserved.
            </footer>
        </div>
    );
}
