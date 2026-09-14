const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src', 'components', 'admin', 'ProductFormModal.tsx');
let content = fs.readFileSync(file, 'utf8');

// 1. Add the details tab to the tabs array
content = content.replace(
  /const tabs = \[\n\s*\{ id: 'basic', label: 'Basic Info', icon: '.*?' \},\n\s*\{ id: 'pricing', label: 'Pricing', icon: '.*?' \},\n\s*\{ id: 'media', label: 'Media', icon: '.*?' \},\n\s*\{ id: 'settings', label: 'Settings', icon: '.*?' \},\n\s*\] as const;/g,
  `const tabs = [
      { id: 'basic', label: 'Basic Info', icon: '📝' },
      { id: 'pricing', label: 'Pricing', icon: '💰' },
      { id: 'media', label: 'Media', icon: '🖼️' },
      { id: 'settings', label: 'Settings', icon: '⚙️' },
      { id: 'details', label: 'Cards Content', icon: '📋' }
    ] as const;`
);

// 2. Fix the NEXT button logic in the footer to check for details instead of settings
content = content.replace(
  /\{activeTab !== 'settings' \? \(/g,
  `{activeTab !== 'details' ? (`
);

// 3. Move the details section into pf-body, right before pf-footer
// First, extract it from where it currently is (before </form>)
const detailsSectionRegex = /\s*\{\/\* \?\? DETAILS \*\/\}\s*\{activeTab === 'details' && \(\s*<Section[\s\S]*?<\/Section>\s*\)\}\s*(?=<\/form>)/g;
const detailsMatch = content.match(detailsSectionRegex);

if (detailsMatch) {
  content = content.replace(detailsSectionRegex, ''); // Remove it from the end
  // Insert it before the pf-footer div
  content = content.replace(
    /\s*<div className="pf-footer">/g,
    `\n\n            {/* 📋 DETAILS */}\n            {activeTab === 'details' && (\n              <Section\n                title="Dynamic Info Cards"\n                icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>}\n              >\n                <StringListInput \n                  label="BEST OFFERS" \n                  items={type === 'course' ? course.bestOffers : type === 'book' ? book.bestOffers : merch.bestOffers}\n                  onChange={items => {\n                    if (type === 'course') setCourse(p => ({ ...p, bestOffers: items }));\n                    else if (type === 'book') setBook(p => ({ ...p, bestOffers: items }));\n                    else setMerch(p => ({ ...p, bestOffers: items }));\n                  }}\n                  placeholder="e.g. Applicable on: Orders above Rs. 300"\n                />\n                <StringListInput \n                  label="TERMS & CONDITION" \n                  items={type === 'course' ? course.termsAndConditions : type === 'book' ? book.termsAndConditions : merch.termsAndConditions}\n                  onChange={items => {\n                    if (type === 'course') setCourse(p => ({ ...p, termsAndConditions: items }));\n                    else if (type === 'book') setBook(p => ({ ...p, termsAndConditions: items }));\n                    else setMerch(p => ({ ...p, termsAndConditions: items }));\n                  }}\n                />\n                <StringListInput \n                  label="PRODUCT DETAILS" \n                  items={type === 'course' ? course.productDetails : type === 'book' ? book.productDetails : merch.productDetails}\n                  onChange={items => {\n                    if (type === 'course') setCourse(p => ({ ...p, productDetails: items }));\n                    else if (type === 'book') setBook(p => ({ ...p, productDetails: items }));\n                    else setMerch(p => ({ ...p, productDetails: items }));\n                  }}\n                />\n              </Section>\n            )}\n            <div className="pf-footer">`
  );
}

fs.writeFileSync(file, content, 'utf8');
console.log('Fixed ProductFormModal.tsx layout and tabs');
