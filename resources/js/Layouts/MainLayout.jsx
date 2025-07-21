import { Link } from "@inertiajs/react";
import { useContext } from "react";
import { AppContext } from "../Context/AppContext";
import { router } from "@inertiajs/react";

export default function MainLayout({ header, main }) {
  const { token, setUser, setToken } = useContext(AppContext);

  async function handleLogout(e) {
    e.preventDefault();
    const response = await fetch("/api/logout", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.ok) {
      setUser(null);
      setToken(null);
      localStorage.removeItem("token");
      router.visit("/");
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-neutral-900">
      <header className="w-full h-20 bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 shadow-[0_4px_10px_rgba(139,92,246,0.6)]">
        <div className=" mx-auto px-6 flex justify-between items-center h-full">
          <div className="flex items-center space-x-2">
            <span className="text-4xl mr-2">🎧</span>
            <Link href="/" className="text-2xl font-bold text-violet-500 ">
              MySongApp
            </Link>
          </div>
          {header}
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center text-center px-4">
        {main}
      </main>

      <footer className="text-center text-gray-500 text-sm py-6">
        &copy; {new Date().getFullYear()} MySongApp. All rights reserved.
      </footer>
    </div>
  );
}

