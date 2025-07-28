import { Link, router, usePage } from "@inertiajs/react";
import { useContext, useState } from "react";
import { AppContext } from "../../Context/AppContext";
import MainLayout from "../../Layouts/MainLayout";

export default function Create() {
    const { url } = usePage();
    const searchParams = new URLSearchParams(url.split("?")[1]);
    const playlist_id = searchParams.get("playlist_id");
    const type = searchParams.get("type");

    // Form state to store input values
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        genre: "",
        release_date: "",
        playlist_id: playlist_id || null,
    });

    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState("");
    const { token } = useContext(AppContext);

    // Handle form submission for creating a new song
    async function handleCreate(e) {
        e.preventDefault();

        try {
            const res = await fetch("/api/songs", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage("Store successful!");
                if (playlist_id) {
                    router.visit(`/playlists/${playlist_id}?type=${type}`);
                } else {
                    router.visit("/");
                }
            } else if (res.status === 422) {
                setErrors(data.errors || {}); // Display validation errors
            } else {
                setMessage("Something went wrong. Please try again.");
            }
        } catch (error) {
            setMessage("Network error. Please check your connection.");
        }
    }

    return (
        <MainLayout
            header={
                <button
                    onClick={() => {
                        if (playlist_id) {
                            const url = `/playlists/${playlist_id}${
                                type ? `?type=${type}` : ""
                            }`;
                            router.visit(url);
                        } else {
                            router.visit("/dashboard");
                        }
                    }}
                    className="px-4 py-2 link"
                >
                    Back
                </button>
            }
            main={
                <div className="min-h-screen flex items-center justify-center w-full">
                    <form onSubmit={handleCreate} className="form">
                        <h2 className="text-2xl text-violet-300 font-bold text-center mb-6">
                            Add a Song
                        </h2>

                        {/* Display any success or error message */}
                        {message && (
                            <p className="text-violet-300 mb-4">{message}</p>
                        )}

                        {/* Title Input */}
                        <div className="mb-4">
                            <label className="block text-violet-200 mb-1">
                                Title
                            </label>
                            <input
                                type="text"
                                className="form_field"
                                placeholder="Stairway to Heaven"
                                value={formData.title}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        title: e.target.value,
                                    })
                                }
                            />
                            {errors.title && (
                                <p className="error">{errors.title[0]}</p>
                            )}
                        </div>

                        {/* Description Input */}
                        <div className="mb-4">
                            <label className="block text-violet-200 mb-1">
                                Description
                            </label>
                            <textarea
                                className="form_field"
                                rows="3"
                                placeholder="Led Zeppelin (1971)"
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        description: e.target.value,
                                    })
                                }
                            />
                            {errors.description && (
                                <p className="error">{errors.description[0]}</p>
                            )}
                        </div>

                        {/* Genre Select */}
                        <div className="mb-6">
                            <label className="block text-violet-200 mb-1">
                                Genre
                            </label>
                            <select
                                className="bg-neutral-700 form_field"
                                value={formData.genre}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        genre: e.target.value,
                                    })
                                }
                            >
                                <option
                                    className="text-violet-200"
                                    value=""
                                    disabled
                                >
                                    Select a Genre
                                </option>
                                <option
                                    className="text-violet-200"
                                    value="Classical"
                                >
                                    Classical
                                </option>
                                <option className="text-violet-200" value="Pop">
                                    Pop
                                </option>
                                <option
                                    className="text-violet-200"
                                    value="Rock"
                                >
                                    Rock
                                </option>
                                <option
                                    className="text-violet-200"
                                    value="Hip-hop"
                                >
                                    Hip-Hop
                                </option>
                                <option
                                    className="text-violet-200"
                                    value="Electronic"
                                >
                                    Electronic
                                </option>
                                <option
                                    className="text-violet-200"
                                    value="Jazz"
                                >
                                    Jazz
                                </option>
                            </select>
                            {errors.genre && (
                                <p className="error">{errors.genre[0]}</p>
                            )}
                        </div>

                        {/* Release Date Input */}
                        <div className="mb-4">
                            <label className="block text-violet-200 mb-1">
                                Release date
                            </label>
                            <input
                                type="date"
                                className="w-full p-2 border text-violet-200 border-violet-200 rounded"
                                value={formData.release_date}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        release_date: e.target.value,
                                    })
                                }
                            />
                            {errors.release_date && (
                                <p className="error">
                                    {errors.release_date[0]}
                                </p>
                            )}
                        </div>

                        <button type="submit" className="w-full button">
                            Store
                        </button>
                    </form>
                </div>
            }
        />
    );
}
