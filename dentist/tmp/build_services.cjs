const fs = require('fs');
const path = require('path');

const projectDir = 'd:/webdev/dentist';
const tmpDir = path.join(projectDir, 'tmp');

const indexHtmlContent = fs.readFileSync(path.join(projectDir, 'index.html'), 'utf-8');
const topSkeletonMatch = indexHtmlContent.match(/([\s\S]*?)<div id="navbar-container"><\/div>/);
const topSkeleton = topSkeletonMatch[1] + '<div id="navbar-container"></div>\n';

const bottomSkeletonMatch = indexHtmlContent.match(/(<div id="footer-container">[\s\S]*)/);
const bottomSkeleton = '\n    <main>\n' + bottomSkeletonMatch[1]; // close it with main wrapper for consistency just in case, wait no, let's wrap the extracted content within <main></main> properly

const rawHtml = fs.readFileSync(path.join(tmpDir, 'services.html'), 'utf-8');

// Extract everything between </nav> and <footer
// In the raw HTML, </nav> is present, and <footer is present.
const bodyContentMatch = rawHtml.match(/<\/nav>([\s\S]*?)<footer/);

if (bodyContentMatch) {
    let mainContentStr = '<main>' + bodyContentMatch[1] + '</main>';
    mainContentStr = mainContentStr.replace(/<section\s+class="([^"]+)"/g, '<section class="$1 scroll-reveal"');
    
    // Also include header in scroll reveal if it exists since it's actig as hero section
    mainContentStr = mainContentStr.replace(/<header\s+class="([^"]+)"/g, '<header class="$1 scroll-reveal"');

    const finalHtml = `${topSkeleton}
${mainContentStr}
${bottomSkeletonMatch[1]}`;

    fs.writeFileSync(path.join(projectDir, 'services.html'), finalHtml, 'utf-8');
    console.log('Successfully created services.html');
} else {
    console.log('Failed to match boundaries in services.html');
}
