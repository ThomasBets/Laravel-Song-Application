import { useContext, useEffect, useState } from "react";
import { Link, router, usePage } from "@inertiajs/react";
import { AppContext } from "../../Context/AppContext";
import MainLayout from "../../Layouts/MainLayout";

export default function Dashboard() {
    const { token } = useContext(AppContext);
    const { url } = usePage();

    // Get ?view=mysongs or ?view=allsongs from URL, default to mysongs
    const urlParams = new URLSearchParams(url.split("?")[1]);
    const view = urlParams.get("view") || "mysongs";


    const [songsData, setSongsData] = useState({ data: [], links: [] });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch songs based on view & URL (for pagination)
    async function fetchSongs(fetchUrl = `/api/songs?view=${view}`) {
        setLoading(true);
        setError(null);

        try {
            const res = await fetch(fetchUrl, {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();

            if (!res.ok)
                throw new Error(data.message || "Failed to fetch songs");

            setSongsData(data.songs);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchSongs();
    }, [view]);

    function handlePageClick(pageUrl) {
        if (!pageUrl) return;
        fetchSongs(pageUrl);
    }

    async function handleDelete(id) {
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
                router.visit(`/dashboard?view=${view}`);
            } else {
                const data = await res.json();
                setErrors(data.message || "Failed to delete the song.");
            }
        } catch (error) {
            setErrors("Network error. Please try again.");
        }
    }

    function Pagination({ links, onPageClick }) {
        if (!links) return null;
        return (
            <div className="flex gap-2 mt-6 justify-center flex-wrap">
                {links.map((link, idx) => (
                    <button
                        key={idx}
                        disabled={!link.url}
                        onClick={async () => {
                            await onPageClick(link.url);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                        className={`px-3 py-1 rounded border text-sm transition-all duration-200 ${
                            link.active
                                ? "bg-violet-500 text-violet-200 font-semibold"
                                : "bg-violet-300 text-violet-900 hover:bg-violet-400"
                        } ${!link.url ? "opacity-50 cursor-not-allowed" : ""}`}
                    />
                ))}
            </div>
        );
    }

    return (
        <MainLayout
            header={
                <button onClick={() => router.visit("/")} className="button">
                    Back
                </button>
            }
            main={
                <div className="p-6 text-neutral-900">
                    {loading && <p>Loading songs...</p>}

                    {error && <p className="error">{error}</p>}

                    {!loading && !error && songsData.data.length === 0 && (
                        <p className="text-center text-violet-400">
                            No songs to display.
                        </p>
                    )}

                    {!loading && !error && songsData.data.length > 0 && (
                        <>
                            <div className="overflow-x-auto">
                                <table className=" text-left ">
                                    <thead className="bg-gray-800 text-violet-400 uppercase text-sm">
                                        <tr>
                                            <th className="px-4 py-4">Title</th>
                                            <th className="px-4 py-3">Genre</th>
                                            <th className="px-4 py-3">
                                                Release Date
                                            </th>
                                            <th className="px-4 py-3"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-gradient-to-b from-neutral-600 to-neutral-800 divide-y divide-gray-700">
                                        {songsData.data.map((song) => (
                                            <tr key={song.id}>
                                                <td className="px-4 py-3">
                                                    <Link
                                                        href={`/songs/${song.id}`}
                                                        className="text-violet-300 hover:underline"
                                                    >
                                                        {song.title}
                                                    </Link>
                                                </td>
                                                <td className="px-4 py-3 text-violet-300">
                                                    {song.genre}
                                                </td>
                                                <td className="px-4 py-3 text-violet-300">
                                                    {song.release_date}
                                                </td>
                                                <td className="px-4 py-3 space-x-4">
                                                    <Link
                                                        href={`/songs/${song.id}/edit`}
                                                        className="text-violet-300 hover:underline"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                song.id
                                                            )
                                                        }
                                                        className="text-violet-300 hover:underline"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <Pagination
                                links={songsData.links}
                                onPageClick={handlePageClick}
                            />
                        </>
                    )}
                </div>
            }
        />
    );
}
