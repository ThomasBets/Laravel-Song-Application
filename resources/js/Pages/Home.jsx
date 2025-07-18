import { useContext } from "react";
import MainLayout from "../Layouts/MainLayout";
import { AppContext } from "../Context/AppContext";

export default function Home() {

    const {user} = useContext(AppContext);

    return (
        <div className="flex flex-1 items-center justify-center text-center">
            <div>
                <h1 className="text-4xl font-bold text-violet-400 mb-4">
                   Welcome {user ? user.name : "to MySongsApp"}!
                </h1>
                <p className="text-lg text-violet-400 ">
                    Discover and share your favorite songs!
                </p>
            </div>
        </div>
    );
}

Home.layout = (page) => <MainLayout>{page}</MainLayout>;
