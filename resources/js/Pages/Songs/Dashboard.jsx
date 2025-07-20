import { Link, router } from "@inertiajs/react";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../Context/AppContext";
import MainLayout from "../../Layouts/MainLayout";


export default function Dashboard() {

    const [songs, setSongs] = useState([]);

    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const { token } = useContext(AppContext);


    async function getSongs() {
        const res = await fetch("/api/songs", {
            headers: { "Accept": "application/json" }
        });
        const data = await res.json();

        if (res.ok) {
            setSongs(data);
        }
    }

    useEffect(() => {
        getSongs();
    }, []);

    return (
        <MainLayout
            header={null}
            main={
                <>
                    <div className="flex flex-col mb-2">
                        <h1 className="text-4xl text-center font-bold text-violet-400 mb-8">
                            List of Songs!
                        </h1>

                        <div>
                            {songs?.data?.length > 0 ? (
                                songs.data.map((song) => (
                                    <div key={song.id} className="p-2">
                                        <p className="font-medium text-violet-400">{song.title}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500">No songs found.</p>
                            )}

                            {/* Pagination */}
                            <div className="mt-4">
                                {songs?.links?.map((link, index) =>
                                    link.url ? (
                                        <Link
                                            key={index}
                                            href={link.url}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                            className={`mx-1 px-2 py-1 border rounded ${link.active ? "font-bold underline text-violet-400" : "text-gray-700"
                                                }`}
                                        />
                                    ) : (
                                        <span
                                            key={index}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                            className="mx-1 px-2 py-1 border rounded text-gray-400"
                                        />
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                </>
            }
        />
    );
}
