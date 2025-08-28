// iCloudのXHRリクエストを監視
chrome.webRequest.onCompleted.addListener(
  (details) => {
    const url = details.url;

    // startupリクエストのレスポンスからUUID一覧を抽出
    if (url.includes("startup")) {
      chrome.webRequest.getContent(details.requestId, {}, (body) => {
        try {
          const data = JSON.parse(body);
          // Collection配列からguid一覧を抽出
          const guids = (data.Collection || []).map(col => col.guid).filter(Boolean);
          // storageに保存
          chrome.storage.local.set({ calendarUUIDs: guids }, () => {
            console.log("Saved calendar UUIDs:", guids);
          });
        } catch (e) {
          console.error("UUID抽出エラー", e);
        }
      });
    }

    // collectionsリクエスト時にhomeをUUIDとして使う、元のシンプルなCalDAV URL生成ロジックに戻す。
    if (url.includes("collections/")) {
      try {
        const urlObj = new URL(url);
        const host = urlObj.host.replace("calendarws", "caldav");
        const dsid = urlObj.searchParams.get("dsid") || "YOUR_DSID";
        // UUID部分を省略
        const caldavUrl = `https://${host}/${dsid}/calendars/`;
        chrome.storage.local.set({ lastUrl: caldavUrl }, () => {
          console.log("Saved Thunderbird URL:", caldavUrl);
        });
      } catch (e) {
        console.error("URL変換エラー", e);
      }
    }
  },
  { urls: ["*://*.icloud.com/*"] }
);
