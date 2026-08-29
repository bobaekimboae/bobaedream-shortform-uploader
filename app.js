const photoSlots = [
  {
    key: "left_front_45",
    name: "좌측 전방 45도",
    required: true,
    guide: "대표 이미지 1순위. 차량 전체와 전면부를 함께 담습니다.",
  },
  { key: "front", name: "차량 전면", required: true, guide: "그릴, 헤드램프, 번호판 영역을 포함합니다." },
  { key: "right_front_45", name: "우측 전방 45도", required: true, guide: "전면부와 우측 측면이 함께 보이게 촬영합니다." },
  { key: "right_side", name: "우측면", required: true, guide: "차량 옆 라인이 잘리지 않게 맞춥니다." },
  { key: "rear", name: "차량 후면", required: true, guide: "테일램프, 트렁크, 범퍼 상태를 확인합니다." },
  { key: "left_side", name: "좌측면", required: true, guide: "차량 옆 라인 전체를 수평으로 담습니다." },
  { key: "interior", name: "실내 전경", required: true, guide: "운전석 중심으로 대시보드와 센터페시아를 담습니다." },
  { key: "cluster", name: "계기판", required: true, guide: "주행거리와 경고등이 판독되게 촬영합니다." },
  { key: "front_seats", name: "앞좌석", required: true, guide: "운전석과 조수석 시트 상태를 확인합니다." },
  { key: "rear_seats", name: "뒷좌석", required: true, guide: "오염, 찢김, 공간감이 보이게 촬영합니다." },
  { key: "boot_photo", name: "트렁크", required: true, guide: "개방 상태와 내부 공간을 함께 담습니다." },
  { key: "engine_photo", name: "엔진룸", required: true, guide: "후드 개방 상태, 누유와 오염 여부를 확인합니다." },
  { key: "tyres_wheels", name: "타이어/휠", required: true, guide: "트레드와 휠 스크래치를 가까이 담습니다." },
  { key: "defects", name: "흠집/하자", required: false, guide: "흠집, 찍힘, 스크래치는 숨기지 않고 별도 노출합니다." },
  { key: "vin_doc", name: "등록증/차대번호", required: false, guide: "개인정보와 민감정보는 마스킹합니다." },
];

const videoChapters = [
  { key: "walkaround", label: "외관 한바퀴", cars24: "Walkaround", group58: "차량 외관", seconds: "15~25초", icon: "svgexport-57.svg" },
  { key: "features", label: "주요 옵션", cars24: "Features", group58: "기타/옵션", seconds: "8~15초", icon: "video.svg" },
  { key: "dashboard", label: "대시보드", cars24: "Dashboard", group58: "차 내장", seconds: "8~12초", icon: "camera.svg" },
  { key: "seats", label: "시트", cars24: "Seats", group58: "차 내장", seconds: "8~12초", icon: "svgexport-60.svg" },
  { key: "driver_pov", label: "운전자 시점", cars24: "Driver POV", group58: "차 내장", seconds: "5~10초", icon: "svgexport-59.svg" },
  { key: "boot", label: "트렁크", cars24: "Boot", group58: "트렁크", seconds: "5~10초", icon: "svgexport-60.svg" },
  { key: "tyres", label: "타이어/휠", cars24: "Tyres", group58: "기타", seconds: "5~10초", icon: "svgexport-57.svg" },
  { key: "engine", label: "엔진룸", cars24: "Engine", group58: "엔진룸", seconds: "8~12초", icon: "svgexport-60.svg" },
];

const videoCaptureGroups = [
  {
    key: "exterior",
    label: "차량 외관",
    chapterKey: "walkaround",
    thumb: "./assets/sample-guides/walkaround-thumb.jpg",
    instruction: "차량 전체가 가이드 프레임 안에 들어오게 천천히 한 바퀴 촬영하세요.",
  },
  {
    key: "interior",
    label: "차 내장",
    chapterKey: "dashboard",
    thumb: "./assets/sample-guides/interior-thumb.jpg",
    instruction: "운전석에서 대시보드, 센터페시아, 시트 상태가 이어지게 촬영하세요.",
  },
  {
    key: "engine",
    label: "엔진룸",
    chapterKey: "engine",
    thumb: "./assets/sample-guides/engine-thumb.jpg",
    instruction: "후드를 열고 엔진룸 전체를 먼저 잡은 뒤 누유와 오염 부위를 가까이 보여주세요.",
  },
  {
    key: "boot",
    label: "트렁크",
    chapterKey: "boot",
    thumb: "./assets/sample-guides/boot-thumb.jpg",
    instruction: "트렁크를 연 상태에서 적재 공간과 바닥 상태가 보이게 촬영하세요.",
  },
];

