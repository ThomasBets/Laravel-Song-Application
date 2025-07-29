import MainLayout from "../../Layouts/MainLayout";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppContext } from "../../Context/AppContext";
import { router, usePage } from "@inertiajs/react";
import { Link } from "@inertiajs/react";
import Pagination from "@/Components/Pagination";

export default function PlaylistDashboard() {
    const { url } = usePage();
    const params = new URLSearchParams(url.split("?")[1]);
    const defaultType = params.get("type") || "personal";

    const [type, setType] = useState(defaultType);
    const [playlistsData, setPlaylistsData] = useState({
        data: [],
        links: [],
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const { token, user } = useContext(AppContext);

    useEffect(() => {
        fetchPlaylists(type);
    }, [type]);

    const fetchPlaylists = async (selectedType, page = 1) => {
        setLoading(true);
        try {
            const response = await axios.get(
                `api/playlists?type=${selectedType}&page=${page}`,
                {
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setPlaylistsData({
                data: response.data.playlists.data,
                links: response.data.playlists.links,
            });
        } catch (error) {
            console.error("Error fetching playlists:", error);
        } finally {
            setLoading(false);
        }
    };

    async function handleDelete(id, type) {
        if (!confirm("Are you sure you want to delete this playlist?")) return;

        try {
            await axios.delete(`/api/playlists/${id}`, {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            fetchPlaylists(type);
        } catch (error) {
            if (error.response) {
                setError(
                    error.response.data.message ||
                        "Failed to delete the playlist."
                );
            } else {
                setError("Network error. Please try again.");
            }
        }
    }

    function handlePageClick(pageUrl) {
        if (!pageUrl) return;

        const page = new URL(pageUrl).searchParams.get("page");

        if (page) {
            fetchPlaylists(type, page);
        }
    }

    const showEditColumn =
        user &&
        playlistsData.data.some(
            (playlist) => user.role === "admin" || user.id === playlist.user?.id
        );

    return (
        <MainLayout
            header={
                <div className="w-full flex justify-between">
                    <div className="flex ml-5 space-x-5 text-left">
                        <button
                            className={`link ${
                                type === "personal" ? "font-bold" : ""
                            }`}
                            onClick={() => setType("personal")}
                        >
                            My Playlists
                        </button>
                        <button
                            className={`link ${
                                type === "public" ? "font-bold" : ""
                            }`}
                            onClick={() => setType("public")}
                        >
                            Public Playlists
                        </button>
                        <button
                            className="link"
                            onClick={() => router.visit(`/pStore?type=${type}`)}
                        >
                            Add a Playlist
                        </button>
                    </div>
                    <div>
                        <button
                            onClick={() => router.visit("/")}
                            className="px-4 py-2 link"
                        >
                            Back
                        </button>
                    </div>
                </div>
            }
            main={
                <div className="p-6">
                    {loading ? (
                        <div className="flex justify-center my-6">
                            <div className="loader ease-linear rounded-full border-4 border-t-4 border-violet-400 h-8 w-8"></div>
                        </div>
                    ) : playlistsData.data.length === 0 ? (
                        <p>No playlists found.</p>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="text-left w-full">
                                    <thead className="bg-gray-800 text-violet-400 uppercase text-sm">
                                        <tr>
                                            <th className="px-4 py-4">Title</th>
                                            <th className="px-4 py-4">
                                                Visibility
                                            </th>
                                            {showEditColumn && (
                                                <>
                                                    <th className="px-4 py-3"></th>

                                                    <th className="px-4 py-3"></th>
                                                </>
                                            )}
                                        </tr>
                                    </thead>
                                    <tbody className="bg-gradient-to-b from-neutral-600 to-neutral-800 divide-y divide-gray-700">
                                        {playlistsData.data.map((playlist) => (
                                            <tr key={playlist.id}>
                                                <td className="px-4 py-3 text-violet-300">
                                                    <Link
                                                        href={`/playlists/${playlist.id}?type=${type}`}
                                                        className="text-violet-300 hover:underline"
                                                    >
                                                        {playlist.title}
                                                    </Link>
                                                </td>
                                                <td className="px-4 py-3 text-violet-300">
                                                    {playlist.visibility}
                                                </td>

                                                {(user?.role === "admin" ||
                                                    user?.id ===
                                                        playlist.user?.id) && (
                                                    <>
                                                        <td className="px-4 py-3">
                                                            <button
                                                                onClick={() =>
                                                                    router.visit(
                                                                        `/playlists/edit/${playlist.id}?type=${type}`
                                                                    )
                                                                }
                                                                className="text-violet-300 hover:underline"
                                                            >
                                                                Edit
                                                            </button>
                                                        </td>

                                                        <td className="px-4 py-3">
                                                            <button
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        playlist.id,
                                                                        type
                                                                    )
                                                                }
                                                                className="text-violet-300 hover:underline"
                                                            >
                                                                Delete
                                                            </button>
                                                        </td>
                                                    </>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <Pagination
                                links={playlistsData.links}
                                onPageClick={handlePageClick}
                            />
                        </>
                    )}
                </div>
            }
        />
    );
}
