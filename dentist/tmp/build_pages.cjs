const fs = require('fs');
const path = require('path');

const projectDir = 'd:/webdev/dentist';
const tmpDir = path.join(projectDir, 'tmp');

// 1. Extract the standard <head> and skeleton from index.html
const indexHtmlContent = fs.readFileSync(path.join(projectDir, 'index.html'), 'utf-8');

// Find everything before <div id="navbar-container">
const topSkeletonMatch = indexHtmlContent.match(/([\s\S]*?)<div id="navbar-container"><\/div>/);
const topSkeleton = topSkeletonMatch[1] + '<div id="navbar-container"></div>\n';

// Find everything after </main>
const bottomSkeletonMatch = indexHtmlContent.match(/(<div id="footer-container">[\s\S]*)/);
const bottomSkeleton = '\n    ' + bottomSkeletonMatch[1];


const pages = ['about', 'services', 'blog', 'contact'];

pages.forEach(page => {
    const rawPath = path.join(tmpDir, `${page}.html`);
    if (!fs.existsSync(rawPath)) {
        console.error(`Missing ${rawPath}`);
        return;
    }
    const rawHtml = fs.readFileSync(rawPath, 'utf-8');
    
    // Extract everything between <main...> and </main> using regex
    const mainMatch = rawHtml.match(/<main[^>]*>([\s\S]*?)<\/main>/);
    if (!mainMatch) {
         console.error(`Missing <main> tag in ${page}.html`);
         return;
    }
    
    // Stitch it all together, adding scroll-reveal to children <section> tags
    let mainContentStr = mainMatch[0];
    
    // Let's add scroll-reveal to the sections to maintain animations across the whole site
    mainContentStr = mainContentStr.replace(/<section\s+class="([^"]+)"/g, '<section class="$1 scroll-reveal"');
    
    const finalHtml = `${topSkeleton}
${mainContentStr}
${bottomSkeleton}`;

    fs.writeFileSync(path.join(projectDir, `${page}.html`), finalHtml, 'utf-8');
    console.log(`Successfully created ${page}.html`);
});

