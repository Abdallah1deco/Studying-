<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>موقعي الجديد</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; text-align: center; background-color: #f0f0f0; color: #333; }
        h1 { color: #007bff; }
        p { font-size: 1.2em; }
        .pdf-list { margin: 30px auto; max-width: 500px; background: #fff; border-radius: 10px; padding: 20px; box-shadow: 0 0 10px rgba(0,0,0,0.08);}
        .pdf-list h2 { color: #007bff; }
        .pdf-item { margin: 10px 0; }
        .pdf-item a { color: #007bff; text-decoration: none; }
        .pdf-item a:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <h1>أهلًا بك في موقعك الجديد!</h1>
    <p>هذه صفحة أساسية. يمكنك الآن البدء في تطوير هذا الموقع وإضافة المحتوى والميزات التي ترغب بها.</p>
    <p>بالتوفيق في مشروعك!</p>

    <div class="pdf-list">
        <h2>ملفات PDF المرفقة</h2>
        <div id="pdf-container">
            <p>جاري تحميل ملفات PDF...</p>
        </div>
    </div>

    <script>
        // جلب ملفات PDF من مجلد pdfs تلقائياً (عن طريق GitHub API)
        async function fetchPDFs() {
            const repo = "Abdallah1deco/Studying-";
            const branch = "main"; // إذا كان اسم الفرع الرئيسي مختلف غيّره هنا
            const pdfsUrl = `https://api.github.com/repos/${repo}/contents/pdfs?ref=${branch}`;
            const container = document.getElementById('pdf-container');

            try {
                const res = await fetch(pdfsUrl);
                if (!res.ok) throw new Error("لم يتم العثور على مجلد PDF أو لا توجد ملفات بعد.");
                const files = await res.json();
                const pdfFiles = files.filter(file => file.name.endsWith('.pdf'));
                if (pdfFiles.length === 0) {
                    container.innerHTML = "<p>لا توجد ملفات PDF مرفقة بعد.</p>";
                    return;
                }
                container.innerHTML = pdfFiles.map(file =>
                    `<div class="pdf-item">
                        <a href="pdfs/${file.name}" target="_blank" rel="noopener">📄 ${file.name}</a>
                    </div>`
                ).join("");
            } catch (e) {
                container.innerHTML = "<p>لا توجد ملفات PDF مرفقة بعد.</p>";
            }
        }
        fetchPDFs();
    </script>
</body>
</html>
