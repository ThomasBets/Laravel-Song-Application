import { useEffect, useState, useContext } from "react";
import { usePage } from "@inertiajs/react";
import { AppContext } from "../../Context/AppContext";
import MainLayout from "../../Layouts/MainLayout";
import WaveformPlayer from "@/Components/WaveformPlayer";

export default function Show() {
    const [error, setError] = useState(null); // For handling any fetch errors
    const [song, setSong] = useState(null); // Song data will be stored here
    const [loading, setLoading] = useState(true); // Loading state for fetch status
    const { token } = useContext(AppContext); // Get the auth token from context

    const { url } = usePage(); // Get current page info from Inertia
    const id = url.split("/").pop(); // Extract song ID from the URL

    useEffect(() => {
        // Function to fetch song data by ID
        async function fetchSong() {
            setLoading(true); // Start loading when fetch begins
            setError(null); // Clear previous errors

            try {
                const res = await fetch(`/api/songs/${id}`, {
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                // If request fails, throw an error
                if (!res.ok) throw new Error("Failed to fetch song");

                // Parse JSON response and save the song
                const data = await res.json();
                setSong(data.song);
            } catch (err) {
                // Store error message to display
                setError(err.message);
                setSong(null); // Clear song on error
            } finally {
                setLoading(false); // Stop loading regardless of success or failure
            }
        }

        fetchSong();
    }, [id, token]); // Run on component mount or when ID/token changes

    return (
        <MainLayout
            // Back button rendered in layout header
            header={
                <button
                    onClick={() => window.history.back()}
                    className="px-4 py-2 link"
                >
                    Back
                </button>
            }
            // Main content area of the layout
            main={
                <div className="p-6 text-neutral-900">
                    {/* Show loading indicator */}
                    {loading && (
                        <div className="flex justify-center my-6">
                            <div className="loader ease-linear rounded-full border-4 border-t-4 border-violet-400 h-8 w-8"></div>
                        </div>
                    )}

                    {/* Show error if any */}
                    {!loading && error && <p className="errors">{error}</p>}

                    {/* Display song details if song data is available and no error */}
                    {!loading && !error && song && (
                        <>
                            <h1 className="text-lg font-bold text-violet-400 mb-8">
                                Title: {song.title}
                            </h1>
                            <p className="text-lg font-bold text-violet-400 mb-8">
                                Description:{" "}
                                {song.description ??
                                    "No description available."}
                            </p>
                            <p className="text-lg font-bold text-violet-400 mb-8">
                                Genre: {song.genre}
                            </p>
                            <p className="text-lg font-bold text-violet-400">
                                Release Date: {song.release_date}
                            </p>
                            <WaveformPlayer audioUrl={song.audio_url} />
                        </>
                    )}

                    {/* Show fallback message if no song is fetched yet */}
                    {!loading && !error && !song && (
                        <p className="text-violet-400 italic text-center">
                            No song data available.
                        </p>
                    )}
                </div>
            }
        />
    );
}
