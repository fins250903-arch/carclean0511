import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const blogDir = path.join(__dirname, '../src/content/blog');

const categoryMap = {
    'oosaka': 'osaka',
    'toukyou': 'tokyo',
    'kyouto': 'kyoto',
    'hyougo': 'hyogo',
    'tiba': 'chiba',
    'hukuoka': 'fukuoka',
    'sizuoka': 'shizuoka',
    'saitamaa': 'saitama' // just in case
};

function processDirectory(directory) {
    const items = fs.readdirSync(directory);
    
    for (const item of items) {
        const fullPath = path.join(directory, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            processDirectory(fullPath);
        } else if (fullPath.endsWith('.md') || fullPath.endsWith('.mdx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let hasChanges = false;
            
            // frontmatter内のcategoriesを置換
            for (const [wrong, correct] of Object.entries(categoryMap)) {
                // '"oosaka"' or '- oosaka' or '- "oosaka"'
                const regex1 = new RegExp(`- "${wrong}"`, 'g');
                const regex2 = new RegExp(`- ${wrong}\\b`, 'g');
                
                if (regex1.test(content) || regex2.test(content)) {
                    content = content.replace(regex1, `- "${correct}"`);
                    content = content.replace(regex2, `- "${correct}"`);
                    hasChanges = true;
                }
            }
            
            if (hasChanges) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Fixed categories in: ${fullPath}`);
            }
        }
    }
}

processDirectory(blogDir);
console.log('Category fix complete.');
