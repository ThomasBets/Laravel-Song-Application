import { Link } from "@inertiajs/react";

export default function AuthLayout({ children }) {
    return (
        <div className="min-h-screen flex flex-col bg-neutral-900">
            <header className="w-full h-20 flex items-center bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 shadow-[0_4px_10px_rgba(139,92,246,0.6)]">
                <div className="px-6 flex items-center justify-start">
                    <span className="text-4xl mr-2">🎧</span>
                    <Link
                        href="/"
                        className="text-2xl font-bold text-violet-500"
                    >
                        MySongApp
                    </Link>
                </div>
            </header>

            <main className="w-full h-full mt-1">{children}</main>

            <footer className="text-center text-gray-500 text-sm py-6">
                &copy; {new Date().getFullYear()} MySongApp. All rights
                reserved.
            </footer>
        </div>
    );
}
