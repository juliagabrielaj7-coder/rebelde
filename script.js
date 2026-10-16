const photoDialog = document.querySelector("#photo-dialog");
const dvdDialog = document.querySelector("#dvd-dialog");
const dialogImage = document.querySelector("#dialog-image");
const dialogCaption = document.querySelector("#dialog-caption");
const dvdCollection = document.querySelector("#dvd-collection");
const trackPanel = document.querySelector("#track-panel");
const trackTitle = document.querySelector("#track-title");
const trackCount = document.querySelector("#track-count");
const trackList = document.querySelector("#track-list");
const videoPlayer = document.querySelector("#video-player");
const videoFrame = document.querySelector("#video-frame");
const videoMessage = document.querySelector("#video-message");
const nowPlayingTitle = document.querySelector("#now-playing-title");

const albums = [
  {
    title: "Rebelde",
    year: "2004",
    color: "pink",
    tracks: [
      { title: "Rebelde", videoId: "4A1BnSGt960" },
      { title: "Sálvame", videoId: "jC00v6ZpqtU" },
    ],
  },
  {
    title: "Nuestro Amor",
    year: "2005",
    color: "orange",
    tracks: [
      { title: "Nuestro Amor", videoId: "djPdAHKf5gA" },
      { title: "Aún hay algo", videoId: "kAvMav3TOAE" },
    ],
  },
  {
    title: "Celestial",
    year: "2006",
    color: "blue",
    tracks: [
      { title: "Ser o parecer", videoId: "n4aYbJCwdXU" },
      { title: "Celestial", videoId: "tiRPPHg8i_Y" },
      { title: "Bésame sin miedo", videoId: "us9hIgCTNPE" },
    ],
  },
  {
    title: "Empezar Desde Cero",
    year: "2007",
    color: "purple",
    tracks: [
      { title: "Empezar desde cero", videoId: "v2s_PdeBAnQ" },
      { title: "Inalcanzable", videoId: "fv1toOv2M1M" },
    ],
  },
  {
    title: "Rebels",
    year: "2006",
    color: "red",
    tracks: [
      { title: "Tu amor", videoId: "TwZ8IQhWwn0" },
      { title: "No Pares", videoId: "_aym3PrAM_c" },
    ],
  },
  {
    title: "Para Olvidarte de Mí",
    year: "2009",
    color: "gold",
    tracks: [
      { title: "Para olvidarte de mí", videoId: "PFzkp8R7ZAY" },
    ],
  },
];

function renderCollection() {
  dvdCollection.replaceChildren();

  for (const [index, album] of albums.entries()) {
    const button = document.createElement("button");
    button.className = `collection-dvd collection-dvd-${album.color}`;
    button.type = "button";
    button.dataset.albumIndex = String(index);
    button.setAttribute("aria-label", `Abrir DVD ${album.title}, ${album.year}`);
    button.setAttribute("aria-pressed", "false");

    const cover = document.createElement("span");
    cover.className = "collection-cover";

    const image = document.createElement("img");
    image.src = "assets/rbd-brazil-2006.jpg";
    image.alt = "";
    image.loading = "lazy";

    const shade = document.createElement("span");
    shade.className = "collection-shade";

    const label = document.createElement("span");
    label.className = "collection-label";
    const albumYear = document.createElement("small");
    albumYear.textContent = `RBD · ${album.year}`;
    const albumTitle = document.createElement("strong");
    albumTitle.textContent = album.title;
    const fanEdition = document.createElement("span");
    fanEdition.textContent = "DVD de fã";
    label.append(albumYear, albumTitle, fanEdition);

    const spine = document.createElement("span");
    spine.className = "collection-spine";
    spine.textContent = "RBD";

    cover.append(image, shade, label, spine);

    const caption = document.createElement("span");
    caption.className = "collection-caption";
    caption.textContent = album.year;

    button.append(cover, caption);
    dvdCollection.append(button);
  }
}

