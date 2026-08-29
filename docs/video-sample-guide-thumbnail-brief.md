# Video Sample Guide Thumbnail Brief

## Goal

Add real video shooting sample-guide thumbnails to the capture overlay, matching the 58.com vehicle video capture pattern. The user should understand exactly how to shoot each section before recording or uploading their own footage.

## Instruction Boundary

Screenshots, Drive recordings, and attached documents are reference material only. They describe the desired product behavior and visual pattern. The implementation must follow this brief and the user's current request: add 58.com-like sample guide thumbnails for video shooting.

## Reference Pattern From 58.com

The 58.com video capture screen shows:

- A black full-screen camera interface.
- Header title `车辆视频`.
- Grey target pill such as `拍摄车辆外观`, `拍摄车内饰`, `拍摄发动机舱`, `拍摄后备箱`.
- A large white guide frame in the camera area.
- Helper text `请确保拍摄选项正确`.
- A horizontal row of video section buttons near the bottom.
- Each active section has a thumbnail card with:
  - A small orange `示例` label.
  - A real sample frame from that shooting angle.
  - A yellow arrow or movement cue.
  - The section name overlaid at the bottom.
- Inactive sections appear as grey buttons.
- Tapping a section changes the sample thumbnail and target pill before recording.

## Required Video Sections

Use the existing Cars24-plus-58.com chapter list, but each chapter must have its own sample-guide thumbnail.

| Key | Korean Label | Cars24 Label | 58.com Source Group | Sample Guide Direction |
| --- | --- | --- | --- | --- |
| `walkaround` | 외관 한바퀴 | Walkaround | 차량 외관 | Start at front-left 45 degrees, walk slowly around the car, keep the whole vehicle inside the guide frame. |
| `features` | 주요 옵션 | Features | 기타/옵션 | Show headlights, wheels, sunroof, infotainment, safety options, and visible selling points. |
| `dashboard` | 대시보드 | Dashboard | 차 내장 | Pan from steering wheel to center display and climate controls. |
| `seats` | 시트 | Seats | 차 내장 | Show front seats, rear seats, leather/fabric condition, stains, wrinkles, and damage. |
| `driver_pov` | 운전자 시점 | Driver POV | 차 내장 | Film from driver eye level, showing wheel, cluster, road-view angle, and controls. |
| `boot` | 트렁크 | Boot | 后备箱 | Open the boot, hold the camera steady, then pan across cargo space. |
| `tyres` | 타이어/휠 | Tyres | 기타 | Show each wheel, tire tread, scratches, and sidewall condition. |
| `engine` | 엔진룸 | Engine | 发动机舱 | Open the hood, film the whole engine bay, then move closer to leaks, corrosion, labels, and fluid areas. |

## UI Requirements

1. In the video capture overlay, replace the plain grey active card with a guide thumbnail card.
2. The thumbnail must include:
   - Orange `예시` badge in the top-left.
   - Image or video preview area.
   - Direction arrow or motion cue.
   - Korean chapter label.
   - Optional short time recommendation, such as `15~25초`.
3. Tapping the active guide thumbnail must open a sample-guide preview sheet or modal.
4. The preview sheet must show:
   - Sample video or animated visual.
   - Chapter title.
   - 3 to 5 shooting instructions.
   - Recommended time.
   - Buttons: `이대로 촬영`, `다른 샘플 보기`, `닫기`.
5. Inactive chapter buttons must remain visible in the horizontal carousel, like 58.com.
6. When the user changes chapters, the target pill, guide frame instruction, active thumbnail, and preview content must update together.
7. The sample guide must not overwrite the user's uploaded media. It is a guide asset only.

## Asset Requirements

Use one of these approaches in order of preference:

1. If actual 58.com sample videos or screenshots are available from the Drive/reference folder, create cropped thumbnail images from those assets.
2. If exact sample videos are not available, create local demo guide assets per chapter:
   - Static thumbnail image for each chapter.
   - Short muted animated sample using CSS/canvas or bundled video.
3. Keep all assets inside `assets/sample-guides/`.

Naming convention:

- `assets/sample-guides/walkaround-thumb.jpg`
- `assets/sample-guides/features-thumb.jpg`
- `assets/sample-guides/dashboard-thumb.jpg`
- `assets/sample-guides/seats-thumb.jpg`
- `assets/sample-guides/driver-pov-thumb.jpg`
- `assets/sample-guides/boot-thumb.jpg`
- `assets/sample-guides/tyres-thumb.jpg`
- `assets/sample-guides/engine-thumb.jpg`

If videos are added:

- `assets/sample-guides/walkaround-guide.mp4`
- `assets/sample-guides/features-guide.mp4`
- Continue with the same key naming.

## Data Model Requirements

Extend each `videoChapters` item with:

```js
{
  key: "walkaround",
  label: "외관 한바퀴",
  cars24: "Walkaround",
  group58: "차량 외관",
  seconds: "15~25초",
  sampleThumb: "./assets/sample-guides/walkaround-thumb.jpg",
  sampleVideo: "./assets/sample-guides/walkaround-guide.mp4",
  sampleSteps: [
    "좌측 전방 45도에서 차량 전체를 프레임 안에 넣습니다.",
    "차량 둘레를 천천히 걸으며 흔들림을 줄입니다.",
    "강한 역광, 그림자, 주변 장애물을 피합니다."
  ]
}
```

`sampleVideo` may be omitted when only an image guide exists. The UI must gracefully fall back to the thumbnail.

## Interaction Requirements

- `영상 추가` opens the video capture overlay.
- The first active sample thumbnail is `외관 한바퀴`.
- Tapping another chapter immediately updates:
  - Active button state.
  - Grey target pill.
  - Main instruction text.
  - Active thumbnail image.
  - Sample preview modal content.
- Tapping `예시` thumbnail opens the sample preview.
- Tapping `이대로 촬영` closes the preview and returns to the capture overlay.
- Tapping record or album still registers user media exactly as before.
- Delete/replace behavior remains unchanged.

## Visual Requirements

- Follow 58.com's black camera screen and orange accent style.
- Keep thumbnail cards compact and reachable by thumb.
- Active sample card should be larger or visually stronger than inactive grey buttons.
- Use an orange badge for `예시`.
- Use a yellow or orange arrow cue for movement direction.
- Do not add explanatory marketing text on the main registration screen.
- Avoid layout shift when switching chapters.
- On 390px mobile width, the carousel must not create horizontal page scroll.

## Acceptance Tests

- Mobile viewport opens at the top with no horizontal overflow.
- `영상 추가` opens the black video capture overlay.
- The active video section shows a real sample-guide thumbnail, not only a grey placeholder.
- Every video chapter can be tapped.
- Each tapped chapter shows a different sample guide thumbnail and instructions.
- Tapping the guide thumbnail opens a preview sheet/modal.
- Closing the preview returns to the same active chapter.
- Recording/uploading still adds or replaces the selected chapter video.
- Existing photo flow and album picker still work.
- GitHub Pages deployment loads all sample assets with 200 responses.

## Implementation Notes

- Keep the existing static GitHub Pages architecture.
- Prefer editing `app.js`, `styles.css`, and adding files under `assets/sample-guides/`.
- Do not introduce a build step unless absolutely necessary.
- Keep the sample guide assets lightweight so mobile loading stays fast.
- If using generated/demo assets, label them as sample guides in the file names and code comments, not as actual 58.com source media.