const state = {
  mode: "template",
  photos: [],
  videos: [],
  coverMediaId: "",
  activeCaptureType: "photo",
  activeSlotKey: "left_front_45",
  activeChapterKey: "walkaround",
  activeVideoGroupKey: "exterior",
  activeViewerChapter: "walkaround",
  plateMasked: false,
  stream: null,
  recorder: null,
  recordedChunks: [],
  recordingStartedAt: 0,
  recordingTimer: null,
  captureTab: "camera",
  pendingAlbumIndexes: [],
};

const els = {};
const DB_NAME = "bobaedream-shortform-demo";
const DB_VERSION = 1;
const META_KEY = "bobaedream-shortform-draft";

document.addEventListener("DOMContentLoaded", async () => {
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  bindElements();
  bindEvents();
  await restoreDraft();
  renderAll();
  if (!location.hash) window.scrollTo({ top: 0, left: 0, behavior: "auto" });
});

window.addEventListener("load", () => {
  if (location.hash) return;
  requestAnimationFrame(() => window.scrollTo(0, 0));
  setTimeout(() => window.scrollTo(0, 0), 120);
});

function bindElements() {
  [
    "completionRate",
    "progressFill",
    "missingSummary",
    "photoCount",
    "videoCount",
    "photoManagement",
    "requiredPhotoCounter",
    "videoChapterCounter",
    "videoManagement",
    "photoSlots",
    "videoChapters",
    "viewerTabs",
    "viewerVideo",
    "viewerStage",
    "viewerPlaceholder",
    "coverLabel",
    "captureOverlay",
    "captureTitle",
    "targetPill",
    "cameraPreview",
    "cameraFallback",
    "cameraInstruction",
    "albumPanel",
    "captureCarousel",
    "captureButton",
    "captureCounter",
    "plateMask",
    "cameraTab",
    "albumTab",
    "liveCamera",
    "photoCameraInput",
    "photoAlbumInput",
    "videoCameraInput",
    "videoAlbumInput",
    "rulesDialog",
    "toast",
  ].forEach((id) => {
    els[id] = document.getElementById(id);
  });
}

function bindEvents() {
  document.querySelectorAll("[data-open-capture]").forEach((button) => {
    button.addEventListener("click", () => openCapture(button.dataset.openCapture));
  });

  document.querySelectorAll(".mode-button").forEach((button) => {
    button.addEventListener("click", () => {
      state.mode = button.dataset.mode;
      document.querySelectorAll(".mode-button").forEach((item) => item.classList.toggle("is-active", item === button));
      saveDraft();
      renderAll();
      showToast(state.mode === "template" ? "템플릿형 촬영으로 전환했습니다." : "자유형 숏폼 촬영으로 전환했습니다.");
    });
  });

  document.getElementById("closeCapture").addEventListener("click", closeCapture);
  document.getElementById("doneCapture").addEventListener("click", closeCapture);
  document.getElementById("openRules").addEventListener("click", () => els.rulesDialog.showModal());
  document.getElementById("closeRules").addEventListener("click", () => els.rulesDialog.close());
  document.getElementById("saveDraft").addEventListener("click", () => {
    saveDraft();
    showToast("임시저장했습니다. 새로고침 후에도 상태가 복원됩니다.");
  });
  document.getElementById("submitDemo").addEventListener("click", () => {
    saveDraft();
    showToast("데모 등록 완료 상태입니다. 실제 서버 전송은 제외되어 있습니다.");
  });
  document.getElementById("resetDemo").addEventListener("click", resetDemo);
  document.getElementById("draftDelete").addEventListener("click", () => {
    showToast("58닷컴 임시 저장함처럼 초안 삭제 확인 후 초기화할 수 있습니다.");
  });
  document.getElementById("toggleMute").addEventListener("click", () => {
    els.viewerVideo.muted = !els.viewerVideo.muted;
    document.getElementById("toggleMute").textContent = els.viewerVideo.muted ? "음소거" : "소리 켬";
  });

  els.captureButton.addEventListener("click", handleCapturePress);
  els.cameraTab.addEventListener("click", () => setCaptureTab("camera"));
  els.albumTab.addEventListener("click", () => setCaptureTab("album"));
  els.liveCamera.addEventListener("click", startLiveCamera);
  els.plateMask.addEventListener("click", () => {
    state.plateMasked = !state.plateMasked;
    els.plateMask.classList.toggle("is-active", state.plateMasked);
    showToast(state.plateMasked ? "번호판 가림을 켰습니다." : "번호판 가림을 껐습니다.");
  });

  els.photoCameraInput.addEventListener("change", (event) => addFiles(event.target.files, "photo", "camera"));
  els.photoAlbumInput.addEventListener("change", (event) => addFiles(event.target.files, "photo", "album"));
  els.videoCameraInput.addEventListener("change", (event) => addFiles(event.target.files, "video", "camera"));
  els.videoAlbumInput.addEventListener("change", (event) => addFiles(event.target.files, "video", "album"));
}

