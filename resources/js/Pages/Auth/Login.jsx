import AuthLayout from "@/Layouts/AuthLayout";
import { useContext, useState } from "react";
import { router } from "@inertiajs/react";
import { AppContext } from "../../Context/AppContext";

export default function Login() {
    // State to hold form inputs (email and password)
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    // Access context to store token after successful login
    const { setToken } = useContext(AppContext);

    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    // Form submission handler
    async function handleLogin(e) {
        e.preventDefault();
        setErrors({});
        setMessage("");
        setLoading(true);

        try {
            // Send POST request to login API
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
                // On success: store token and redirect to homepage
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
            <form onSubmit={handleLogin} className="form">
                {/* Title */}
                <h2 className="text-2xl text-violet-300 font-bold text-center mb-6">
                    Login
                </h2>

                {/* Show general success or error message */}
                {message && (
                    <p className="text-violet-300 text-center mb-4">
                        {message}
                    </p>
                )}

                {/* Show loading indicator */}
                {loading && (
                    <p className="text-violet-400 text-center mb-4">
                        Logging in...
                    </p>
                )}

                {/* Email input field */}
                <div className="mb-4">
                    <label className="block text-violet-200 mb-1">Email</label>
                    <input
                        type="email"
                        className="form_field"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                        }
                    />
                    {/* Display email field errors */}
                    {errors.email && <p className="error">{errors.email[0]}</p>}
                </div>

                {/* Password input field */}
                <div className="mb-4">
                    <label className="block text-violet-200 mb-1">
                        Password
                    </label>
                    <input
                        type="password"
                        className="form_field"
                        placeholder="********"
                        value={formData.password}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                password: e.target.value,
                            })
                        }
                    />
                    {/* Display password field errors */}
                    {errors.password && (
                        <p className="error">{errors.password[0]}</p>
                    )}
                </div>

                {/* Submit button */}
                <button
                    type="submit"
                    className="w-full button"
                >
                    Login
                </button>

                {/* Navigation link to register page */}
                <p className="mt-4 text-sm text-center text-violet-200">
                    Don't have an account?{" "}
                    <a
                        href="/register"
                        className="text-violet-500 hover:underline"
                    >
                        Register
                    </a>
                </p>
            </form>
        </div>
    );
}

// Wrap this page in the AuthLayout
Login.layout = (page) => <AuthLayout>{page}</AuthLayout>;