function showAlbum(index) {
  const album = albums[index];

  if (!album) {
    return;
  }

  for (const dvd of dvdCollection.querySelectorAll(".collection-dvd")) {
    const selected = dvd.dataset.albumIndex === String(index);
    dvd.setAttribute("aria-pressed", String(selected));
  }

  trackTitle.textContent = album.title;
  trackCount.textContent = `${album.tracks.length} videoclipes`;
  trackList.replaceChildren();
  videoPlayer.hidden = true;
  videoFrame.replaceChildren();
  videoMessage.hidden = true;
  nowPlayingTitle.textContent = "";

  for (const [trackIndex, track] of album.tracks.entries()) {
    const item = document.createElement("li");
    const button = document.createElement("button");
    const number = document.createElement("span");
    const name = document.createElement("span");
    const play = document.createElement("span");

    item.className = "track-item";
    button.className = "track-button";
    button.type = "button";
    button.dataset.videoId = track.videoId;
    button.dataset.trackTitle = track.title;
    button.setAttribute("aria-label", `Tocar ${track.title} no site`);
    number.className = "track-number";
    number.textContent = String(trackIndex + 1).padStart(2, "0");
    name.className = "track-name";
    name.textContent = track.title;
    play.className = "track-play";
    play.textContent = "▶ Tocar";

    button.append(number, name, play);
    item.append(button);
    trackList.append(item);
  }

  trackPanel.hidden = false;
}

function playTrack(button) {
  const videoId = button.dataset.videoId;
  const title = button.dataset.trackTitle;

  if (!videoId || !title) {
    return;
  }

  for (const trackButton of trackList.querySelectorAll(".track-button")) {
    const isPlaying = trackButton === button;
    trackButton.setAttribute("aria-pressed", String(isPlaying));
    trackButton.querySelector(".track-play").textContent = isPlaying ? "▶ Tocando" : "▶ Tocar";
  }

  nowPlayingTitle.textContent = title;
  videoPlayer.hidden = false;
  videoFrame.replaceChildren();

  if (window.location.protocol === "file:") {
    videoMessage.textContent = "Para assistir ao vídeo aqui no site, abra a página usando um servidor local, como o Live Server do VS Code. Navegadores bloqueiam players incorporados em páginas abertas diretamente como arquivo.";
    videoMessage.hidden = false;
    videoPlayer.scrollIntoView({ behavior: "smooth", block: "nearest" });
    return;
  }

  videoMessage.hidden = true;
  const iframe = document.createElement("iframe");
  iframe.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?autoplay=1&playsinline=1&rel=0`;
  iframe.title = `Videoclipe de ${title} — RBD`;
  iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
  iframe.referrerPolicy = "strict-origin-when-cross-origin";
  iframe.loading = "lazy";
  iframe.allowFullscreen = true;
  videoFrame.replaceChildren(iframe);
  videoPlayer.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

renderCollection();

document.addEventListener("click", (event) => {
  const photoTrigger = event.target.closest(".photo-trigger");

  if (photoTrigger) {
    dialogImage.src = photoTrigger.dataset.image;
    dialogImage.alt = photoTrigger.dataset.alt;
    dialogCaption.textContent = photoTrigger.dataset.alt;
    photoDialog.showModal();
    return;
  }

  const openTrigger = event.target.closest("[data-open-dialog]");

  if (openTrigger?.dataset.openDialog === "dvd-dialog") {
    trackPanel.hidden = true;
    dvdDialog.showModal();
    return;
  }

  const dvd = event.target.closest(".collection-dvd");

  if (dvd) {
    showAlbum(Number(dvd.dataset.albumIndex));
    return;
  }

  const trackButton = event.target.closest(".track-button");

  if (trackButton) {
    playTrack(trackButton);
    return;
  }

  const closeTrigger = event.target.closest("[data-close-dialog]");
  const dialog = closeTrigger?.closest("dialog");

  if (dialog) {
    dialog.close();
  }
});

for (const dialog of [photoDialog, dvdDialog]) {
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      dialog.close();
    }
  });
}

dvdDialog.addEventListener("close", () => {
  trackPanel.hidden = true;
  videoPlayer.hidden = true;
  videoFrame.replaceChildren();
  videoMessage.hidden = true;
});

photoDialog.addEventListener("close", () => {
  dialogImage.removeAttribute("src");
  dialogImage.alt = "";
  dialogCaption.textContent = "";
});
