<?php

namespace App\Jobs;

use Illuminate\Support\Facades\Log;
use App\Models\Song;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class ProcessAudioFile implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $song;
    public function __construct(Song $song)
    {
        $this->song = $song;
    }

    public function handle(): void
    {
        $inputPath = storage_path('app/public/' . $this->song->audio_file_path);
        $newFileName = pathinfo($inputPath, PATHINFO_FILENAME) . '_processed.mp3';
        $outputPath = storage_path('app/public/audio/' . $newFileName);

        Log::info("Input Path: " . $inputPath);
        Log::info("Output Path: " . $outputPath);

        $cmd = "ffmpeg -i " . escapeshellarg($inputPath) .
            " -af loudnorm -t 60 -b:a 128k -y " . escapeshellarg($outputPath);

        exec($cmd, $output, $returnCode);

        if ($returnCode !== 0) {
            Log::error("FFmpeg processing failed for song ID {$this->song->id}", [
                'cmd' => $cmd,
                'output' => $output
            ]);
            return;
        }

        if (file_exists($inputPath)) {
            unlink($inputPath);
        }


        $this->song->audio_file_path = 'audio/' . $newFileName;
        $this->song->save();
    }
}
