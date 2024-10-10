document.addEventListener("DOMContentLoaded", function () {
  const inputArea = document.getElementById("input");
  const outputArea = document.getElementById("output");
  const formatButton = document.getElementById("format");
  const copyButton = document.getElementById("copy");
  const indentSelect = document.getElementById("indent");
  const fontSizeSelect = document.getElementById("font-size");
  const tabList = document.getElementById("tab-list");
  const newTabBtn = document.getElementById("new-tab-btn");

  let tabs = [];
  let activeTabId = null;

  function createTab() {
    const tabId = Date.now();
    const tab = {
      id: tabId,
      input: "",
      output: "",
      indent: "2",
      fontSize: "14",
    };
    tabs.push(tab);
    renderTabs();
    switchTab(tabId);
  }

  function renderTabs() {
    tabList.innerHTML = "";
    tabs.forEach((tab) => {
      const li = document.createElement("li");
      li.textContent = `Tab ${tabs.indexOf(tab) + 1}`;
      li.onclick = () => switchTab(tab.id);
      if (tab.id === activeTabId) {
        li.classList.add("active");
      }
      tabList.appendChild(li);
    });
  }

  function switchTab(tabId) {
    saveTabContent();
    activeTabId = tabId;
    const tab = tabs.find((t) => t.id === tabId);
    inputArea.value = tab.input;
    outputArea.textContent = tab.output;
    indentSelect.value = tab.indent;
    fontSizeSelect.value = tab.fontSize;
    applyFontSize(tab.fontSize);
    renderTabs();
  }

  function saveTabContent() {
    if (activeTabId) {
      const tab = tabs.find((t) => t.id === activeTabId);
      tab.input = inputArea.value;
      tab.output = outputArea.textContent;
      tab.indent = indentSelect.value;
      tab.fontSize = fontSizeSelect.value;
    }
  }

  function applyFontSize(fontSize) {
    const fontSizePx = fontSize + "px";
    inputArea.style.fontSize = fontSizePx;
    outputArea.style.fontSize = fontSizePx;

    const lineHeight = Math.max(1.5, 24 / parseInt(fontSize));
    inputArea.style.lineHeight = lineHeight;
    outputArea.style.lineHeight = lineHeight;

    const scrollRatio = outputArea.scrollTop / outputArea.scrollHeight;
    setTimeout(() => {
      outputArea.scrollTop = scrollRatio * outputArea.scrollHeight;
    }, 0);
  }

  newTabBtn.addEventListener("click", createTab);

  formatButton.addEventListener("click", function () {
    const inputJson = inputArea.value;
    const indent = parseInt(indentSelect.value);
    try {
      const parsedJson = JSON.parse(inputJson);
      const formattedJson = JSON.stringify(parsedJson, null, indent);
      outputArea.textContent = formattedJson;
      saveTabContent();
    } catch (error) {
      outputArea.textContent = "错误：无效的JSON字符串\n" + error.message;
    }
  });

  copyButton.addEventListener("click", function () {
    const outputText = outputArea.textContent;
    navigator.clipboard
      .writeText(outputText)
      .then(function () {
        copyButton.textContent = "已复制";
        setTimeout(function () {
          copyButton.textContent = "复制";
        }, 2000);
      })
      .catch(function (err) {
        console.error("无法复制文本: ", err);
      });
  });

  indentSelect.addEventListener("change", function () {
    saveTabContent();
  });

  fontSizeSelect.addEventListener("change", function () {
    const fontSize = fontSizeSelect.value;
    applyFontSize(fontSize);
    saveTabContent();
  });

  // 创建第一个标签页
  createTab();
});
