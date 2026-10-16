# TOPIK 전문가 설문조사 (1차) – 웹 설문

원본: `File20261008ver.docx` → GitHub Pages용 정적 HTML 설문

## 파일 구성

| 파일 | 용도 |
|---|---|
| `index.html` | 설문 페이지 (베트남어, 단일 파일, 외부 라이브러리 없음) |
| `apps-script.gs` | 응답을 Google 스프레드시트로 받는 서버 코드 (선택) |
| `README.md` | 이 안내문 |

## 1. GitHub Pages 배포

1. GitHub에서 새 저장소 생성 (예: `topik-survey`) — Public
2. `index.html`, `apps-script.gs`, `README.md` 업로드 (Add file → Upload files → Commit)
3. Settings → Pages → Source: **Deploy from a branch** → Branch: `main` / `(root)` → Save
4. 1~2분 후 주소 발급: `https://<GitHub아이디>.github.io/topik-survey/`
5. 이 주소를 전문가에게 배포

## 2. 응답 수집

응답자는 마지막에 **Gửi khảo sát(보내기)** 버튼만 누르면 되고, 응답은 Google 시트에 자동 저장됩니다. `SUBMIT_URL`을 입력하기 전에는 제출이 되지 않습니다.

## 3. Google 시트 연동

1. Google 스프레드시트 새로 만들기 → **확장 프로그램 → Apps Script**
2. `apps-script.gs` 내용 전체 붙여넣기 → 저장
3. **배포 → 새 배포 → 유형 선택: 웹 앱**
   - 실행 사용자: **나**
   - 액세스 권한: **모든 사용자**
4. 권한 승인 후 발급된 URL(`https://script.google.com/macros/s/.../exec`) 복사
5. `index.html` 에서 아래 줄 수정 후 GitHub에 다시 커밋

   ```js
   const SUBMIT_URL = "https://script.google.com/macros/s/XXXX/exec";
   ```

6. 테스트 응답 1건 제출 → 시트 `Responses` 탭에 행이 생기는지 확인

### 시트 컬럼 구조

- `submitted_at, org, field, experience, topik_exp`
- `V01-1 … V11-4` : 5점 척도 점수 (41개 문항)
- `comment_V01 … comment_V11` : 영역별 서술 의견
- `core` : 핵심 코드 선택(최대 5개, `;` 구분) + `core_V01-1 …` 0/1 더미 (빈도 집계용)
- `add_needed, add_content, add_reason, revisions, other_opinion`
- `Raw_JSON` 탭: 원본 JSON 백업

### 집계 수식 예시 (Responses 시트 기준)

- 문항별 평균: `=AVERAGE(F2:F100)` (F열 = V01-1)
- 4점 이상 비율(CVR 산출용): `=COUNTIF(F2:F100,">=4")/COUNT(F2:F100)`
- 핵심 코드 선택 빈도: `=SUM(core_V01-1 열 범위)`

## 4. 기능

- 필수 항목 검증 (Ⅱ 기본정보, Ⅲ 41개 문항 전부), 누락 문항 하이라이트
- Ⅳ 핵심 코드 최대 5개 제한 (5개 선택 시 나머지 비활성)
- 응답자 브라우저에 자동 임시저장 → 중간에 닫아도 이어서 작성
- 모바일 화면 대응, 다크 모드, 인쇄 지원

## 5. 문항 수정

`index.html` 의 `<script>` 안 `GROUPS` 배열만 고치면 Ⅲ(평가)·Ⅳ(핵심 선택)·시트 컬럼이 같이 바뀝니다.
