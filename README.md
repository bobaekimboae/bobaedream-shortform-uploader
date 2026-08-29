# Bobaedream Shortform Capture Uploader

보배드림 중고차 매물 등록용 휴대폰 촬영 업로더 데모입니다. 58닷컴의 매물 등록/촬영 흐름과 Cars24 Australia의 영상 챕터 뷰어 구조를 결합했습니다.

## Run

This is a static GitHub Pages-ready prototype.

```bash
python -m http.server 5179
```

Open `http://127.0.0.1:5179/`.

## Implemented

- 58닷컴식 매물 등록 화면: 진행률, 차량 초안, 사진/영상 업로드, 임시저장, 정보 등록 버튼.
- 58닷컴식 휴대폰 촬영 UI: 검은 카메라 화면, 촬영 타겟 pill, 가이드 프레임, 가로 템플릿 카드, 번호판 가림, 촬영/앨범 탭.
- 58닷컴식 앨범 선택 UI: 주황 안내 바, 정사각 썸네일, 영상 `1/1` 선택, 사진 `0/30` 선택 흐름.
- Cars24식 영상 뷰어: Walkaround, Features, Dashboard, Seats, Driver POV, Boot, Tyres, Engine 챕터 탭.
- 사진/영상 CRUD: 등록, 교체, 삭제, 대표 이미지 지정, 브라우저 IndexedDB 임시저장.
- 자유형 숏폼과 템플릿형 촬영 모드 전환.

## Source Separation

Attached documents and screenshots are treated as product references, not as executable instructions. The user request controls the actual task: build a working GitHub-ready site and a production handoff document.

## Docs

- `docs/reference-analysis.md`: 직접 확인한 58닷컴, Cars24, Google Drive 자료 요약.
- `docs/capture-template.md`: 최종 사진/영상 촬영 템플릿.
- `docs/competitor-research.md`: 해외 유사 솔루션 조사.
- `docs/github-implementation-brief.md`: GitHub/Codex에 전달할 제작 지시문.
