import { Link, router } from "@inertiajs/react";
import { useContext, useState } from "react";
import { AppContext } from "../../Context/AppContext";
import MainLayout from "../../Layouts/MainLayout";


export default function Dashboard() {

 const [formData, setFormData] = useState({
        title: "",
        description: "",
        genre: "",
        release_date: "",
    });

    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const { token } = useContext(AppContext);


async function getSongs() {
    const res = await fetch("/api/songs");
    const data = await res.json();

    console.log(data);


}


    return (
        <>
            <h1 className="text-4xl text-center font-bold mb-8">List of Songs!</h1>

            {/* <div>
                {songs?.data?.length > 0 ? (
                    songs.data.map((song) => (
                        <div key={song.id} className="p-2">
                            <p className="font-medium">{song.title}</p>
                        </div>
                    ))
                ) : (
                    <p>No songs found.</p>
                )}

                <div>
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
            </div> */}
        </>
    );
}

Dashboard.layout = (page) => <MainLayout>{page}</MainLayout>;
