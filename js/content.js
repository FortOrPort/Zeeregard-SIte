// ---- Populates Home text and Music/Videos embeds from config/site.json ----
const YOUTUBE_ID_PATTERN =
  /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/;

function getYouTubeEmbedUrl(url) {
  const match = url.match(YOUTUBE_ID_PATTERN);
  return match ? `https://www.youtube-nocookie.com/embed/${match[1]}` : null;
}

function getSoundCloudEmbedUrl(url) {
  const params = new URLSearchParams({
    url,
    color: "#64645c",
    auto_play: "false",
    hide_related: "false",
    show_user: "true",
    show_reposts: "false",
    show_teaser: "true",
  });
  return `https://w.soundcloud.com/player/?${params.toString()}`;
}

function createEmbedLoader() {
  const loader = document.createElement("span");
  loader.className = "embed-loader";
  loader.setAttribute("role", "status");

  const pill = document.createElement("span");
  pill.className = "embed-loader__pill";

  const track = document.createElement("span");
  track.className = "embed-loader__track";
  track.setAttribute("aria-hidden", "true");
  track.textContent = "░".repeat(10);
  pill.appendChild(track);

  ["█", "▓", "▒"].forEach((glyph, i) => {
    const block = document.createElement("span");
    block.className = `embed-loader__block embed-loader__block--${i + 1}`;
    block.setAttribute("aria-hidden", "true");
    block.textContent = glyph;
    pill.appendChild(block);
  });

  const srText = document.createElement("span");
  srText.className = "visually-hidden";
  srText.textContent = "Loading";
  pill.appendChild(srText);

  loader.appendChild(pill);
  return loader;
}

function wrapEmbedWithLoader(iframe, wrapperModifierClass) {
  const wrapper = document.createElement("div");
  wrapper.className = `embed-wrapper ${wrapperModifierClass}`;

  wrapper.appendChild(iframe);
  wrapper.appendChild(createEmbedLoader());

  iframe.addEventListener(
    "load",
    () => wrapper.classList.add("is-loaded"),
    { once: true }
  );

  return wrapper;
}

function createVideoEmbed(url) {
  const embedUrl = getYouTubeEmbedUrl(url);
  if (!embedUrl) {
    console.warn(`content.js: couldn't parse a YouTube video ID from "${url}"`);
    return null;
  }

  const col = document.createElement("div");
  col.className = "col";

  const iframe = document.createElement("iframe");
  iframe.src = embedUrl;
  iframe.title = "YouTube video player";
  iframe.frameBorder = "0";
  iframe.allow =
    "accelerometer; autoplay; clipboard-write; encrypted-media; web-share";
  iframe.referrerPolicy = "strict-origin-when-cross-origin";
  iframe.allowFullscreen = true;
  iframe.loading = "lazy";

  col.appendChild(wrapEmbedWithLoader(iframe, "embed-wrapper--video"));
  return col;
}

function createMusicEmbed(url) {
  const col = document.createElement("div");
  col.className = "col";

  const iframe = document.createElement("iframe");
  iframe.src = getSoundCloudEmbedUrl(url);
  iframe.width = "100%";
  iframe.height = "166";
  iframe.scrolling = "no";
  iframe.frameBorder = "no";
  iframe.allow = "encrypted-media";
  iframe.loading = "lazy";

  col.appendChild(wrapEmbedWithLoader(iframe, "embed-wrapper--music"));
  return col;
}

function populateHome(config) {
  const heading = document.getElementById("homeHeading");
  const body = document.getElementById("homeBody");
  if (!config.home) return;

  if (heading && config.home.heading) {
    heading.textContent = config.home.heading;
  }
  if (body && config.home.body) {
    body.textContent = config.home.body;
  }
}

function populateEmbeds(config) {
  const videosContainer = document.getElementById("videosEmbeds");
  const musicContainer = document.getElementById("musicEmbeds");

  (config.youtube || []).forEach((url) => {
    const embed = createVideoEmbed(url);
    if (embed) videosContainer?.appendChild(embed);
  });

  (config.soundcloud || []).forEach((url) => {
    musicContainer?.appendChild(createMusicEmbed(url));
  });
}

async function populateFromConfig() {
  let config;
  try {
    const response = await fetch("/config/site.json");
    config = await response.json();
  } catch (err) {
    console.error("content.js: failed to load config/site.json", err);
    return;
  }

  populateHome(config);
  populateEmbeds(config);
}

populateFromConfig();
