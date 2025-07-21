import { useContext, useEffect, useState } from "react";
import { Link, router } from "@inertiajs/react";
import { AppContext } from "../../Context/AppContext";
import MainLayout from "../../Layouts/MainLayout";

export default function Dashboard() {
    const [songs, setSongs] = useState([]);
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(false);
    const { token } = useContext(AppContext);

    // Fetch songs from the API (supports pagination)
    async function getSongs(url = "/api/songs") {
        setLoading(true);
        try {
            const res = await fetch(url, {
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();
            if (res.ok) {
                setSongs(data.data);
                setPagination(data);
            } else {
                console.error("Error fetching songs:", data);
            }
        } catch (error) {
            console.error("Request failed:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getSongs();
    }, []);

    return (
        <MainLayout
            header={
                <button onClick={() => router.visit("/")} className="button">
                    Back
                </button>
            }
            main={
                <div className="flex flex-col mt-8">
                    {songs.length > 0 ? (
                        <>
                            <h1 className="text-4xl text-center font-bold text-violet-400 mb-8">
                                List of Songs!
                            </h1>

                            {songs.map((song) => (
                                <div key={song.id} className="p-2">
                                    <Link
                                        href={`/songs/${song.id}`}
                                        className="font-medium text-violet-400"
                                    >
                                        {song.title}
                                    </Link>
                                </div>
                            ))}

                            {/* Pagination Buttons */}
                            <div className="flex gap-2 mt-6 justify-center flex-wrap">
                                {pagination.links?.map((link, index) => (
                                    <button
                                        key={index}
                                        disabled={!link.url}
                                        onClick={() => {
                                            getSongs(link.url);
                                            window.scrollTo({
                                                top: 0,
                                                behavior: "smooth",
                                            });
                                        }}
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                        className={`px-3 py-1 rounded border text-sm transition-all duration-200 ${
                                            link.active
                                                ? "bg-violet-500 text-violet-200 font-semibold"
                                                : "bg-violet-300 text-violet-900 hover:bg-violet-400"
                                        } ${
                                            !link.url
                                                ? "opacity-50 cursor-not-allowed"
                                                : ""
                                        }`}
                                    />
                                ))}
                            </div>
                        </>
                    ) : (
                        <p className="text-center text-gray-500">
                            No songs found.
                        </p>
                    )}
                </div>
            }
        />
    );
}