function renderAll() {
  renderMode();
  renderPhotoSlots();
  renderVideoChapters();
  renderViewerTabs();
  renderProgress();
  updateCaptureUi();
}

function renderMode() {
  document.querySelectorAll(".mode-button").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.mode === state.mode);
  });
}

function renderPhotoSlots() {
  if (els.photoManagement) els.photoManagement.hidden = state.photos.length === 0;
  els.photoSlots.innerHTML = state.photos
    .map((media) => {
      const slot = photoSlots.find((item) => item.key === media.slotKey) || photoSlots[0];
      const isCover = media.id === state.coverMediaId;
      const preview = `<img src="${media.previewUrl}" alt="${slot.name} 촬영 이미지" />`;
      return `
        <article class="slot-card ${media ? "is-complete" : ""}" data-slot="${slot.key}">
          <span class="status-dot" aria-hidden="true"></span>
          <div class="slot-preview">${preview}</div>
          <div class="slot-body">
            <strong>${slot.name}</strong>
            <p>${slot.guide}</p>
            <div class="slot-actions">
              <button class="mini-button" type="button" data-retake-photo="${slot.key}">교체</button>
              <button class="cover-button ${isCover ? "is-cover" : ""}" type="button" data-cover="${media.id}">${isCover ? "대표" : "대표 지정"}</button>
              <button class="delete-button" type="button" data-delete="${media.id}">삭제</button>
            </div>
          </div>
        </article>`;
    })
    .join("");

  els.photoSlots.querySelectorAll("[data-retake-photo]").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeSlotKey = button.dataset.retakePhoto;
      openCapture("photo");
    });
  });
  bindMediaButtons(els.photoSlots);
}

function renderVideoChapters() {
  if (els.videoManagement) els.videoManagement.hidden = state.videos.length === 0;
  const registeredVideos = videoChapters
    .map((chapter) => {
      const media = state.videos.find((item) => item.chapterKey === chapter.key);
      return media ? { chapter, media } : null;
    })
    .filter(Boolean);

  els.videoChapters.innerHTML = registeredVideos
    .map(({ chapter, media }) => {
      const thumb = `<video src="${media.previewUrl}" muted playsinline></video>`;
      return `
        <article class="chapter-card is-complete" data-chapter="${chapter.key}">
          <span class="status-dot" aria-hidden="true"></span>
          <div class="chapter-thumb">${thumb}</div>
          <div class="chapter-copy">
            <strong>${chapter.label} · ${chapter.cars24}</strong>
            <p>58닷컴 대응: ${chapter.group58}. 권장 길이 ${chapter.seconds}.</p>
            <small>${media.name} ${media.durationSec ? `· ${media.durationSec}초` : ""}</small>
            <div class="chapter-actions">
              <button class="mini-button" type="button" data-retake-video="${chapter.key}">교체</button>
              <button class="mini-button" type="button" data-view-video="${chapter.key}">보기</button>
              <button class="delete-button" type="button" data-delete="${media.id}">삭제</button>
            </div>
          </div>
        </article>`;
    })
    .join("");

  els.videoChapters.querySelectorAll("[data-retake-video]").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeChapterKey = button.dataset.retakeVideo;
      openCapture("video");
    });
  });
  els.videoChapters.querySelectorAll("[data-view-video]").forEach((button) => {
    button.addEventListener("click", () => setViewerChapter(button.dataset.viewVideo));
  });
  bindMediaButtons(els.videoChapters);
}

function bindMediaButtons(root) {
  root.querySelectorAll("[data-delete]").forEach((button) => {
    button.addEventListener("click", () => deleteMedia(button.dataset.delete));
  });
  root.querySelectorAll("[data-cover]").forEach((button) => {
    button.addEventListener("click", () => {
      state.coverMediaId = button.dataset.cover;
      saveDraft();
      renderAll();
      showToast("대표 이미지를 변경했습니다.");
    });
  });
}

function renderViewerTabs() {
  els.viewerTabs.innerHTML = videoChapters
    .map(
      (chapter) => `
      <button class="viewer-tab ${state.activeViewerChapter === chapter.key ? "is-active" : ""}" type="button" data-viewer-tab="${chapter.key}">
        <span class="tab-icon"><img src="./assets/${chapter.icon}" alt="" /></span>
        <span>${chapter.cars24}</span>
      </button>`,
    )
    .join("");

  els.viewerTabs.querySelectorAll("[data-viewer-tab]").forEach((button) => {
    button.addEventListener("click", () => setViewerChapter(button.dataset.viewerTab));
  });

  centerInlineScroll(els.viewerTabs, ".viewer-tab.is-active");
  updateViewerVideo();
}

