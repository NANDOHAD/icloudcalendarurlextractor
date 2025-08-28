document.addEventListener("DOMContentLoaded", () => {
  const urlDiv = document.getElementById("url");
  const copyBtn = document.getElementById("copyBtn");
  const resetBtn = document.getElementById("resetBtn");

  // storageから最新URLを取得
  function updateUrl() {
    chrome.storage.local.get("lastUrl", (data) => {
      if (data.lastUrl) {
        urlDiv.textContent = data.lastUrl;
      } else {
        urlDiv.textContent = "（まだ取得されていません）";
      }
    });
  }
  updateUrl();

  // storageの変更を監視して自動更新
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "local" && changes.lastUrl) {
      urlDiv.textContent = changes.lastUrl.newValue || "（まだ取得されていません）";
    }
  });

  // コピー処理
  copyBtn.addEventListener("click", () => {
    const text = urlDiv.textContent;
    if (text && text.startsWith("http")) {
      navigator.clipboard.writeText(text).then(() => {
        copyBtn.textContent = "コピーしました!";
        setTimeout(() => copyBtn.textContent = "コピー", 1500);
      });
    }
  });

  resetBtn.addEventListener("click", () => {
    chrome.storage.local.remove("lastUrl", () => {
      urlDiv.textContent = "（まだ取得されていません）";
    });
  });
});
