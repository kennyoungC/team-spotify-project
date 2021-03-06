`use strict`;
const tbody = document.querySelector(`tbody`);
const next = document.querySelector(`.next`);
const play = document.querySelector(`.play`);
const prev = document.querySelector(`.prev`);
const progressContainer = document.querySelector(`.progress-container`);
const audio = document.querySelector(`audio`);
const musicTitle = document.querySelector(`.music-title`);
const progress = document.querySelector(`.progress`);
const cover = document.querySelector(`.playing-img`);
const musicContainer = document.querySelector(`.music-container`);
const bigPlayBtn = document.querySelector(`.artist-page-play`);
const bigPauseBtn = document.querySelector(`.pause-btn`);

window.onload = () => {
  loadAlbumPage();
};
let songsPreview = [];
const loadAlbumPage = () => {
  const id = new URLSearchParams(window.location.search).get("id");
  // console.log(id);
  const tbody = document.querySelector(`.album-tbody`);
  tbody.innerHTML = ``;
  fetch("https://striveschool-api.herokuapp.com/api/deezer/album/" + id)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const h2 = document.querySelector(`h2`);
      const albumCover = document.querySelector(`.min-img > img`);
      const bigImg = document.querySelector(`.big-img`);
      const btNote = document.querySelector(`.bt-note`);
      const btText = document.querySelector(`.bt-text`);
      btText.innerHTML = `<a href="artist.html?id=${data.artist.id}"> ${data.artist.name}</a>`;
      const slicedDate = `${data.release_date}`.slice(0, 4);
      btNote.innerText = `${slicedDate}•${data.tracks.data.length}songs`;
      bigImg.src = data.cover_big;
      albumCover.src = data.artist.picture;
      h2.innerText = data.title;

      const tracks = data.tracks.data;
      console.log(tracks);

      //display song on player
      setPlayerInfo(tracks);

      tracks.forEach((track, i) => {
        songsPreview.push(track.preview);

        tbody.innerHTML += displayRows(track, i);
        document.querySelectorAll(`.songs`).forEach((song) => {
          song.addEventListener(`click`, function () {});
        });
      });
      load();
    })
    .catch((err) => console.error(err));
};
const displayRows = (track, i) => {
  let songDuration = (track.duration / 60).toFixed(2);
  let songDurationMain = String(songDuration).split(`.`).join(`:`);
  return ` <tr id=${i} class="songs"   >
  <th scope="row">
    <span class=""
      >${i + 1}</span>
  </th>
  <td>
    <div class="d-flex gap-2 align-items-center">
      
      <span 
        >${track.title}</span
      >
    </div>
  </td>
  <td class="text-start">${track.rank}</td>
  <td>${songDurationMain}</td>
</tr>`;
};
//handle volume

// const handleChangeVolume = (e) => {
//   // function triggered by the onchange event of the volume's range input
//   const rangeValue = e.target.value;
//   console.log(rangeValue);
//   // const volume = rangeValue / 100;

//   // audio.volume = volume; // affetcs the audio element's volume

//   localStorage.setItem("prevVolume", rangeValue); // set chosen volume value in localStorage for later use
// };

// Update song details
const setPlayerInfo = (song) => {
  // grabbing elemets
  const musicTitle = document.querySelector(`.music-title`);
  const playingImage = document.querySelector(`.playing-img`);

  //applying song info to the player
  // playingImage.src = song.album.cover_small;
  musicTitle.innerText = song.title_short;
  audio.src = song.preview;
};
const load = () => {
  document.querySelectorAll(`.songs`).forEach((song) => {
    song.addEventListener(`click`, function (e) {
      songIndex = parseInt(this.getAttribute(`id`));
      audio.src = songsPreview[songIndex];
      audio.play();
      tbody.querySelectorAll(`tr`).forEach((tr) => {
        if (tr.classList.contains(`text-success`)) {
          tr.classList.remove(`text-success`);
        }
      });
      song.classList.add(`text-success`);
      playSong();
    });
  });
};

const playSong = function () {
  musicContainer.classList.add(`play`);
  play.querySelector(`i.bi`).classList.remove(`bi-play-circle`);
  play.querySelector(`i.bi`).classList.add(`bi-pause-circle`);
  bigPlayBtn.classList.remove(`play-btn`);
  bigPlayBtn.classList.add(`pause-btn`);
  audio.play();
};
const pauseSong = function () {
  musicContainer.classList.remove(`play`);
  play.querySelector(`i.bi`).classList.add(`bi-play-circle`);
  play.querySelector(`i.bi`).classList.remove(`bi-pause-circle`);
  bigPlayBtn.classList.add(`play-btn`);
  bigPlayBtn.classList.remove(`pause-btn`);
  audio.pause();
};
// const prevSong = function () {
//   songIndex--;
//   if (songIndex < 0) {
//     songIndex = songs.length - 1;
//   }
//   loadSong(songsPreview[songIndex]);
//   playSong();
// };
// const nextSong = function () {
//   songIndex++;
//   if (songIndex > songs.length - 1) {
//     songIndex = 0;
//   }
//   loadSong(songsPreview[songIndex]);
//   playSong();
// };