function setViewerChapter(key) {
  state.activeViewerChapter = key;
  saveDraft();
  renderViewerTabs();
  const chapterEl = document.querySelector(`[data-chapter="${key}"]`);
  chapterEl?.scrollIntoView({ behavior: "smooth", block: "center" });
}

function updateViewerVideo() {
  const media = state.videos.find((item) => item.chapterKey === state.activeViewerChapter);
  if (!media) {
    els.viewerVideo.removeAttribute("src");
    els.viewerStage.classList.remove("has-video");
    return;
  }
  els.viewerVideo.src = media.previewUrl;
  els.viewerStage.classList.add("has-video");
}

function renderProgress() {
  const requiredPhotos = photoSlots.filter((slot) => slot.required);
  const doneRequiredPhotos = requiredPhotos.filter((slot) => state.photos.some((item) => item.slotKey === slot.key));
  const doneVideos = videoChapters.filter((chapter) => state.videos.some((item) => item.chapterKey === chapter.key));
  const rate = Math.min(100, Math.round(24 + (doneRequiredPhotos.length / requiredPhotos.length) * 40 + (doneVideos.length / videoChapters.length) * 36));
  els.completionRate.textContent = String(rate);
  els.progressFill.style.width = `${rate}%`;
  els.photoCount.textContent = String(state.photos.length);
  els.videoCount.textContent = String(state.videos.length);
  els.requiredPhotoCounter.textContent = `${state.photos.length}/30`;
  els.videoChapterCounter.textContent = `${state.videos.length}개`;
  const missingPhotos = requiredPhotos.length - doneRequiredPhotos.length;
  const missingVideos = videoChapters.length - doneVideos.length;
  els.missingSummary.textContent = `필수 사진 ${missingPhotos}개와 영상 챕터 ${missingVideos}개가 남았습니다.`;
  const cover = state.photos.find((item) => item.id === state.coverMediaId);
  els.coverLabel.textContent = cover ? photoSlots.find((slot) => slot.key === cover.slotKey)?.name || "지정됨" : "미지정";
}

function captureGroupForChapter(chapterKey) {
  if (chapterKey === "engine") return videoCaptureGroups.find((group) => group.key === "engine");
  if (chapterKey === "boot") return videoCaptureGroups.find((group) => group.key === "boot");
  if (["dashboard", "seats", "driver_pov"].includes(chapterKey)) return videoCaptureGroups.find((group) => group.key === "interior");
  return videoCaptureGroups.find((group) => group.key === "exterior");
}

function openCapture(type) {
  state.activeCaptureType = type;
  state.captureTab = "camera";
  state.pendingAlbumIndexes = [];
  if (type === "photo" && !state.activeSlotKey) state.activeSlotKey = "left_front_45";
  if (type === "video") {
    if (!state.activeChapterKey) state.activeChapterKey = "walkaround";
    state.activeVideoGroupKey = captureGroupForChapter(state.activeChapterKey).key;
    state.activeChapterKey = captureGroupForChapter(state.activeChapterKey).chapterKey;
  }
  els.captureOverlay.classList.add("is-open");
  els.captureOverlay.setAttribute("aria-hidden", "false");
  document.documentElement.style.overflow = "hidden";
  updateCaptureUi();
}

function closeCapture() {
  stopLiveCamera();
  if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
  els.captureOverlay.classList.remove("is-open");
  els.captureOverlay.setAttribute("aria-hidden", "true");
  document.documentElement.style.overflow = "";
}

function updateCaptureUi() {
  if (!els.captureOverlay) return;
  const isVideo = state.activeCaptureType === "video";
  const active = isVideo
    ? videoCaptureGroups.find((group) => group.key === state.activeVideoGroupKey) || videoCaptureGroups[0]
    : photoSlots.find((slot) => slot.key === state.activeSlotKey);

  document.querySelector(".capture-screen")?.classList.toggle("video-mode", isVideo);
  document.querySelector(".capture-screen")?.classList.toggle("album-mode", state.captureTab === "album");
  els.captureTitle.textContent = isVideo ? "차량 영상" : "사진 촬영";
  els.targetPill.textContent = isVideo ? `촬영 ${active?.label}` : `촬영 ${active?.name}`;
  els.cameraInstruction.textContent = isVideo
    ? active?.instruction || "촬영 옵션이 맞는지 확인하세요."
    : active?.guide || "";
  els.captureCounter.textContent = isVideo ? `${state.videos.length}/8` : `${state.photos.length}/30`;
  els.captureButton.setAttribute("aria-label", isVideo ? "영상 촬영 또는 선택" : "사진 촬영 또는 선택");
  els.cameraTab.classList.toggle("is-active", state.captureTab === "camera");
  els.albumTab.classList.toggle("is-active", state.captureTab === "album");
  renderCaptureCarousel();
  renderAlbumPanel();
}

