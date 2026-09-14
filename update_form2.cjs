const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src', 'components', 'admin', 'ProductFormModal.tsx');
let content = fs.readFileSync(file, 'utf8');

// Fix 1: The else block for form initialization
content = content.replace(
  /setCourse\(\{ title: '', slug: '', shortDescription: '', description: '', price: '', compareAtPrice: '', duration: '', level: '', thumbnail: '', images: \[\], isPublished: false, isFeatured: false, date: '', time: '', categoryId: '', meetLink: '' \}\);/g,
  `setCourse({ title: '', slug: '', shortDescription: '', description: '', price: '', compareAtPrice: '', duration: '', level: '', thumbnail: '', images: [], isPublished: false, isFeatured: false, date: '', time: '', categoryId: '', meetLink: '', bestOffers: [], termsAndConditions: [], productDetails: [] });`
);

content = content.replace(
  /setBook\(\{ title: '', slug: '', author: '', shortDescription: '', description: '', price: '', compareAtPrice: '', isbn: '', format: '', stock: '0', coverImage: '', images: \[\], isActive: true, featured: false, categoryId: '', downloadLink: '' \}\);/g,
  `setBook({ title: '', slug: '', author: '', shortDescription: '', description: '', price: '', compareAtPrice: '', isbn: '', format: '', stock: '0', coverImage: '', images: [], isActive: true, featured: false, categoryId: '', downloadLink: '', bestOffers: [], termsAndConditions: [], productDetails: [] });`
);

content = content.replace(
  /setMerch\(\{ name: '', slug: '', shortDescription: '', description: '', price: '', compareAtPrice: '', sku: '', stock: '0', categoryId: categories && Array.isArray\(categories\) \? \(categories\[0\]\?.id \?\? ''\) : '', image: '', images: \[\], isActive: true, isFeatured: false \}\);/g,
  `setMerch({ name: '', slug: '', shortDescription: '', description: '', price: '', compareAtPrice: '', sku: '', stock: '0', categoryId: categories && Array.isArray(categories) ? (categories[0]?.id ?? '') : '', image: '', images: [], isActive: true, isFeatured: false, bestOffers: [], termsAndConditions: [], productDetails: [] });`
);

// Fix 2: Append the details tab to the file correctly
const detailsTabCode = `
            {/* 📋 DETAILS */}
            {activeTab === 'details' && (
              <Section
                title="Dynamic Info Cards"
                icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>}
              >
                <StringListInput 
                  label="BEST OFFERS" 
                  items={type === 'course' ? course.bestOffers : type === 'book' ? book.bestOffers : merch.bestOffers}
                  onChange={items => {
                    if (type === 'course') setCourse(p => ({ ...p, bestOffers: items }));
                    else if (type === 'book') setBook(p => ({ ...p, bestOffers: items }));
                    else setMerch(p => ({ ...p, bestOffers: items }));
                  }}
                  placeholder="e.g. Applicable on: Orders above Rs. 300"
                />
                <StringListInput 
                  label="TERMS & CONDITION" 
                  items={type === 'course' ? course.termsAndConditions : type === 'book' ? book.termsAndConditions : merch.termsAndConditions}
                  onChange={items => {
                    if (type === 'course') setCourse(p => ({ ...p, termsAndConditions: items }));
                    else if (type === 'book') setBook(p => ({ ...p, termsAndConditions: items }));
                    else setMerch(p => ({ ...p, termsAndConditions: items }));
                  }}
                />
                <StringListInput 
                  label="PRODUCT DETAILS" 
                  items={type === 'course' ? course.productDetails : type === 'book' ? book.productDetails : merch.productDetails}
                  onChange={items => {
                    if (type === 'course') setCourse(p => ({ ...p, productDetails: items }));
                    else if (type === 'book') setBook(p => ({ ...p, productDetails: items }));
                    else setMerch(p => ({ ...p, productDetails: items }));
                  }}
                />
              </Section>
            )}
`;

// It's safer to just inject this right before the closing </form> tag.
content = content.replace(
  /<\/form>/g,
  detailsTabCode + '\n          </form>'
);

fs.writeFileSync(file, content, 'utf8');
console.log('Successfully applied fixes to ProductFormModal.tsx');
