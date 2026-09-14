const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src', 'pages', 'ProductDetailsPage.tsx');
let content = fs.readFileSync(file, 'utf8');

// Remove the conditional rendering wrappers around the cards
content = content.replace(/\{\(\!product\.bestOffers \|\| product\.bestOffers\.length > 0\) && \(\n/g, '');
content = content.replace(/\n\s*\)\}\n\n\s*\{\(\!product\.termsAndConditions \|\| product\.termsAndConditions\.length > 0\) && \(\n/g, '\n\n');
content = content.replace(/\n\s*\)\}\n\n\s*\{\(\!product\.productDetails \|\| product\.productDetails\.length > 0\) && \(\n/g, '\n\n');
content = content.replace(/\n\s*\)\}\n\s*<\/div>\n\s*<\/section>/g, '\n        </div>\n      </section>');

fs.writeFileSync(file, content, 'utf8');
console.log('Fixed ProductDetailsPage.tsx card visibility');