function renderCaptureCarousel() {
  const isVideo = state.activeCaptureType === "video";
  const list = isVideo ? videoCaptureGroups : photoSlots;
  els.captureCarousel.innerHTML = list
    .map((item) => {
      const key = item.key;
      const done =
        isVideo
          ? state.videos.some((media) => media.chapterKey === item.chapterKey)
          : state.photos.some((media) => media.slotKey === key);
      const active = isVideo ? state.activeVideoGroupKey === key : state.activeSlotKey === key;
      const style = isVideo && active ? ` style="--guide-thumb: url('${item.thumb}')"` : "";
      return `<button class="capture-card ${isVideo ? "video-guide" : ""} ${active ? "is-active" : ""} ${done ? "is-complete" : ""}" type="button" data-capture-key="${key}"${style}>
        <span class="sample-label">예시</span>
        <span class="guide-arrow" aria-hidden="true"></span>
        <span class="capture-card-label">${item.label || item.name}</span>
      </button>`;
    })
    .join("");

  els.captureCarousel.querySelectorAll("[data-capture-key]").forEach((button) => {
    button.addEventListener("click", () => {
      if (state.activeCaptureType === "video") {
        const group = videoCaptureGroups.find((item) => item.key === button.dataset.captureKey) || videoCaptureGroups[0];
        state.activeVideoGroupKey = group.key;
        state.activeChapterKey = group.chapterKey;
      } else {
        state.activeSlotKey = button.dataset.captureKey;
      }
      updateCaptureUi();
      centerInlineScroll(els.captureCarousel, ".capture-card.is-active");
    });
  });

  centerInlineScroll(els.captureCarousel, ".capture-card.is-active");
}

function centerInlineScroll(container, selector) {
  const item = container?.querySelector(selector);
  if (!container || !item) return;
  requestAnimationFrame(() => {
    const itemCenter = item.offsetLeft + item.offsetWidth / 2;
    container.scrollLeft = Math.max(0, itemCenter - container.clientWidth / 2);
  });
}

function setCaptureTab(tab) {
  state.captureTab = tab;
  state.pendingAlbumIndexes = [];
  updateCaptureUi();
  if (tab === "camera") {
    stopLiveCamera();
    return;
  }
}

function renderAlbumPanel() {
  if (!els.albumPanel) return;
  const isVideo = state.activeCaptureType === "video";
  const selectedCount = state.pendingAlbumIndexes.length;
  const countText = isVideo ? `${selectedCount}/1` : `${selectedCount}/30`;
  const banner = isVideo
    ? "차량 영상 한 개를 선택하세요"
    : "우선 업로드 각도: 좌측 전방 45도 | 차량 전면 | 우측 전방 45도 | 우측면 | 후면 | 좌측면";
  const total = isVideo ? 6 : 18;

  els.albumPanel.innerHTML = `
    <div class="album-banner">${banner}</div>
    <div class="album-grid">
      ${Array.from({ length: total })
        .map((_, index) => {
          const isSelected = state.pendingAlbumIndexes.includes(index);
          const duration = isVideo ? ["33s", "33s", "33s", "81s", "8s", "1s"][index] : "";
          return `<button class="album-tile ${isVideo ? "video" : "photo"} ${isSelected ? "is-selected" : ""}" type="button" data-demo-album="${index}" data-duration="${duration}" aria-label="앨범 썸네일 ${index + 1}">
            <span class="album-select">${isSelected ? "✓" : ""}</span>
          </button>`;
        })
        .join("")}
    </div>
    <div class="album-footer">
      <button class="album-device-button" type="button" id="pickDeviceFile">기기 앨범에서 선택</button>
      <span class="album-count">${countText}</span>
      <button class="album-done-button" type="button" id="albumDone">완료</button>
    </div>
  `;

  els.albumPanel.querySelectorAll("[data-demo-album]").forEach((button) => {
    button.addEventListener("click", () => selectDemoAlbumMedia(Number(button.dataset.demoAlbum || 0)));
  });
  els.albumPanel.querySelector("#pickDeviceFile")?.addEventListener("click", () => {
    if (state.activeCaptureType === "photo") els.photoAlbumInput.click();
    else els.videoAlbumInput.click();
  });
  els.albumPanel.querySelector("#albumDone")?.addEventListener("click", commitAlbumSelection);
}

function selectDemoAlbumMedia(index) {
  if (state.activeCaptureType === "video") {
    state.pendingAlbumIndexes = [index];
  } else if (state.pendingAlbumIndexes.includes(index)) {
    state.pendingAlbumIndexes = state.pendingAlbumIndexes.filter((item) => item !== index);
  } else if (state.pendingAlbumIndexes.length + state.photos.length < 30) {
    state.pendingAlbumIndexes = [...state.pendingAlbumIndexes, index];
  }
  updateCaptureUi();
}