const updateProgress = function (e) {
  const movingMinutes = Math.floor(e.srcElement.currentTime);
  const totalMinutes = Math.floor(e.srcElement.duration);
  let songDuration = (totalMinutes / 60).toFixed(2);
  let songDurationMain = String(songDuration).split(`.`).join(`:`);
  document.querySelector(`.minutes-end`).textContent = `${
    isNaN(songDuration) ? ` ` : songDurationMain
  }`;
  const progressPercent = (movingMinutes / totalMinutes) * 100;
  progress.style.width = `${progressPercent}%`;
};
const setProgress = function (e) {
  const width = this.clientWidth;
  // console.log(width);
  const clickX = e.offsetX;
  const duration = audio.duration;

  audio.currentTime = (clickX / width) * duration;
  console.log(audio.currentTime);
};
// Initially load song info DOM
// loadSong(songsPreview[songIndex]);

// event listeners
play.addEventListener(`click`, function () {
  const isPlaying = musicContainer.classList.contains(`play`);
  if (isPlaying) {
    pauseSong();
  } else {
    playSong();
  }
});

// change song events
progressContainer.addEventListener(`click`, setProgress);
audio.addEventListener(`timeupdate`, updateProgress);
// prev.addEventListener(`click`, prevSong);
// next.addEventListener(`click`, nextSong);
// audio.addEventListener(`ended`, nextSong);
/* play section
const WizkidMusicTitles = document.querySelectorAll(`tbody tr figure + span`);
const tbody = document.querySelector(`tbody`);
const next = document.querySelector(`.next`);
const play = document.querySelector(`.play`);
const prev = document.querySelector(`.prev`);
const progressContainer = document.querySelector(`.progress-container`);
const audio = document.querySelector(`audio`);
const musicTitle = document.querySelector(`.music-title`);
const progress = document.querySelector(`.progress`);
const cover = document.querySelector(`.playing-img`);
const musicContainer = document.querySelector(`.music-container`);
const bigPlayBtn = document.querySelector(`.artist-page-play`);
const bigPauseBtn = document.querySelector(`.pause-btn`);
// Song Titles
const songs = [
  "Holla At Your Boy",
  "Don't Dull",
  "Eme-Boyz-ft-Skales-Banky-W",
  "For Me ft Wande-Coal",
  "Gidi Girl",
  "Love My Baby",
  "No lele",
  "Oluwa Lo Ni",
  "Pakurumo",
  "Say My Name",
  "Scatter The Floor",
  "Shout Out",
  "Slow Whine",
  "Tease Me Bad Guys",
  "Wad-Up ft D-prince",
  "What you wanna do",
  "Wiz Party Bonus Freestyle Leak",
];


let songIndex = 0;
document.querySelectorAll(`.song`).forEach((song) => {
  song.addEventListener(`click`, function (e) {
    songIndex = parseInt(this.getAttribute(`id`));
    // console.log(songIndex);
    loadSong(songs[songIndex]);
    tbody.querySelectorAll(`tr`).forEach((tr) => {
      if (tr.classList.contains(`text-success`)) {
        tr.classList.remove(`text-success`);
      }
    });
    song.classList.add(`text-success`);
    playSong();
  });
});
// Update song details
const loadSong = function (song) {
  musicTitle.innerText = song;
  audio.src = `./Superstar Album/${song}.mp3`;
  cover.src = `./img/Wizkid images/wizkid ${songIndex + 1}.jpg`;
};
const playSong = function () {
  musicContainer.classList.add(`play`);
  play.querySelector(`i.bi`).classList.remove(`bi-play-circle`);
  play.querySelector(`i.bi`).classList.add(`bi-pause-circle`);
  bigPlayBtn.classList.remove(`play-btn`);
  bigPlayBtn.classList.add(`pause-btn`);
  audio.play();
};
const pauseSong = function () {
  musicContainer.classList.remove(`play`);
  play.querySelector(`i.bi`).classList.add(`bi-play-circle`);
  play.querySelector(`i.bi`).classList.remove(`bi-pause-circle`);
  bigPlayBtn.classList.add(`play-btn`);
  bigPlayBtn.classList.remove(`pause-btn`);
  audio.pause();
};
const prevSong = function () {
  songIndex--;
  if (songIndex < 0) {
    songIndex = songs.length - 1;
  }
  loadSong(songs[songIndex]);
  playSong();
};
const nextSong = function () {
  songIndex++;
  if (songIndex > songs.length - 1) {
    songIndex = 0;
  }
  loadSong(songs[songIndex]);
  playSong();
};

const updateProgress = function (e) {
  const movingMinutes = Math.floor(e.srcElement.currentTime);
  const totalMinutes = Math.floor(e.srcElement.duration);
  let songDuration = (totalMinutes / 60).toFixed(2);
  let songDurationMain = String(songDuration).split(`.`).join(`:`);
  document.querySelector(`.minutes-end`).textContent = `${
    isNaN(songDuration) ? ` ` : songDurationMain
  }`;
  const progressPercent = (movingMinutes / totalMinutes) * 100;
  progress.style.width = `${progressPercent}%`;
};
const setProgress = function (e) {
  const width = this.clientWidth;
  // console.log(width);
  const clickX = e.offsetX;
  const duration = audio.duration;

  audio.currentTime = (clickX / width) * duration;
  console.log(audio.currentTime);
};
// Initially load song info DOM
loadSong(songs[songIndex]);*/
