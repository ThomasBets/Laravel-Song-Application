import AuthLayout from "@/Layouts/AuthLayout";
import { useContext, useState } from "react";
import { router } from "@inertiajs/react";
import { AppContext } from "../../Context/AppContext";

export default function Login() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const { setToken } = useContext(AppContext);

    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleLogin(e) {
        e.preventDefault();
        setErrors({});
        setMessage("");
        setLoading(true);

        try {
            const response = await fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();

            if (response.ok) {
                setMessage("Login successful!");
                localStorage.setItem("token", data.token);
                setToken(data.token);
                router.visit("/");
            } else if (response.status === 422) {
                setErrors(data.errors || {});
            } else {
                setMessage("Something went wrong. Please try again.");
            }
        } catch (error) {
            setMessage("Network error. Please check your connection.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <form
                onSubmit={handleLogin}
                className="bg-gradient-to-b from-neutral-600 to-neutral-800 p-6 rounded shadow-md w-full max-w-sm"
            >
                <h2 className="text-2xl text-violet-300 font-bold text-center mb-6">Login</h2>

                <div className="mb-4">
                    <label className="block text-violet-200 mb-1">Email</label>
                    <input
                        type="email"
                        className="w-full p-2 border text-violet-200 border-violet-200 rounded placeholder-violet-200"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                        }
                    />
                    {errors.email && (
                        <p className="text-red-600 text-sm">
                            {errors.email[0]}
                        </p>
                    )}
                </div>

                <div className="mb-4">
                    <label className="block text-violet-200 mb-1">Password</label>
                    <input
                        type="password"
                        className="w-full p-2 border text-violet-200 border-violet-200 rounded placeholder-violet-200"
                        placeholder="********"
                        value={formData.password}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                password: e.target.value,
                            })
                        }
                    />
                    {errors.password && (
                        <p className="text-red-600 text-sm">
                            {errors.password[0]}
                        </p>
                    )}
                </div>

                <button
                    type="submit"
                    className="w-full bg-violet-600 text-violet-100 py-2 rounded hover:bg-violet-700"
                >
                    Login
                </button>

                <p className="mt-4 text-sm text-center text-violet-200">
                    Don't have an account?{" "}
                    <a href="/register" className="text-violet-500 hover:underline">
                        Register
                    </a>
                </p>
            </form>
        </div>
    );
}

Login.layout = (page) => <AuthLayout>{page}</AuthLayout>;
