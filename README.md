# VNG Korea Office

Korea Office 내부 도구 모음 — 미팅 캘린더, 파트너 팔로우업 등.

## 📅 미팅 캘린더 & 파트너 팔로우업 (`index.html`)

Notion 미팅노트 트래커를 기반으로 한 웹 캘린더입니다.

- **캘린더**: 미팅 노트 제목 앞의 날짜(`YYMMDD`, 예: `260721` → 2026-07-21)를 파싱해
  해당 날짜 칸에 회사 이름을 표시합니다. 칩 색상은 회사의 컨택 상태를 나타냅니다.
- **팔로우업 패널**: 회사별 마지막 미팅일로부터 경과일을 계산해
  🔴 90일+ / 🟠 60–89일 / 🟡 30–59일 / 🟢 최근 으로 분류합니다.
- 칩·항목 클릭 시 해당 회사의 Notion 페이지로 이동합니다.
- 내부 팀미팅(회사 relation 없는 `팀미팅`, `내부미팅`, `사업 방향` 등)은 제외됩니다.

### 데이터 구조

브라우저가 아래 원본 파일을 읽어 클라이언트에서 직접 변환·렌더링합니다 (빌드 툴 불필요).

| 파일 | 내용 |
|------|------|
| `data/meetings.json` | 미팅노트 원본 `[{ note, company, status }]` |
| `data/companies.json` | 회사 id → `{ name, status, region }` |

### 자동 갱신

매일 예약 작업이 Notion에서 미팅노트/회사 정보를 다시 읽어
`data/meetings.json`·`data/companies.json`을 덮어쓰고 push 합니다.
페이지 로드 시 최신 데이터로 자동 반영됩니다.

### 배포

GitHub Pages (main 브랜치 root). 접속 주소: `https://hazelryu.github.io/VNGKoreaOffice/`