async function commitAlbumSelection() {
  if (!state.pendingAlbumIndexes.length) {
    closeCapture();
    return;
  }
  for (const index of state.pendingAlbumIndexes) {
    const isVideo = state.activeCaptureType === "video";
    const file = isVideo ? await createDemoVideoFile(index) : await createDemoPhotoFile(index);
    await addFile(file, state.activeCaptureType, "demo-album");
  }
  state.pendingAlbumIndexes = [];
  closeCapture();
}

async function handleCapturePress() {
  if (state.stream && state.activeCaptureType === "photo") {
    await capturePhotoFromStream();
    return;
  }
  if (state.stream && state.activeCaptureType === "video") {
    if (state.recorder?.state === "recording") stopRecording();
    else startRecording();
    return;
  }
  if (state.activeCaptureType === "photo") els.photoCameraInput.click();
  else els.videoCameraInput.click();
}

async function startLiveCamera() {
  if (!navigator.mediaDevices?.getUserMedia) {
    showToast("이 브라우저는 실시간 카메라 미리보기를 지원하지 않아 파일 선택으로 진행합니다.");
    return;
  }
  try {
    state.stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: "environment" }, aspectRatio: state.activeCaptureType === "video" ? 9 / 16 : undefined },
      audio: state.activeCaptureType === "video",
    });
    els.cameraPreview.srcObject = state.stream;
    await els.cameraPreview.play();
    document.querySelector(".capture-screen").classList.add("has-stream");
    showToast("카메라 미리보기를 시작했습니다.");
  } catch (error) {
    showToast("카메라 권한이 없거나 지원되지 않습니다. 앨범/촬영 선택으로 진행하세요.");
  }
}

function stopLiveCamera() {
  if (state.recorder?.state === "recording") stopRecording();
  clearInterval(state.recordingTimer);
  state.stream?.getTracks().forEach((track) => track.stop());
  state.stream = null;
  state.recorder = null;
  state.recordedChunks = [];
  els.cameraPreview.srcObject = null;
  document.querySelector(".capture-screen")?.classList.remove("has-stream", "is-recording");
}

async function capturePhotoFromStream() {
  const video = els.cameraPreview;
  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth || 1080;
  canvas.height = video.videoHeight || 1920;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  canvas.toBlob(async (blob) => {
    if (!blob) return;
    const file = new File([blob], `${activeNameForFile()}-${Date.now()}.jpg`, { type: "image/jpeg" });
    await addFile(file, "photo", "camera");
  }, "image/jpeg", 0.92);
}

function startRecording() {
  if (!window.MediaRecorder || !state.stream) {
    showToast("이 브라우저는 직접 녹화를 지원하지 않습니다. 영상 촬영 선택을 사용하세요.");
    return;
  }
  state.recordedChunks = [];
  state.recorder = new MediaRecorder(state.stream);
  state.recorder.addEventListener("dataavailable", (event) => {
    if (event.data.size) state.recordedChunks.push(event.data);
  });
  state.recorder.addEventListener("stop", async () => {
    const blob = new Blob(state.recordedChunks, { type: "video/webm" });
    const file = new File([blob], `${activeNameForFile()}-${Date.now()}.webm`, { type: "video/webm" });
    await addFile(file, "video", "camera");
  });
  state.recorder.start();
  state.recordingStartedAt = Date.now();
  document.querySelector(".capture-screen").classList.add("is-recording");
  state.recordingTimer = setInterval(() => {
    const elapsed = Math.floor((Date.now() - state.recordingStartedAt) / 1000);
    els.captureCounter.textContent = `${elapsed}s / 30s`;
    if (elapsed >= 30) stopRecording();
  }, 500);
}

function stopRecording() {
  clearInterval(state.recordingTimer);
  document.querySelector(".capture-screen").classList.remove("is-recording");
  if (state.recorder?.state === "recording") state.recorder.stop();
}

async function addFiles(fileList, type, source) {
  const files = Array.from(fileList || []);
  for (const file of files) {
    await addFile(file, type, source);
  }
  els.photoCameraInput.value = "";
  els.photoAlbumInput.value = "";
  els.videoCameraInput.value = "";
  els.videoAlbumInput.value = "";
}

