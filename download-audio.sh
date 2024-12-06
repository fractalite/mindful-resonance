#!/bin/bash

# Create audio directory if it doesn't exist
mkdir -p public/audio

# Download ambient tracks
curl -L "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3" -o "public/audio/cosmic-flow.mp3"
curl -L "https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8f3c302.mp3" -o "public/audio/deep-ocean.mp3"
curl -L "https://cdn.pixabay.com/download/audio/2021/08/09/audio_dc39baa48d.mp3" -o "public/audio/forest-night.mp3"

echo "Audio files downloaded successfully!"
