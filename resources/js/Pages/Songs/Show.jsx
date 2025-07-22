import { useEffect, useState, useContext } from "react";
import { usePage } from "@inertiajs/react";
import { AppContext } from "../../Context/AppContext";
import MainLayout from "../../Layouts/MainLayout";

export default function Show() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [song, setSong] = useState(null);
    const { token } = useContext(AppContext);

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
                setSong(data.song);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchSong();
    }, [id, token]);

    return (
        <MainLayout
            header={
                <button
                    onClick={() => window.history.back()}
                    className="button"
                >
                    Back
                </button>
            }
            main={
                <div className="p-6 text-neutral-900">
                    {loading && <p>Loading...</p>}
                    {error && <p className="errors">{error}</p>}
                    {!loading && !error && song && (
                        <>
                            <h1 className="text-lg font-bold text-violet-400 mb-8">
                                Title: {song.title}
                            </h1>
                            <p className="text-lg font-bold text-violet-400 mb-8">
                                Description: {song.description ?? "No description available."}
                            </p>
                            <p className="text-lg font-bold text-violet-400 mb-8">
                                Genre: {song.genre}
                            </p>
                            <p className="text-lg font-bold text-violet-400">
                                Release Date: {song.release_date}
                            </p>
                        </>
                    )}
                </div>
            }
        />
    );
}
