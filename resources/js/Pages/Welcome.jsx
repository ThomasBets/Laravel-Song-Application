import MainLayout from "../Layouts/MainLayout";

export default function Welcome() {
    return (
        <div className="flex flex-1 items-center justify-center text-center">
            <div>
                <h1 className="text-4xl font-bold text-gray-800 mb-4">
                    Welcome to MySongApp
                </h1>
                <p className="text-lg text-gray-600">
                    Discover and share your favorite songs!
                </p>
            </div>
        </div>
    );
}

Welcome.layout = (page) => <MainLayout>{page}</MainLayout>;
