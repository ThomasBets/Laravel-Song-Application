import AuthLayout from "@/Layouts/AuthLayout";
import { useContext, useState } from "react";
import { router } from "@inertiajs/react";
import { AppContext } from "../../Context/AppContext";

export default function Register() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        role: "",
    });

    const { setToken } = useContext(AppContext);

    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleRegister(e) {
        e.preventDefault();
        setErrors({});
        setMessage("");
        setLoading(true);

        try {
            const response = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();

            if (response.ok) {
                setMessage("Registration successful!");
                localStorage.setItem("token", data.token);
                setToken(data.token);
                router.visit("/home");
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
        // console.log(formData);
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <form
                onSubmit={handleRegister}
                className="bg-white p-6 rounded shadow-md w-full max-w-sm"
            >
                <h2 className="text-2xl font-bold text-center mb-6">
                    Register
                </h2>

                <div className="mb-4">
                    <label className="block text-gray-700 mb-1">Name</label>
                    <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                        }
                    />
                    {errors.name && (
                        <p className="text-red-600 text-sm">{errors.name[0]}</p>
                    )}
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 mb-1">Role</label>
                    <select
                        className="w-full p-2 border border-gray-300 rounded"
                        value={formData.role}
                        onChange={(e) =>
                            setFormData({ ...formData, role: e.target.value })
                        }
                    >
                        <option value="" disabled>
                            Select a role
                        </option>
                        <option value="admin">Admin</option>
                        <option value="regular_user">Regular User</option>
                    </select>
                    {errors.role && (
                        <p className="text-red-600 text-sm">{errors.role[0]}</p>
                    )}
                </div>

                <div className="mb-4">
                    <label className="block text-gray-700 mb-1">Email</label>
                    <input
                        type="email"
                        className="w-full p-2 border border-gray-300 rounded"
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
                    <label className="block text-gray-700 mb-1">Password</label>
                    <input
                        type="password"
                        className="w-full p-2 border border-gray-300 rounded"
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

                <div className="mb-6">
                    <label className="block text-gray-700 mb-1">
                        Confirm Password
                    </label>
                    <input
                        type="password"
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="********"
                        value={formData.password_confirmation}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                password_confirmation: e.target.value,
                            })
                        }
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                >
                    Register
                </button>

                <p className="mt-4 text-sm text-center">
                    Already have an account?{" "}
                    <a href="/login" className="text-blue-500 hover:underline">
                        Login
                    </a>
                </p>
            </form>
        </div>
    );
}

Register.layout = (page) => <AuthLayout>{page}</AuthLayout>;
