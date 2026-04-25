let extractedData = {
    html: "",
    css: "",
    js: ""
};

const fileInput = document.getElementById('fileInput');
const processBtn = document.getElementById('processBtn');
const status = document.getElementById('status');
const downloadArea = document.getElementById('downloadArea');

processBtn.addEventListener('click', () => {
    const file = fileInput.files[0];
    if (!file) return alert("Pilih file dulu!");

    const reader = new FileReader();
    reader.onload = function(e) {
        const fullText = e.target.result;
        const parser = new DOMParser();
        const doc = parser.parseFromString(fullText, 'text/html');

        // 1. Ambil isi <style> dan hapus tag-nya
        let cssContent = "";
        const styles = doc.querySelectorAll('style');
        styles.forEach(s => {
            cssContent += s.textContent + "\n";
            s.remove();
        });

        // 2. Ambil isi <script> dan hapus tag-nya
        let jsContent = "";
        const scripts = doc.querySelectorAll('script:not([src])'); // Hanya script internal
        scripts.forEach(s => {
            jsContent += s.textContent + "\n";
            s.remove();
        });

        // 3. Tambahkan link css dan js ke HTML baru
        const head = doc.head;
        const link = doc.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'css/style.css';
        head.appendChild(link);

        const scriptTag = doc.createElement('script');
        scriptTag.src = 'js/script.js';
        doc.body.appendChild(scriptTag);

        // Simpan data
        extractedData.html = "<!DOCTYPE html>\n" + doc.documentElement.outerHTML;
        extractedData.css = cssContent;
        extractedData.js = jsContent;

        status.innerText = "Berhasil dipisahkan!";
        downloadArea.style.display = 'grid';
    };
    reader.readAsText(file);
});

function downloadFile(type) {
    const content = extractedData[type];
    const filename = type === 'html' ? 'index.html' : type === 'css' ? 'style.css' : 'script.js';
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
}
