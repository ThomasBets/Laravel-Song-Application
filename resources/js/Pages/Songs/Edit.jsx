import MainLayout from "../../Layouts/MainLayout";
import { router } from "@inertiajs/react";
import { AppContext } from "../../Context/AppContext";
import { useContext, useEffect, useState } from "react";

export default function Edit() {
    const { currentSong, token } = useContext(AppContext);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        genre: "",
        release_date: "",
    });

    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [errors, setErrors] = useState({});

    // Sync formData when currentSong is available
    useEffect(() => {
        if (currentSong) {
            setFormData({
                title: currentSong.title || "",
                description: currentSong.description || "",
                genre: currentSong.genre || "",
                release_date: currentSong.release_date || "",
            });
            setLoading(false);
        }
    }, [currentSong]);

    async function handleEdit(e) {
        e.preventDefault();

        try {
            const res = await fetch(`/api/songs/${currentSong.id}`, {
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
                router.visit(`/songs/${currentSong.id}`);
            } else if (res.status === 422) {
                setErrors(data.errors || {});
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
                    onClick={() => router.visit(`/songs/${currentSong?.id}`)}
                    className="button"
                >
                    Back
                </button>
            }
            main={
                <div className="min-h-screen flex items-center justify-center w-full">
                    {loading ? (
                        <p className="text-violet-400">Loading song data...</p>
                    ) : (
                        <form onSubmit={handleEdit} className="form">
                            <h2 className="text-2xl text-violet-300 font-bold text-center mb-6">
                                Edit a Song
                            </h2>

                            {message && (
                                <p className="text-violet-300 mb-4">{message}</p>
                            )}

                            {/* Title */}
                            <div className="mb-4">
                                <label className="block text-violet-200 mb-1">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    className="w-full p-2 border text-violet-200 border-violet-200 rounded placeholder-violet-200"
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

                            {/* Description */}
                            <div className="mb-4">
                                <label className="block text-violet-200 mb-1">
                                    Description
                                </label>
                                <input
                                    type="text"
                                    className="w-full p-2 border text-violet-200 border-violet-200 rounded placeholder-violet-200"
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

                            {/* Genre */}
                            <div className="mb-6">
                                <label className="block text-violet-200 mb-1">
                                    Genre
                                </label>
                                <select
                                    className="w-full p-2 border bg-neutral-700 text-violet-200 border-violet-200 rounded placeholder-violet-200"
                                    value={formData.genre}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            genre: e.target.value,
                                        })
                                    }
                                >
                                    <option value="" disabled>Select a Genre</option>
                                    <option value="Classical">Classical</option>
                                    <option value="Pop">Pop</option>
                                    <option value="Rock">Rock</option>
                                    <option value="Hip-hop">Hip-Hop</option>
                                    <option value="Electronic">Electronic</option>
                                    <option value="Jazz">Jazz</option>
                                </select>
                                {errors.genre && (
                                    <p className="error">{errors.genre[0]}</p>
                                )}
                            </div>

                            {/* Release Date */}
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
                                Edit
                            </button>
                        </form>
                    )}
                </div>
            }
        />
    );
}