async function addFile(file, type, source) {
  if (type === "photo" && state.photos.length >= 30) {
    showToast("사진은 최대 30장까지 등록할 수 있습니다.");
    return;
  }

  const id = crypto.randomUUID();
  const blobKey = `media-${id}`;
  await putBlob(blobKey, file);
  const previewUrl = URL.createObjectURL(file);
  const item = {
    id,
    type,
    slotKey: type === "photo" ? state.activeSlotKey : undefined,
    chapterKey: type === "video" ? state.activeChapterKey : undefined,
    name: file.name || activeNameForFile(),
    mimeType: file.type,
    size: file.size,
    durationSec: type === "video" ? await readVideoDuration(file) : undefined,
    blobKey,
    previewUrl,
    isCover: false,
    createdAt: new Date().toISOString(),
    uploadStatus: "simulating",
    progress: 0,
    source,
  };

  if (type === "photo") {
    state.photos = state.photos.filter((media) => media.slotKey !== state.activeSlotKey);
    state.photos.push(item);
    if (!state.coverMediaId || state.activeSlotKey === "left_front_45") state.coverMediaId = item.id;
  } else {
    if (state.mode === "freeform") {
      item.chapterKey = "walkaround";
      state.videos = [item];
      state.activeViewerChapter = "walkaround";
    } else {
      state.videos = state.videos.filter((media) => media.chapterKey !== state.activeChapterKey);
      state.videos.push(item);
      state.activeViewerChapter = state.activeChapterKey;
    }
  }

  simulateUpload(item.id);
  saveDraft();
  renderAll();
  showToast(type === "photo" ? "사진을 등록했습니다." : "영상을 등록했습니다. 58닷컴처럼 1개 선택 흐름으로 처리됩니다.");
}

function simulateUpload(id) {
  const timer = setInterval(() => {
    const item = [...state.photos, ...state.videos].find((media) => media.id === id);
    if (!item) {
      clearInterval(timer);
      return;
    }
    item.progress = Math.min(100, item.progress + 20);
    if (item.progress >= 100) {
      item.uploadStatus = "complete";
      clearInterval(timer);
    }
    saveDraft();
    renderAll();
  }, 220);
}

async function deleteMedia(id) {
  const item = [...state.photos, ...state.videos].find((media) => media.id === id);
  if (!item) return;
  const label = item.type === "photo" ? "사진" : "영상";
  const ok = window.confirm(`${label}을 삭제할까요? 필수 항목이면 미완료 상태로 돌아갑니다.`);
  if (!ok) return;
  await deleteBlob(item.blobKey);
  state.photos = state.photos.filter((media) => media.id !== id);
  state.videos = state.videos.filter((media) => media.id !== id);
  if (state.coverMediaId === id) state.coverMediaId = state.photos[0]?.id || "";
  saveDraft();
  renderAll();
  setTimeout(() => URL.revokeObjectURL(item.previewUrl), 800);
  showToast(`${label}을 삭제했습니다.`);
}

function createCanvas(width = 1080, height = 1440) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

async function createDemoPhotoFile(index) {
  const canvas = createCanvas();
  const ctx = canvas.getContext("2d");
  drawDemoFrame(ctx, canvas.width, canvas.height, index, "사진");
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.9));
  return new File([blob], `${activeNameForFile()}-album-${index + 1}.jpg`, { type: "image/jpeg" });
}

async function createDemoVideoFile(index) {
  const canvas = createCanvas(720, 1280);
  if (!canvas.captureStream || !window.MediaRecorder) {
    return new File([new Blob(["demo video"], { type: "video/webm" })], `${activeNameForFile()}-album-${index + 1}.webm`, {
      type: "video/webm",
    });
  }

  const stream = canvas.captureStream(12);
  const options = MediaRecorder.isTypeSupported("video/webm;codecs=vp8") ? { mimeType: "video/webm;codecs=vp8" } : {};
  const recorder = new MediaRecorder(stream, options);
  const chunks = [];
  recorder.addEventListener("dataavailable", (event) => {
    if (event.data.size) chunks.push(event.data);
  });

  const finished = new Promise((resolve) => {
    recorder.addEventListener("stop", () => resolve(new Blob(chunks, { type: "video/webm" })));
  });

  recorder.start();
  let frame = 0;
  const ctx = canvas.getContext("2d");
  const timer = setInterval(() => {
    drawDemoFrame(ctx, canvas.width, canvas.height, index + frame, activeNameForFile());
    frame += 1;
  }, 80);
  await new Promise((resolve) => setTimeout(resolve, 1400));
  clearInterval(timer);
  recorder.stop();
  stream.getTracks().forEach((track) => track.stop());
  const blob = await finished;
  return new File([blob], `${activeNameForFile()}-album-${index + 1}.webm`, { type: "video/webm" });
}

