document.addEventListener('DOMContentLoaded', function() {
    const inputArea = document.getElementById('input');
    const outputArea = document.getElementById('output');
    const formatButton = document.getElementById('format');
    const copyButton = document.getElementById('copy');
    const indentSelect = document.getElementById('indent');
    const fontSizeSelect = document.getElementById('font-size');

    formatButton.addEventListener('click', function() {
        const inputJson = inputArea.value;
        const indent = parseInt(indentSelect.value);
        try {
            const parsedJson = JSON.parse(inputJson);
            const formattedJson = JSON.stringify(parsedJson, null, indent);
            outputArea.textContent = formattedJson;
        } catch (error) {
            outputArea.textContent = '错误：无效的JSON字符串\n' + error.message;
        }
    });

    copyButton.addEventListener('click', function() {
        const outputText = outputArea.textContent;
        navigator.clipboard.writeText(outputText).then(function() {
            copyButton.textContent = '已复制';
            setTimeout(function() {
                copyButton.textContent = '复制';
            }, 2000);
        }).catch(function(err) {
            console.error('无法复制文本: ', err);
        });
    });

    fontSizeSelect.addEventListener('change', function() {
        const fontSize = fontSizeSelect.value + 'px';
        inputArea.style.fontSize = fontSize;
        outputArea.style.fontSize = fontSize;

        // 调整行高以保持一致的视觉效果
        const lineHeight = Math.max(1.5, 24 / parseInt(fontSizeSelect.value));
        inputArea.style.lineHeight = lineHeight;
        outputArea.style.lineHeight = lineHeight;

        // 重新计算输出区域的滚动位置
        const scrollRatio = outputArea.scrollTop / outputArea.scrollHeight;
        setTimeout(() => {
            outputArea.scrollTop = scrollRatio * outputArea.scrollHeight;
        }, 0);
    });

    // 初始化字体大小和行高
    fontSizeSelect.dispatchEvent(new Event('change'));
});
