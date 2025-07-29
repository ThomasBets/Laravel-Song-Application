import { useContext, useState } from "react";
import MainLayout from "../../Layouts/MainLayout";
import axios from "axios";
import { router } from "@inertiajs/react";
import { AppContext } from "../../Context/AppContext";

export default function PlaylistDashboard() {
    const { token } = useContext(AppContext);
    const [formData, setFormData] = useState({
        title: "",
        visibility: "",
    });
    const [errors, setErrors] = useState({});

    const type = new URLSearchParams(window.location.search).get("type");

    async function handleCreate(e) {
        e.preventDefault();

        try {
            await axios.post("/api/playlists", formData, {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            router.visit(`/pDashboard?type=${type}`);
        } catch (error) {
            console.log("Validation error response:", error.response);

            if (error.response?.status === 422) {
                setErrors(error.response.data.errors || {});
            } else {
                console.error("Unexpected error:", error);
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
                    <form onSubmit={handleCreate} className="form">
                        <h2 className="text-2xl text-violet-300 font-bold text-center mb-6">
                            Add a Playlist
                        </h2>

                        <div className="mb-4">
                            <label className="block text-violet-200 mb-1">
                                Title
                            </label>
                            <input
                                type="text"
                                className="form_field"
                                placeholder="My playlist"
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
                                    Select visibility
                                </option>
                                <option value="private">Private</option>
                                <option value="public">Public</option>
                            </select>
                            {errors.visibility && (
                                <p className="error">{errors.visibility[0]}</p>
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
