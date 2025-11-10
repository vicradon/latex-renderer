document.addEventListener('DOMContentLoaded', function() {
  // Theme toggle functionality
  const themeToggle = document.getElementById('theme-toggle');
  const currentTheme = localStorage.getItem('theme') || 'light';
  
  if (currentTheme === 'dark') {
    document.body.classList.add('dark-theme');
  }
  
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    const theme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
  });

  // Copy to clipboard functionality
  const copyBtn = document.getElementById('copyBtn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const img = document.querySelector('.rendered-img');
      if (img) {
        fetch(img.src)
          .then(res => res.blob())
          .then(blob => {
            const item = new ClipboardItem({ 'image/png': blob });
            navigator.clipboard.write([item]);
            alert('Image copied to clipboard!');
          })
          .catch(err => console.error('Error copying image: ', err));
      }
    });
  }

  // Download functionality
  const downloadBtn = document.getElementById('downloadBtn');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      const img = document.querySelector('.rendered-img');
      if (img) {
        const link = document.createElement('a');
        link.href = img.src;
        link.download = 'latex-render.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    });
  }
});
