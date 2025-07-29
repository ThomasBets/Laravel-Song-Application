import MainLayout from "../../Layouts/MainLayout";
import { AppContext } from "../../Context/AppContext";
import { useContext, useState, useEffect } from "react";
import { router, usePage } from "@inertiajs/react";

export default function PlaylistEdit() {
    const { token } = useContext(AppContext);

    const { url } = usePage();

    const id = url.split("?")[0].split("/").pop();
    const type =
        new URLSearchParams(url.split("?")[1]).get("type") || "personal";

    const [formData, setFormData] = useState({
        title: "",
        visibility: "",
    });

    const [message, setMessage] = useState("");
    const [errors, setErrors] = useState({});

    useEffect(() => {
        async function fetchPlaylist() {
            try {
                const res = await axios.get(`/api/playlists/${id}`, {
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                const playlist = res.data.playlist;

                // Populate form with existing playlist data
                setFormData({
                    title: playlist.title || "",
                    visibility: playlist.visibility || "", // not description
                });
            } catch (err) {
                setMessage(
                    err.response?.data?.message || "Failed to fetch playlist"
                );
            }
        }

        fetchPlaylist();
    }, [id, token]);

    async function handleEdit(e) {
        e.preventDefault();

        try {
            const res = await axios.put(`/api/playlists/${id}`, formData, {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            setMessage("Update successful!");
           router.visit(`/pDashboard?type=${type}`);
        } catch (error) {
            if (error.response) {
                if (error.response.status === 422) {
                    setErrors(error.response.data.errors || {});
                } else if (error.response.status === 403) {
                    setMessage("Edit is unauthorized for this user!");
                } else {
                    setMessage(
                        error.response.data.message || "Something went wrong."
                    );
                }
            } else {
                setMessage("Network error. Please check your connection.");
            }
        }
    }

    return (
        <MainLayout
            header={
                <button
                    onClick={() => router.visit(`/pDashboard?type=${type}`)}
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
                                Edit a Playlist
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

                            {/* visibility Field */}
                            <div className="mb-6">
                                <label className="block text-violet-200 mb-1">
                                    Visibility
                                </label>
                                <select
                                    className="bg-neutral-700 form_field"
                                    value={formData.visibility}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            visibility: e.target.value,
                                        })
                                    }
                                >
                                    <option value="" disabled>
                                        Select a visibility
                                    </option>
                                    <option value="private">Private</option>
                                    <option value="public">Public</option>
                                </select>
                                {errors.visibility && (
                                    <p className="error">
                                        {errors.visibility[0]}
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
