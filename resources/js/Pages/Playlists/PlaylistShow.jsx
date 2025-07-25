import MainLayout from "../../Layouts/MainLayout";

export default function PlaylistShow() {
    return (
        <MainLayout
            header={
                <div>
                    <button
                        onClick={() => window.history.back()}
                        className="px-4 py-2 link"
                    >
                        Back
                    </button>
                </div>
            }
            main={
                <div>
                    <h1 className="text-3xl fancy_text">Hello!!</h1>
                </div>
            }
        />
    );
}
