import { Link, router, usePage } from "@inertiajs/react";
import { useContext, useState } from "react";
import { AppContext } from "../../Context/AppContext";
import MainLayout from "../../Layouts/MainLayout";

export default function Create() {
    const { url } = usePage();
    const searchParams = new URLSearchParams(url.split("?")[1]);
    const playlist_id = searchParams.get("playlist_id");
    const type = searchParams.get("type");
    const view = new URLSearchParams(window.location.search).get("view");

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        genre: "",
        release_date: "",
        audio_file_path: null,
        playlist_id: playlist_id || null,
    });

    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState("");
    const { token } = useContext(AppContext);

    async function handleCreate(e) {
        e.preventDefault();

        const body = new FormData();
        body.append("title", formData.title);
        body.append("description", formData.description);
        body.append("genre", formData.genre);
        body.append("release_date", formData.release_date);
        if (formData.audio_file_path) {
            body.append("audio_file_path", formData.audio_file_path);
        }
        if (formData.playlist_id) {
            body.append("playlist_id", formData.playlist_id);
        }

        try {
            const res = await fetch("/api/songs", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body,
            });

            const data = await res.json();

            if (res.ok) {
                setMessage("Store successful!");
                if (playlist_id) {
                    router.visit(`/playlists/${playlist_id}?type=${type}`);
                } else {
                    router.visit(`/dashboard?view=${view}`);
                }
            } else if (res.status === 422) {
                setErrors(data.errors || {});
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
                            router.visit(`/dashboard?view=${view}`);
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

                        {/* Description */}
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

                        {/* Genre */}
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

                        {/* Audio File Upload */}
                        {/* <div className="mb-4">
                            <label className="block text-violet-200 mb-1">
                                Audio File
                            </label>
                            <input
                                type="file"
                                accept="audio/*"
                                className="w-full p-2 border text-violet-200 border-violet-200 rounded"
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        audio_file_path: e.target.files[0],
                                    })
                                }
                            />
                            {errors.audio_file_path && (
                                <p className="error">{errors.audio_file_path[0]}</p>
                            )}
                        </div> */}

                        {/* Submit Button */}
                        <button type="submit" className="w-full button">
                            Store
                        </button>
                    </form>
                </div>
            }
        />
    );
}
