// Theme toggle functionality
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const html = document.documentElement;

const savedTheme = localStorage.getItem('theme') || 'light';
if (savedTheme === 'dark') {
    html.classList.add('dark-theme');
    themeIcon.textContent = '☀️';
}

themeToggle.addEventListener('click', () => {
    html.classList.toggle('dark-theme');
    const isDark = html.classList.contains('dark-theme');
    themeIcon.textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// LaTeX rendering functionality
const latexInput = document.getElementById('latex-input');
const renderBtn = document.getElementById('render-btn');
const loadingState = document.getElementById('loading');
const errorState = document.getElementById('error-message');
const errorText = document.getElementById('error-text');
const successState = document.getElementById('success-state');
const emptyState = document.getElementById('empty-state');
const renderedImage = document.getElementById('rendered-image');
const downloadBtn = document.getElementById('download-btn');
const copyBtn = document.getElementById('copy-btn');

let currentImageData = null;

function showState(state) {
    loadingState.style.display = 'none';
    errorState.style.display = 'none';
    successState.style.display = 'none';
    emptyState.style.display = 'none';
    
    if (state) {
        state.style.display = 'block';
    }
}

renderBtn.addEventListener('click', async () => {
    const latex = latexInput.value.trim();
    
    if (!latex) {
        errorText.textContent = 'Please enter some LaTeX code';
        showState(errorState);
        return;
    }
    
    showState(loadingState);

    console.log(latex)
    
    try {
        const response = await fetch('/render', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ latex })
        });
        
        const data = await response.json();
        
        if (data.success) {
            currentImageData = data.image;
            renderedImage.src = 'data:image/png;base64,' + data.image;
            showState(successState);
        } else {
            errorText.textContent = data.error || 'Failed to render LaTeX';
            showState(errorState);
        }
    } catch (error) {
        errorText.textContent = 'Network error: ' + error.message;
        showState(errorState);
    }
});

downloadBtn.addEventListener('click', () => {
    if (!currentImageData) return;
    
    const link = document.createElement('a');
    link.href = 'data:image/png;base64,' + currentImageData;
    link.download = 'latex-render.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

copyBtn.addEventListener('click', async () => {
    if (!currentImageData) return;
    
    try {
        const base64Response = await fetch('data:image/png;base64,' + currentImageData);
        const blob = await base64Response.blob();
        
        await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
        ]);
        
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        copyBtn.classList.add('success');
        
        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.classList.remove('success');
        }, 2000);
    } catch (error) {
        console.error('Failed to copy image:', error);
        alert('Failed to copy image to clipboard. Your browser may not support this feature.');
    }
});

latexInput.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        renderBtn.click();
    }
});

latexInput.value = String.raw`x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}`;