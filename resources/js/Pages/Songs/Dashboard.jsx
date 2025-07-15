import { Link } from "@inertiajs/react";
import MainLayout from '@/Layouts/MainLayout';


export default function Dashboard({ songs }) {
    console.log({songs});

    return (
        <>
            <h1 className="text-4xl text-center font-bold">List of Songs!</h1>

            <div>
                {songs?.data?.length > 0 ? (
                    songs.data.map((song) => (
                        <div key={song.id} className="p-4">
                            <p className="font-medium">{song.title}</p>
                        </div>
                    ))
                ) : (
                    <p>No songs found.</p>
                )}

                <div className="mt-4">
                    {songs?.links?.map((link, index) =>
                        link.url ? (
                            <Link
                                key={index}
                                href={link.url}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`mx-1 ${
                                    link.active ? "font-bold underline" : ""
                                }`}
                            />
                        ) : (
                            <span
                                key={index}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className="mx-1 text-gray-400"
                            />
                        )
                    )}
                </div>
            </div>
        </>
    );
}

Dashboard.layout = page => <MainLayout>{page}</MainLayout>;
