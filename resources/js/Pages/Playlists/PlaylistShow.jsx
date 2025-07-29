import { AppContext } from "../../Context/AppContext";
import MainLayout from "../../Layouts/MainLayout";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, router } from "@inertiajs/react";
import Pagination from "@/Components/Pagination";

export default function PlaylistShow() {
    const { token, user } = useContext(AppContext);
    const [playlist, setPlaylist] = useState(null);
    const [songsData, setSongsData] = useState({
        data: [],
        links: [],
    });

    const id = window.location.pathname.split("/").pop();
    const type = new URLSearchParams(window.location.search).get("type");

    useEffect(() => {
        axios
            .get(`/api/playlists/${id}`, {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => {
                setPlaylist(res.data.playlist);
                setSongsData({
                    data: res.data.songs.data,
                    links: res.data.songs.links,
                });
            })
            .catch((err) => console.error("Failed to fetch the playlist", err));
    }, [id, token]);

    async function handleDetach(songId) {
        if (
            !confirm(
                "Are you sure you want to remove this song from the playlist?"
            )
        )
            return;

        try {
            await axios.delete(
                `/api/playlists/${playlist.id}/songs/${songId}`,
                {
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            router.visit(`/playlists/${playlist.id}?type=${type}`);
        } catch (error) {
            alert(
                error.response?.data?.message ||
                    "Failed to remove song or network error."
            );
        }
    }

    function handlePageClick(pageUrl) {
        if (!pageUrl) return;
        axios
            .get(pageUrl, {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => {
                setSongsData({
                    data: res.data.songs.data,
                    links: res.data.songs.links,
                });
            })
            .catch((err) =>
                console.error("Failed to fetch paginated songs", err)
            );
    }

    const canEdit =
        playlist && (user?.role === "admin" || user?.id === playlist.user?.id);

    return (
        <MainLayout
            header={
                <div className="flex w-full justify-between items-center">
                    {canEdit ? (
                        <Link
                            href={`/store?playlist_id=${playlist.id}&type=${type}`}
                            className="link ml-5"
                        >
                            Add a Song
                        </Link>
                    ) : (
                        <div></div>
                    )}

                    <button
                        onClick={() => router.visit(`/pDashboard?type=${type}`)}
                        className="px-4 py-2 link"
                    >
                        Back
                    </button>
                </div>
            }
            main={
                !playlist ? (
                    <div className="flex justify-center bg-neutral-900 my-6">
                        <div className="loader ease-linear rounded-full border-4 border-t-4 border-violet-400 h-8 w-8"></div>
                    </div>
                ) : (
                    <div className="flex flex-col">
                        <div className="overflow-x-auto">
                            <h1 className="text-2xl mb-10 text-violet-300">
                                {playlist.title}
                            </h1>
                            <table className="text-left w-full">
                                <thead className="bg-gray-800 text-violet-400 uppercase text-sm">
                                    <tr>
                                        <th className="px-4 py-4">Title</th>
                                        <th className="px-4 py-3">Genre</th>
                                        <th className="px-4 py-3">
                                            Release Date
                                        </th>
                                        {canEdit && (
                                            <th className="px-4 py-3"></th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody className="bg-gradient-to-b from-neutral-600 to-neutral-800 divide-y divide-gray-700">
                                    {songsData.data?.length > 0 ? (
                                        songsData.data.map((song) => (
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
                                                {canEdit && (
                                                    <td>
                                                        <button
                                                            onClick={() =>
                                                                handleDetach(
                                                                    song.id
                                                                )
                                                            }
                                                            className="text-violet-300 hover:underline pr-5"
                                                        >
                                                            Remove
                                                        </button>
                                                    </td>
                                                )}
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={4}
                                                className="px-4 py-3 text-violet-300"
                                            >
                                                No songs in this playlist.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination below the table, centered */}
                        <div className="mt-6 w-full text-center">
                            <Pagination
                                links={songsData.links}
                                onPageClick={handlePageClick}
                            />
                        </div>
                    </div>
                )
            }
        />
    );
}
