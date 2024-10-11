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
  let count = 0;

  function createTab() {
    const tabId = ++count;
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
    // 保存新创建的标签页内容
    saveTabContent();
  }

  function renderTabs() {
    tabList.innerHTML = "";
    tabs.forEach((tab) => {
      const li = document.createElement("li");
      const tabContent = document.createElement("span");
      tabContent.textContent = `Tab ${tab.id}`;
      tabContent.onclick = (e) => {
        e.stopPropagation();
        switchTab(tab.id);
      };
      li.appendChild(tabContent);

      if (tab.id === activeTabId) {
        li.classList.add("active");
      }

      // 给li元素添加删除按钮
      const deleteBtn = document.createElement("button");
      deleteBtn.innerHTML = "&times;"; // 使用 HTML 实体来表示 × 符号
      deleteBtn.className = "delete-btn"; // 添加一个类名以便于样式设置
      deleteBtn.onclick = (e) => {
        e.stopPropagation(); // 阻止事件冒泡
        removeTab(tab.id);
      };
      li.appendChild(deleteBtn);
      tabList.appendChild(li);
    });
  }

  function switchTab(tabId) {
    // 保存当前标签页的内容
    saveTabContent();

    const tab = tabs.find((t) => t.id === tabId);
    if (!tab) {
      console.error(`Tab with id ${tabId} not found`);
      if (tabs.length > 0) {
        // 如果找不到指定的标签页，但还有其他标签页，就切换到第一个标签页
        switchTab(tabs[0].id);
      } else {
        // 如果没有任何标签页，创建一个新的
        createTab();
      }
      return;
    }

    // 切换到新的标签页
    activeTabId = tabId;
    inputArea.value = tab.input || "";
    outputArea.textContent = tab.output || "";
    indentSelect.value = tab.indent || "2";
    fontSizeSelect.value = tab.fontSize || "14";
    applyFontSize(tab.fontSize || "14");

    renderTabs();
  }

  function saveTabContent() {
    if (activeTabId) {
      const tab = tabs.find((t) => t.id === activeTabId);
      if (tab) {
        tab.input = inputArea.value;
        tab.output = outputArea.textContent;
        tab.indent = indentSelect.value;
        tab.fontSize = fontSizeSelect.value;
      }
    }
  }

  /**
   * 删除标签页
   * @param {number} tabId
   */
  function removeTab(tabId) {
    // 保存当前标签页内容
    saveTabContent();

    // 需要满足限制 最少有一个tab
    if (tabs.length === 1) {
      return;
    }

    // 找到要删除的标签页索引
    const tabIndex = tabs.findIndex((tab) => tab.id === tabId);

    // 如果找不到标签页，直接返回
    if (tabIndex === -1) {
      return;
    }

    // 从数组中删除标签页
    tabs.splice(tabIndex, 1);

    // 确定新的激活标签页
    let newActiveTabId;
    if (activeTabId === tabId) {
      // 如果删除的是当前激活的标签页，则激活前一个标签页或第一个标签页
      newActiveTabId = tabs[Math.max(0, tabIndex - 1)].id;
    } else {
      // 如果删除的不是当前激活的标签页，保持当前激活的标签页不变
      newActiveTabId = activeTabId;
    }

    // 重新渲染标签页并切换到新的激活标签页
    renderTabs();
    switchTab(newActiveTabId);
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

  // 保存初始标签页内容
  saveTabContent();
});
