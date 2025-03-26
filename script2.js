document.addEventListener('DOMContentLoaded', async () => {
    if (!localStorage.getItem('authenticated')) {
        const permanentExemption = localStorage.getItem('permanentExemption');
        if (permanentExemption === 'granted') {
            localStorage.setItem('authenticated', true);
        } else {
            window.location.href = 'index.html';
            return;
        }
    }

    try {
        const response = await fetch('others/notice.txt');
        const noticeText = await response.text();
        document.getElementById('notice').textContent = noticeText;
    } catch (error) {
        document.getElementById('notice').textContent = '加载公告失败';
    }
});

function openSubsite(siteName) {
    alert(`即将跳转到 ${siteName}（尚未实现）`);
}

function openAuthorPage() {
    alert('即将跳转到作者页面（尚未实现）');
}    