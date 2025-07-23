import { useContext, useEffect, useState } from "react";
import { Link, router, usePage } from "@inertiajs/react";
import { AppContext } from "../../Context/AppContext";
import MainLayout from "../../Layouts/MainLayout";

export default function Dashboard() {
    const { token } = useContext(AppContext);
    const { url } = usePage();

    const view =
        new URLSearchParams(url.split("?")[1]).get("view") || "mysongs";

    const [songsData, setSongsData] = useState({ data: [], links: [] });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showGenreMenu, setShowGenreMenu] = useState(false);
    const [selectedGenre, setSelectedGenre] = useState("");
    const [noSongsMessage, setNoSongsMessage] = useState("");
    const [sortDirection, setSortDirection] = useState("desc");

    async function fetchSongs(fetchUrl) {
        setError(null);
        setNoSongsMessage("");
        setLoading(true);

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

            if (data.songs.data.length === 0) {
                setNoSongsMessage(
                    selectedGenre
                        ? `No songs found for genre "${selectedGenre}"`
                        : "No songs found."
                );
            }

            setSongsData(data.songs);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const params = new URLSearchParams();
        params.set("view", view);
        if (selectedGenre) params.set("genre", selectedGenre);
        params.set("sort", sortDirection);

        fetchSongs(`/api/songs?${params.toString()}`);
    }, [view, selectedGenre, sortDirection]);

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
                setError(data.message || "Failed to delete the song.");
            }
        } catch (error) {
            setError("Network error. Please try again.");
        }
    }

    function handlePageClick(pageUrl) {
        if (!pageUrl) return;
        fetchSongs(pageUrl);
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
                    {error && <p className="error">{error}</p>}

                    {loading ? (
                        <div className="flex justify-center my-6">
                            <div className="loader ease-linear rounded-full border-4 border-t-4 border-violet-400 h-8 w-8"></div>
                        </div>
                    ) : (
                        !error && (
                            <>
                                {songsData.data.length === 0 ? (
                                    <div className="py-10 text-center text-violet-400 italic text-lg">
                                        <p>{noSongsMessage}</p>
                                        {view === "mysongs" && (
                                            <Link
                                                href="/store"
                                                className="mt-4 inline-block text-violet-400 underline"
                                            >
                                                Create a new Song!
                                            </Link>
                                        )}
                                    </div>
                                ) : (
                                    <>
                                        {/* Table and filter controls */}
                                        <div className="overflow-x-auto">
                                            <table className="text-left w-full">
                                                <thead className="bg-gray-800 text-violet-400 uppercase text-sm">
                                                    <tr>
                                                        <th className="px-4 py-4">
                                                            Title
                                                        </th>
                                                        <th className="px-4 py-3 text-left text-sm">
                                                            <button
                                                                onClick={() =>
                                                                    setShowGenreMenu(
                                                                        !showGenreMenu
                                                                    )
                                                                }
                                                                className="flex items-center gap-1 text-violet-400 uppercase"
                                                            >
                                                                Genre
                                                                <svg
                                                                    className="w-4 h-4 transform transition-transform duration-200"
                                                                    style={{
                                                                        transform:
                                                                            showGenreMenu
                                                                                ? "rotate(180deg)"
                                                                                : "rotate(0deg)",
                                                                    }}
                                                                    fill="currentColor"
                                                                    viewBox="0 0 20 20"
                                                                >
                                                                    <path
                                                                        fillRule="evenodd"
                                                                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 011.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                                                                        clipRule="evenodd"
                                                                    />
                                                                </svg>
                                                            </button>
                                                            {showGenreMenu && (
                                                                <ul className="absolute mt-2 bg-gray-800 text-violet-200 w-28 normal-case z-10 max-h-60 overflow-y-auto rounded shadow-md">
                                                                    {[
                                                                        "All",
                                                                        "Rock",
                                                                        "Pop",
                                                                        "Jazz",
                                                                        "Classical",
                                                                        "Electronic",
                                                                        "Hip-hop",
                                                                    ].map(
                                                                        (
                                                                            genre
                                                                        ) => (
                                                                            <li
                                                                                key={
                                                                                    genre
                                                                                }
                                                                                onClick={() => {
                                                                                    setSelectedGenre(
                                                                                        genre ===
                                                                                            "All"
                                                                                            ? ""
                                                                                            : genre
                                                                                    );
                                                                                    setShowGenreMenu(
                                                                                        false
                                                                                    );
                                                                                }}
                                                                                className={`px-4 py-2 cursor-pointer hover:bg-violet-500 ${
                                                                                    selectedGenre ===
                                                                                        genre ||
                                                                                    (genre ===
                                                                                        "All" &&
                                                                                        selectedGenre ===
                                                                                            "")
                                                                                        ? "bg-violet-600"
                                                                                        : ""
                                                                                }`}
                                                                            >
                                                                                {
                                                                                    genre
                                                                                }
                                                                            </li>
                                                                        )
                                                                    )}
                                                                </ul>
                                                            )}
                                                        </th>
                                                        <th className="px-4 py-3">
                                                            <button
                                                                onClick={() => {
                                                                    setSortDirection(
                                                                        (
                                                                            prev
                                                                        ) =>
                                                                            prev ===
                                                                            "asc"
                                                                                ? "desc"
                                                                                : "asc"
                                                                    );
                                                                }}
                                                                className="flex items-center gap-1 text-violet-400 uppercase"
                                                            >
                                                                Release Date
                                                                <svg
                                                                    className={`w-4 h-4 transform transition-transform duration-200 ${
                                                                        sortDirection ===
                                                                        "asc"
                                                                            ? "rotate-180"
                                                                            : ""
                                                                    }`}
                                                                    fill="currentColor"
                                                                    viewBox="0 0 20 20"
                                                                >
                                                                    <path
                                                                        fillRule="evenodd"
                                                                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 011.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                                                                        clipRule="evenodd"
                                                                    />
                                                                </svg>
                                                            </button>
                                                        </th>
                                                        <th className="px-4 py-3"></th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-gradient-to-b from-neutral-600 to-neutral-800 divide-y divide-gray-700">
                                                    {songsData.data.map(
                                                        (song) => (
                                                            <tr key={song.id}>
                                                                <td className="px-4 py-3">
                                                                    <Link
                                                                        href={`/songs/${song.id}`}
                                                                        className="text-violet-300 hover:underline"
                                                                    >
                                                                        {
                                                                            song.title
                                                                        }
                                                                    </Link>
                                                                </td>
                                                                <td className="px-4 py-3 text-violet-300">
                                                                    {song.genre}
                                                                </td>
                                                                <td className="px-4 py-3 text-violet-300">
                                                                    {
                                                                        song.release_date
                                                                    }
                                                                </td>
                                                                <td className="px-4 py-3 space-x-4">
                                                                    {view ===
                                                                        "mysongs" && (
                                                                        <Link
                                                                            href={`/songs/${song.id}/edit`}
                                                                            className="text-violet-300 hover:underline"
                                                                        >
                                                                            Edit
                                                                        </Link>
                                                                    )}
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
                                                        )
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                        <Pagination
                                            links={songsData.links}
                                            onPageClick={handlePageClick}
                                        />
                                    </>
                                )}
                            </>
                        )
                    )}
                </div>
            }
        />
    );
}
