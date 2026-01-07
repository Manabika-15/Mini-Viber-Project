const audio = document.getElementById("audio");
const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const loopBtn = document.getElementById("loop");
const progress = document.getElementById("progress");
const progressContainer = document.getElementById("progress-container");
const title = document.getElementById("music-title");
const artist = document.getElementById("artist");
const cover = document.getElementById("cover");
const uploadBtn = document.getElementById("uploadBtn");
const fileInput = document.getElementById("fileInput");

let songs = [
  { name: "song1", title: "Qayde Se", artist: "Arijit Singh" },
  { name: "song2", title: "Barbaad", artist: "Jubin Nautiyal" },
  { name: "song3", title: "For A Reason", artist: "Karan Aujla" },
];

let songIndex = 0;
let isPlaying = false;
let loopMode = 0; // 0=off, 1=loop one, 2=loop all

// Load default song
loadSong(songs[songIndex]);

function loadSong(song) {
  title.textContent = song.title;
  artist.textContent = song.artist;
  audio.src = song.file ? song.file : `music/${song.name}.mp3`;
  cover.src = song.cover ? song.cover : `assets/${song.name}.jpg`;
}

function playSong() {
  isPlaying = true;
  playBtn.textContent = "⏸️";
  audio.play();
  cover.style.animationPlayState = "running";
}

function pauseSong() {
  isPlaying = false;
  playBtn.textContent = "▶️";
  audio.pause();
  cover.style.animationPlayState = "paused";
}

playBtn.addEventListener("click", () => {
  isPlaying ? pauseSong() : playSong();
});

prevBtn.addEventListener("click", prevSong);
nextBtn.addEventListener("click", nextSong);

function nextSong() {
  songIndex = (songIndex + 1) % songs.length;
  loadSong(songs[songIndex]);
  playSong();
}

function prevSong() {
  songIndex = (songIndex - 1 + songs.length) % songs.length;
  loadSong(songs[songIndex]);
  playSong();
}

// Progress bar
audio.addEventListener("timeupdate", (e) => {
  const { duration, currentTime } = e.srcElement;
  const progressPercent = (currentTime / duration) * 100;
  progress.style.width = `${progressPercent}%`;
});

progressContainer.addEventListener("click", (e) => {
  const width = e.currentTarget.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;
  audio.currentTime = (clickX / width) * duration;
});

// Loop modes
loopBtn.addEventListener("click", () => {
  loopMode = (loopMode + 1) % 3;
  if (loopMode === 0) loopBtn.textContent = "🔁";
  if (loopMode === 1) loopBtn.textContent = "🔂"; // loop one
  if (loopMode === 2) loopBtn.textContent = "🔄"; // loop all
});

// Auto next or loop logic
audio.addEventListener("ended", () => {
  if (loopMode === 1) {
    playSong(); // repeat same
  } else if (loopMode === 2) {
    nextSong();
  } else {
    pauseSong();
  }
});

// Upload custom songs
uploadBtn.addEventListener("click", () => fileInput.click());

fileInput.addEventListener("change", (e) => {
  const files = Array.from(e.target.files);
  files.forEach((file) => {
    const url = URL.createObjectURL(file);
    songs.push({
      file: url,
      title: file.name.replace(".mp3", ""),
      
      cover: "assets/default.jpg", // add default cover image
    });
  });
  songIndex = songs.length - 1;
  loadSong(songs[songIndex]);
  playSong();
});
