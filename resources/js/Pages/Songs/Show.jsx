import { useContext, useEffect, useState } from "react";
import { usePage, router } from "@inertiajs/react";
import { AppContext } from "../../Context/AppContext";
import MainLayout from "../../Layouts/MainLayout";

export default function Show() {
    const [loading, setLoading] = useState(true);
    const [errors, seterrorss] = useState(null);
    const { currentSong, setCurrentSong, token } = useContext(AppContext);

    const { url } = usePage();
    const id = url.split("/").pop();

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
                setCurrentSong(data.song);
                setLoading(false);
            } catch (err) {
                seterrorss(err.message);
                setLoading(false);
            }
        }

        fetchSong();
    }, [id, setCurrentSong, token]);

    async function handleDelete() {
        if (!confirm("Are you sure you want to delete this song?")) return;

        try {
            const res = await fetch(`/api/songs/${id}`, {
                method: "DELETE",
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.ok) {
                router.visit("/dashboard");
            } else {
                const data = await res.json();
                setErrors(data.message || "Failed to delete the song.");
            }
        } catch (error) {
            setErrors("Network error. Please try again.");
        }
    }


    return (
        <MainLayout
            header={
                <button
                    onClick={() => router.visit("/dashboard")}
                    className="button"
                >
                    Back
                </button>
            }
            main={
                <div className="p-6">
                    {loading && <p>Loading...</p>}

                    {errors && <p className="errors">{errors}</p>}

                    {!loading && !errors && currentSong && (
                        <>
                            <h1 className="text-2xl font-bold text-violet-400 mb-4">
                                {currentSong.title}
                            </h1>
                            <p className="text-lg font-bold text-violet-400 mb-4">
                                Description:{" "}
                                {currentSong.description ??
                                    "No description available."}
                            </p>
                            <p className="text-lg font-bold text-violet-400 mb-4">
                                Genre: {currentSong.genre}
                            </p>
                            <p className="text-lg font-bold text-violet-400">
                                Release Date: {currentSong.release_date}
                            </p>

                            <div className="space-x-10 mt-7">
                                <button
                                    onClick={() =>
                                        router.visit(`/songs/${id}/edit`)
                                    }
                                    className="button"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={(handleDelete)}
                                    className="button"
                                >
                                    Delete
                                </button>
                            </div>
                        </>
                    )}
                </div>
            }
        />
    );
}
