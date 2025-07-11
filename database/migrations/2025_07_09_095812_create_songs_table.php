<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\User;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        //Create the 'songs' table schema

        Schema::create('songs', function (Blueprint $table) {
            $table->id();

            $table->foreignIdFor(User::class);

            $table->string('title');
            $table->text('description')->nullable();
            $table->string('genre');
            $table->date('release_date');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('songs');
    }
};
