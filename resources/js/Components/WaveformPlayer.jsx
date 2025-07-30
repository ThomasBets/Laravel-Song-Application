import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";

export default function WaveformPlayer({ audioUrl }) {
    const waveformRef = useRef(null);
    const wavesurferRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        if (!audioUrl) return;

        wavesurferRef.current = WaveSurfer.create({
            container: waveformRef.current,
            waveColor: "#a78bfa", // Violet 400
            progressColor: "#7c3aed", // Violet 600
            height: 60,
            responsive: true,
        });

        wavesurferRef.current.load(audioUrl);

        return () => {
            wavesurferRef.current.destroy();
        };
    }, [audioUrl]);

    const togglePlayback = () => {
        if (wavesurferRef.current) {
            wavesurferRef.current.playPause();
            setIsPlaying(wavesurferRef.current.isPlaying());
        }
    };

    return (
        <div className="p-4 bg-gray-900 rounded-lg shadow-md">
            <div ref={waveformRef} className="mb-4" />
            <button
                onClick={togglePlayback}
                className="px-4 py-2 bg-violet-600 text-white rounded hover:bg-violet-700 transition"
            >
                {isPlaying ? "Pause" : "Play"}
            </button>
        </div>
    );
}
