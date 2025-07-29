import MainLayout from "../../Layouts/MainLayout";
import { router, usePage } from "@inertiajs/react";
import { AppContext } from "../../Context/AppContext";
import { useContext, useEffect, useState } from "react";

export default function Edit() {
    const { token } = useContext(AppContext);
    const { url } = usePage();

    // Extract the song ID from the URL (second-to-last segment) because the url looks like http://127.0.0.1:8000/songs/{id}/edit and we need the id
    const segments = url.split("/").filter(Boolean);
    const id = segments[segments.length - 2];

    // Initial form state
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        genre: "",
        release_date: "",
        audio_file_path: "",
    });

    const [message, setMessage] = useState("");
    const [errors, setErrors] = useState({});

    // Fetch the song details when component mounts or when id and token change
    useEffect(() => {
        async function fetchSong() {
            try {
                const res = await fetch(`/api/songs/${id}`, {
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) throw new Error("Failed to fetch song");

                const data = await res.json();
                const song = data.song;

                // Populate form with existing song data
                setFormData({
                    title: song.title || "",
                    description: song.description || "",
                    genre: song.genre || "",
                    release_date: song.release_date || "",
                });
            } catch (err) {
                setMessage(err.message); // Display error if fetch fails
            }
        }

        fetchSong();
    }, [id, token]);

    // Handle form submission to update the song
    async function handleEdit(e) {
        e.preventDefault();

        try {
            const res = await fetch(`/api/songs/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage("Update successful!");
                window.history.back();
            } else if (res.status === 422) {
                setErrors(data.errors || {}); // Show validation errors
            } else {
                setMessage("Edit is unauthorized for this user!");
            }
        } catch (error) {
            setMessage("Network error. Please check your connection.");
        }
    }

    return (
        <MainLayout
            header={
                <button
                    onClick={() => window.history.back()}
                    className="px-4 py-2 link"
                >
                    Back
                </button>
            }
            main={
                <div className="min-h-screen flex items-center justify-center w-full">
                    {/* Show loading indicator if title is not loaded yet */}
                    {!formData.title && !message ? (
                        <div className="flex justify-center my-6">
                            <div className="loader ease-linear rounded-full border-4 border-t-4 border-violet-400 h-8 w-8"></div>
                        </div>
                    ) : (
                        <form onSubmit={handleEdit} className="form">
                            <h2 className="text-2xl text-violet-300 font-bold text-center mb-6">
                                Edit a Song
                            </h2>

                            {/* Message display */}
                            {message && (
                                <p className="text-violet-300 mb-4">
                                    {message}
                                </p>
                            )}

                            {/* Title Field */}
                            <div className="mb-4">
                                <label className="block text-violet-200 mb-1">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    className="form_field"
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

                            {/* Description Field */}
                            <div className="mb-4">
                                <label className="block text-violet-200 mb-1">
                                    Description
                                </label>
                                <textarea
                                    className="form_field"
                                    rows="3"
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            description: e.target.value,
                                        })
                                    }
                                />
                                {errors.description && (
                                    <p className="error">
                                        {errors.description[0]}
                                    </p>
                                )}
                            </div>

                            {/* Genre Field */}
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
                                    <option value="" disabled>
                                        Select a Genre
                                    </option>
                                    <option value="Classical">Classical</option>
                                    <option value="Pop">Pop</option>
                                    <option value="Rock">Rock</option>
                                    <option value="Hip-hop">Hip-Hop</option>
                                    <option value="Electronic">
                                        Electronic
                                    </option>
                                    <option value="Jazz">Jazz</option>
                                </select>
                                {errors.genre && (
                                    <p className="error">{errors.genre[0]}</p>
                                )}
                            </div>

                            {/* Release Date Field */}
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

                            <div className="mb-4">
                                <label className="block text-violet-200 mb-1">
                                    Audio
                                </label>
                                <input
                                    type="file"
                                    className="w-full p-2 border text-violet-200 border-violet-200 rounded"
                                    name="audio file"
                                    accept="audio/*"
                                    value={formData.audio_file_path}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            audio_file_path: e.target.value,
                                        })
                                    }
                                />
                                {errors.audio_file_path && (
                                    <p className="error">
                                        {errors.audio_file_path[0]}
                                    </p>
                                )}
                            </div>

                            <button type="submit" className="w-full button">
                                Edit
                            </button>
                        </form>
                    )}
                </div>
            }
        />
    );
}
