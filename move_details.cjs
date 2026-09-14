const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src', 'components', 'admin', 'ProductFormModal.tsx');
let content = fs.readFileSync(file, 'utf8');

// 1. Extract the DETAILS block
const detailsRegex = /\s*\{\/\*.*?DETAILS.*?\*\/\}[\s\S]*?(?=<\/form>)/;
const match = content.match(detailsRegex);

if (!match) {
  console.log("Could not find the DETAILS block.");
  process.exit(1);
}

const detailsBlock = match[0];

// 2. Remove the DETAILS block from its current location
content = content.replace(detailsBlock, '\n          ');

// 3. Inject the DETAILS block into .pf-body just before it closes
const pfFooterRegex = /(\s*)(\{\/\*.*?Footer.*?\*\/\}[\s\S]*?<div className="pf-footer">)/;
const footerMatch = content.match(pfFooterRegex);
if (footerMatch) {
  // we want to put it right before `</div>\n\n          {/* Footer */}`
  // which means we need to find `</div>` that precedes the footer.
  // A safer way: replace `\n          </div>\n\n          {/*.*?Footer`
  // Actually, let's just do a string replacement if we know the exact string.
  
  const target = '          </div>\n\n          {/*';
  const targetIndex = content.indexOf(target);
  if (targetIndex !== -1) {
      const before = content.substring(0, targetIndex);
      const after = content.substring(targetIndex);
      content = before + detailsBlock + '\n' + after;
      fs.writeFileSync(file, content, 'utf8');
      console.log('Successfully moved the DETAILS block inside .pf-body!');
  } else {
      console.log("Could not find target index for injection.");
  }
} else {
  console.log("Could not find the footer block.");
}
