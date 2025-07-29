export default function Pagination({ links, onPageClick }) {
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
