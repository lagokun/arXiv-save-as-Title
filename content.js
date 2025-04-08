console.log("✅ content.js loaded on arXiv page");

function addSaveAsTitleButton() {
  // 오른쪽 상단 View PDF 버튼 찾기
  const listItems = document.querySelectorAll("div.full-text ul li");

  let pdfLinkElement = null;
  for (const li of listItems) {
    const a = li.querySelector("a");
    if (a && a.href.includes("/pdf/")) {
      pdfLinkElement = a;
      break;
    }
  }

  if (!pdfLinkElement) {
    console.warn("❗ PDF 링크를 찾지 못했습니다.");
    return;
  }

  if (document.getElementById("save-as-title-btn")) {
    console.log("✅ 버튼이 이미 존재합니다.");
    return;
  }

  const button = document.createElement("button");
  button.textContent = "💾 Save PDF as Title";
  button.id = "save-as-title-btn";
  button.style.marginTop = "5px";
  button.style.padding = "6px 12px";
  button.style.backgroundColor = "#4CAF50";
  button.style.color = "white";
  button.style.border = "none";
  button.style.borderRadius = "4px";
  button.style.cursor = "pointer";
  button.style.display = "block";

  // PDF 링크 바로 아래에 버튼 삽입
  pdfLinkElement.parentElement.appendChild(button);

  button.addEventListener("click", () => {
    let title = document.querySelector("h1.title")?.innerText || document.title;

    if (title.includes("Title:")) {
      title = title.split("Title:")[1].trim();
    }

    const safeTitle = title.replace(/[\/:*?"<>|]/g, "").replace(/\s+/g, "_");
    const pdfUrl = pdfLinkElement.href;

    chrome.runtime.sendMessage({
      action: "download",
      url: pdfUrl,
      filename: `${safeTitle}.pdf`
    });
  });

  console.log("✅ Save PDF as Title 버튼 삽입 완료");
}

window.addEventListener("load", () => {
  setTimeout(addSaveAsTitleButton, 1000); // arXiv는 JS로 DOM 구성하므로 딜레이 필요
});
