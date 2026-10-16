/**
 * 설문 응답 수집용 Google Apps Script
 * 1) 응답을 받을 Google 스프레드시트 생성 → 확장 프로그램 > Apps Script
 * 2) 이 코드를 붙여넣고 저장
 * 3) 배포 > 새 배포 > 유형: 웹 앱
 *    - 실행 사용자: 나
 *    - 액세스 권한: 모든 사용자
 * 4) 발급된 웹 앱 URL(.../exec)을 index.html 의 SUBMIT_URL 에 입력
 */
const SHEET_NAME = "Responses";
const RAW_SHEET = "Raw_JSON";

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const body = JSON.parse(e.postData.contents);
    const row = body.row || {};
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    const sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
    let headers = sh.getLastRow() ? sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0] : [];
    if (!headers.length) {
      headers = Object.keys(row);
      sh.appendRow(headers);
      sh.setFrozenRows(1);
    }
    // 새 컬럼이 생기면 헤더 뒤에 추가
    Object.keys(row).forEach(k => {
      if (headers.indexOf(k) === -1) {
        headers.push(k);
        sh.getRange(1, headers.length).setValue(k);
      }
    });
    sh.appendRow(headers.map(h => (h in row ? row[h] : "")));

    const raw = ss.getSheetByName(RAW_SHEET) || ss.insertSheet(RAW_SHEET);
    raw.appendRow([new Date(), JSON.stringify(body.raw || body)]);

    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return ContentService.createTextOutput("Survey endpoint is running.");
}
