
/* ===========================================================
   Waveform — Music Player Clone
   All audio streamed directly from royalty-free demo links
   (SoundHelix — freely licensed test/demo tracks, no download
   or local files needed).
   =========================================================== */
 
// ---------- Data ----------
// Swap the `src` URLs for any other direct-stream, copyright-free
// audio links (SoundHelix, Free Music Archive CC0 tracks, etc.)
// and everything else keeps working as-is.
 
const TRACKS = [
  { id: 1,  title: "Amber Skyline",      artist: "Nova Ridge",     album: "Late Drive",      duration: 0, swatch: "#D97B4F", icon: "♪", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { id: 2,  title: "Glass Corridor",     artist: "Mira Fields",    album: "Quiet Rooms",     duration: 0, swatch: "#C9A227", icon: "♫", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { id: 3,  title: "Paper Lantern",      artist: "Nova Ridge",     album: "Late Drive",      duration: 0, swatch: "#8E7CC3", icon: "♪", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
  { id: 4,  title: "Static Bloom",       artist: "Coral Hours",    album: "Halflight",       duration: 0, swatch: "#4F8A8B", icon: "♫", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" },
  { id: 5,  title: "Slow Tide",          artist: "Mira Fields",    album: "Quiet Rooms",     duration: 0, swatch: "#B85C38", icon: "♪", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3" },
  { id: 6,  title: "Copper Line",        artist: "Coral Hours",    album: "Halflight",       duration: 0, swatch: "#D97B4F", icon: "♫", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3" },
  { id: 7,  title: "Northbound",         artist: "Vesper Kane",    album: "Analog Weather",  duration: 0, swatch: "#5B7B9A", icon: "♪", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3" },
  { id: 8,  title: "Faded Marquee",      artist: "Nova Ridge",     album: "Late Drive",      duration: 0, swatch: "#C9A227", icon: "♫", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3" },
  { id: 9,  title: "Rooftop Static",     artist: "Vesper Kane",    album: "Analog Weather",  duration: 0, swatch: "#8E7CC3", icon: "♪", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3" },
  { id: 10, title: "Halogen Hum",        artist: "Coral Hours",    album: "Halflight",       duration: 0, swatch: "#4F8A8B", icon: "♫", src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3" },
];
 
const PLAYLISTS = [
  { id: "p1", name: "Late Night Drive",     desc: "Amber-lit, low tempo", icon: "◐", color: "#D97B4F", trackIds: [1, 3, 8, 6] },
  { id: "p2", name: "Coffee Shop Mornings", desc: "Soft focus, slow start", icon: "☕", color: "#C9A227", trackIds: [2, 5, 10] },
  { id: "p3", name: "Analog Weather",       desc: "Vesper Kane, in full", icon: "☁", color: "#5B7B9A", trackIds: [7, 9] },
  { id: "p4", name: "Halflight",            desc: "Coral Hours essentials", icon: "◑", color: "#4F8A8B", trackIds: [4, 6, 10] },
  { id: "p5", name: "Liked Songs",          desc: "Saved by you", icon: "♥", color: "#B85C38", trackIds: [] },
];
 
// ---------- State ----------
 
const state = {
  queue: TRACKS,           // current list being played (respects filters/playlists)
  currentIndex: -1,
  isPlaying: false,
  isShuffled: false,
  isRepeating: false,
  likedIds: new Set(),
};
 
// ---------- Element refs ----------
 
const audio          = document.getElementById("audio");
const playBtn         = document.getElementById("playBtn");
const prevBtn         = document.getElementById("prevBtn");
const nextBtn         = document.getElementById("nextBtn");
const shuffleBtn      = document.getElementById("shuffleBtn");
const repeatBtn       = document.getElementById("repeatBtn");
const likeBtn         = document.getElementById("likeBtn");
const seekBar         = document.getElementById("seekBar");
const volumeBar       = document.getElementById("volumeBar");
const currentTimeEl   = document.getElementById("currentTime");
const totalTimeEl     = document.getElementById("totalTime");
const nowTitle        = document.getElementById("nowTitle");
const nowArtist       = document.getElementById("nowArtist");
const nowCover        = document.getElementById("nowCover");
const trackTable      = document.getElementById("trackTable");
const playlistCards   = document.getElementById("playlistCards");
const quickGrid       = document.getElementById("quickGrid");
const playlistList    = document.getElementById("playlistList");
const searchInput     = document.getElementById("searchInput");
const greeting        = document.getElementById("greeting");
 
// ---------- Helpers ----------
 
function formatTime(sec){
  if (!isFinite(sec) || sec < 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}
 
function trackById(id){
  return TRACKS.find(t => t.id === id);
}
 
function setGreeting(){
  const h = new Date().getHours();
  greeting.textContent = h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
}
 
// ---------- Rendering ----------
 
function renderSidebarPlaylists(){
  playlistList.innerHTML = "";
  PLAYLISTS.forEach(pl => {
    const li = document.createElement("li");
    li.dataset.playlistId = pl.id;
    li.innerHTML = `
      <span class="pl-swatch" style="background:${pl.color}22;color:${pl.color}">${pl.icon}</span>
      <span class="pl-info">
        <span class="pl-name">${pl.name}</span>
        <span class="pl-sub">Playlist</span>
      </span>`;
    li.addEventListener("click", () => loadPlaylist(pl.id));
    playlistList.appendChild(li);
  });
}
 
function renderQuickGrid(){
  quickGrid.innerHTML = "";
  PLAYLISTS.slice(0, 4).forEach(pl => {
    const div = document.createElement("div");
    div.className = "quick-card";
    div.innerHTML = `
      <span class="pl-swatch" style="background:${pl.color}22;color:${pl.color}">${pl.icon}</span>
      <span class="pl-name">${pl.name}</span>`;
    div.addEventListener("click", () => loadPlaylist(pl.id));
    quickGrid.appendChild(div);
  });
}
 
function renderPlaylistCards(){
  playlistCards.innerHTML = "";
  PLAYLISTS.forEach(pl => {
    const div = document.createElement("div");
    div.className = "pl-card";
    div.innerHTML = `
      <div class="pl-swatch" style="background:${pl.color}22;color:${pl.color}">${pl.icon}</div>
      <div class="pl-name">${pl.name}</div>
      <div class="pl-sub">${pl.desc}</div>`;
    div.addEventListener("click", () => loadPlaylist(pl.id));
    playlistCards.appendChild(div);
  });
}
 
function renderTrackTable(list){
  trackTable.innerHTML = "";
  list.forEach((track, i) => {
    const row = document.createElement("div");
    row.className = "track-row";
    row.dataset.trackId = track.id;
    if (state.queue[state.currentIndex]?.id === track.id) row.classList.add("playing");
 
    row.innerHTML = `
      <span class="track-idx">${state.queue[state.currentIndex]?.id === track.id && state.isPlaying ? "♪" : i + 1}</span>
      <span class="track-main">
        <span class="track-cover" style="background:${track.swatch}22;color:${track.swatch}">${track.icon}</span>
        <span class="track-text">
          <span class="track-title">${track.title}</span>
          <span class="track-artist">${track.artist}</span>
        </span>
      </span>
      <span class="track-album">${track.album}</span>
      <span class="track-duration">${track.duration ? formatTime(track.duration) : "--:--"}</span>`;
 
    row.addEventListener("click", () => {
      state.queue = list;
      playTrackById(track.id);
    });
    trackTable.appendChild(row);
  });
}
 
function refreshPlayingRow(){
  document.querySelectorAll(".track-row").forEach(row => {
    const id = Number(row.dataset.trackId);
    const isCurrent = state.queue[state.currentIndex]?.id === id;
    row.classList.toggle("playing", isCurrent);
    const idxEl = row.querySelector(".track-idx");
    if (isCurrent) idxEl.textContent = state.isPlaying ? "♪" : "❙❙";
  });
}
 
// ---------- Playlist loading ----------
 
function loadPlaylist(playlistId){
  const pl = PLAYLISTS.find(p => p.id === playlistId);
  if (!pl) return;
 
  document.querySelectorAll(".playlist-list li").forEach(li =>
    li.classList.toggle("active", li.dataset.playlistId === playlistId)
  );
 
  let list;
  if (playlistId === "p5") {
    list = TRACKS.filter(t => state.likedIds.has(t.id));
  } else {
    list = pl.trackIds.map(trackById).filter(Boolean);
  }
 
  state.queue = list.length ? list : TRACKS;
  renderTrackTable(state.queue);
}
 
// ---------- Playback core ----------
 
function playTrackById(id){
  const idx = state.queue.findIndex(t => t.id === id);
  if (idx === -1) return;
  loadAndPlay(idx);
}
 
function loadAndPlay(index){
  if (index < 0 || index >= state.queue.length) return;
  state.currentIndex = index;
  const track = state.queue[index];
 
  audio.src = track.src;
  audio.play().catch(() => {/* autoplay/network restrictions — user can hit play again */});
  state.isPlaying = true;
 
  updateNowPlayingUI(track);
  updatePlayButton();
  refreshPlayingRow();
  updateLikeButton();
}
 
function togglePlay(){
  if (state.currentIndex === -1) {
    loadAndPlay(0);
    return;
  }
  if (audio.paused) {
    audio.play();
    state.isPlaying = true;
  } else {
    audio.pause();
    state.isPlaying = false;
  }
  updatePlayButton();
  refreshPlayingRow();
}
 
function playNext(){
  if (!state.queue.length) return;
  let next;
  if (state.isShuffled) {
    next = Math.floor(Math.random() * state.queue.length);
  } else {
    next = (state.currentIndex + 1) % state.queue.length;
  }
  loadAndPlay(next);
}
 
function playPrev(){
  if (!state.queue.length) return;
  const prev = (state.currentIndex - 1 + state.queue.length) % state.queue.length;
  loadAndPlay(prev);
}
 
function updateNowPlayingUI(track){
  nowTitle.textContent = track.title;
  nowArtist.textContent = track.artist;
  nowCover.textContent = track.icon;
  nowCover.style.background = `linear-gradient(135deg, ${track.swatch}, #C9A227)`;
}
 
function updatePlayButton(){
  playBtn.textContent = state.isPlaying ? "⏸" : "▶";
  nowCover.classList.toggle("spin", state.isPlaying);
}
 
function updateLikeButton(){
  const track = state.queue[state.currentIndex];
  likeBtn.classList.toggle("active", !!track && state.likedIds.has(track.id));
  likeBtn.textContent = track && state.likedIds.has(track.id) ? "♥" : "♡";
}
 
// ---------- Event wiring ----------
 
playBtn.addEventListener("click", togglePlay);
nextBtn.addEventListener("click", playNext);
prevBtn.addEventListener("click", playPrev);
 
shuffleBtn.addEventListener("click", () => {
  state.isShuffled = !state.isShuffled;
  shuffleBtn.classList.toggle("active", state.isShuffled);
});
 
repeatBtn.addEventListener("click", () => {
  state.isRepeating = !state.isRepeating;
  repeatBtn.classList.toggle("active", state.isRepeating);
});
 
likeBtn.addEventListener("click", () => {
  const track = state.queue[state.currentIndex];
  if (!track) return;
  if (state.likedIds.has(track.id)) {
    state.likedIds.delete(track.id);
  } else {
    state.likedIds.add(track.id);
  }
  updateLikeButton();
});
 
audio.addEventListener("loadedmetadata", () => {
  const track = state.queue[state.currentIndex];
  if (track) track.duration = audio.duration;
  totalTimeEl.textContent = formatTime(audio.duration);
  renderTrackTable(state.queue);
});
 
audio.addEventListener("timeupdate", () => {
  if (!audio.duration) return;
  const pct = (audio.currentTime / audio.duration) * 100;
  seekBar.value = pct;
  currentTimeEl.textContent = formatTime(audio.currentTime);
});
 
audio.addEventListener("ended", () => {
  if (state.isRepeating) {
    audio.currentTime = 0;
    audio.play();
  } else {
    playNext();
  }
});
 
seekBar.addEventListener("input", () => {
  if (!audio.duration) return;
  audio.currentTime = (seekBar.value / 100) * audio.duration;
});
 
volumeBar.addEventListener("input", () => {
  audio.volume = volumeBar.value / 100;
});
 
searchInput.addEventListener("input", () => {
  const q = searchInput.value.trim().toLowerCase();
  if (!q) {
    renderTrackTable(state.queue);
    return;
  }
  const filtered = TRACKS.filter(t =>
    t.title.toLowerCase().includes(q) ||
    t.artist.toLowerCase().includes(q) ||
    t.album.toLowerCase().includes(q)
  );
  renderTrackTable(filtered);
});
 
document.getElementById("createPlaylistBtn").addEventListener("click", () => {
  const name = prompt("Name your new playlist:");
  if (!name) return;
  PLAYLISTS.push({ id: `p${PLAYLISTS.length + 1}`, name, desc: "Your playlist", icon: "♪", color: "#D97B4F", trackIds: [] });
  renderSidebarPlaylists();
});
 
// ---------- Init ----------
 
function init(){
  audio.volume = volumeBar.value / 100;
  setGreeting();
  renderSidebarPlaylists();
  renderQuickGrid();
  renderPlaylistCards();
  renderTrackTable(state.queue);
}
 
init();