function drawDemoFrame(ctx, width, height, index, label) {
  const hue = (index * 37) % 360;
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, `hsl(${hue}, 54%, 32%)`);
  gradient.addColorStop(0.56, "#141922");
  gradient.addColorStop(1, "#050608");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "rgba(255,255,255,0.88)";
  roundRect(ctx, width * 0.18, height * 0.46, width * 0.64, height * 0.18, 34);
  ctx.fill();
  ctx.fillStyle = "rgba(0,0,0,0.74)";
  roundRect(ctx, width * 0.28, height * 0.42, width * 0.44, height * 0.12, 28);
  ctx.fill();
  ctx.fillStyle = "#101317";
  ctx.beginPath();
  ctx.arc(width * 0.3, height * 0.65, width * 0.07, 0, Math.PI * 2);
  ctx.arc(width * 0.7, height * 0.65, width * 0.07, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#ff4f2e";
  roundRect(ctx, 42, 42, 152, 66, 10);
  ctx.fill();
  ctx.fillStyle = "#fff";
  ctx.font = "700 34px Arial, sans-serif";
  ctx.fillText("예시", 78, 86);
  ctx.font = "700 40px Arial, sans-serif";
  ctx.fillText(String(label || "촬영 샘플"), 48, height - 78);
}

function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
}

function activeNameForFile() {
  if (state.activeCaptureType === "video") {
    return videoChapters.find((chapter) => chapter.key === state.activeChapterKey)?.label || "video";
  }
  return photoSlots.find((slot) => slot.key === state.activeSlotKey)?.name || "photo";
}

function readVideoDuration(file) {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(video.src);
      resolve(Math.round(video.duration || 0));
    };
    video.onerror = () => resolve(undefined);
    video.src = URL.createObjectURL(file);
  });
}

function serializableDraft() {
  return {
    mode: state.mode,
    coverMediaId: state.coverMediaId,
    activeSlotKey: state.activeSlotKey,
    activeChapterKey: state.activeChapterKey,
    activeVideoGroupKey: state.activeVideoGroupKey,
    activeViewerChapter: state.activeViewerChapter,
    photos: state.photos.map(stripPreview),
    videos: state.videos.map(stripPreview),
    updatedAt: new Date().toISOString(),
  };
}

function stripPreview(item) {
  const { previewUrl, ...rest } = item;
  return rest;
}

function saveDraft() {
  localStorage.setItem(META_KEY, JSON.stringify(serializableDraft()));
}

async function restoreDraft() {
  const raw = localStorage.getItem(META_KEY);
  if (!raw) return;
  try {
    const draft = JSON.parse(raw);
    state.mode = draft.mode || "template";
    state.coverMediaId = draft.coverMediaId || "";
    state.activeSlotKey = draft.activeSlotKey || "left_front_45";
    state.activeChapterKey = draft.activeChapterKey || "walkaround";
    state.activeVideoGroupKey = draft.activeVideoGroupKey || captureGroupForChapter(state.activeChapterKey).key;
    state.activeViewerChapter = draft.activeViewerChapter || "walkaround";
    state.photos = await restoreItems(draft.photos || []);
    state.videos = await restoreItems(draft.videos || []);
  } catch (error) {
    console.warn("Failed to restore draft", error);
  }
}

async function restoreItems(items) {
  const restored = [];
  for (const item of items) {
    const blob = await getBlob(item.blobKey);
    restored.push({
      ...item,
      previewUrl: blob ? URL.createObjectURL(blob) : "",
      uploadStatus: item.uploadStatus || "complete",
      progress: item.progress ?? 100,
    });
  }
  return restored.filter((item) => item.previewUrl);
}

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      request.result.createObjectStore("blobs");
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function withStore(mode, callback) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("blobs", mode);
    const store = tx.objectStore("blobs");
    const result = callback(store);
    tx.oncomplete = () => resolve(result?.result);
    tx.onerror = () => reject(tx.error);
  });
}

function putBlob(key, blob) {
  return withStore("readwrite", (store) => store.put(blob, key)).catch(() => undefined);
}

function getBlob(key) {
  if (!key) return Promise.resolve(null);
  return withStore("readonly", (store) => store.get(key)).catch(() => null);
}

function deleteBlob(key) {
  if (!key) return Promise.resolve();
  return withStore("readwrite", (store) => store.delete(key)).catch(() => undefined);
}

async function resetDemo() {
  const ok = window.confirm("데모 데이터를 모두 초기화할까요?");
  if (!ok) return;
  localStorage.removeItem(META_KEY);
  state.photos.forEach((item) => URL.revokeObjectURL(item.previewUrl));
  state.videos.forEach((item) => URL.revokeObjectURL(item.previewUrl));
  state.photos = [];
  state.videos = [];
  state.coverMediaId = "";
  const db = await openDB().catch(() => null);
  if (db) {
    const tx = db.transaction("blobs", "readwrite");
    tx.objectStore("blobs").clear();
  }
  renderAll();
  showToast("데모를 초기화했습니다.");
}

function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.add("is-visible");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => els.toast.classList.remove("is-visible"), 2600);
}

window.bobaedreamDemo = {
  state,
  addFile,
  deleteMedia,
  openCapture,
  closeCapture,
  renderAll,
  videoChapters,
  videoCaptureGroups,
  photoSlots,
};
