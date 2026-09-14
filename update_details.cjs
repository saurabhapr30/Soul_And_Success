const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src', 'pages', 'ProductDetailsPage.tsx');
let content = fs.readFileSync(file, 'utf8');

const regex = /<div className="pdp-info-cards-grid">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/section>/;

// Let's replace the whole grid contents dynamically mapping the new arrays.
// The three sections are: BEST OFFERS, Terms & Condition, PRODUCT DETAILS.
// Wait, the icons should be preserved.

const replacement = `<div className="pdp-info-cards-grid">
            {/* BEST OFFERS */}
            {(!product.bestOffers || product.bestOffers.length > 0) && (
            <div className="pdp-info-card">
              <div className="pdp-card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
              </div>
              <h4>BEST OFFERS</h4>
              {product.bestOffers && product.bestOffers.length > 0 ? (
                <ul>
                  {product.bestOffers.map((offer: string, idx: number) => (
                    <li key={idx}>{offer}</li>
                  ))}
                </ul>
              ) : (
                <p className="pdp-empty-text">No current offers available.</p>
              )}
            </div>
            )}
            
            {/* TERMS & CONDITION */}
            {(!product.termsAndConditions || product.termsAndConditions.length > 0) && (
            <div className="pdp-info-card">
              <div className="pdp-card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
              </div>
              <h4>TERMS & CONDITION</h4>
              {product.termsAndConditions && product.termsAndConditions.length > 0 ? (
                <ul>
                  {product.termsAndConditions.map((term: string, idx: number) => (
                    <li key={idx}>{term}</li>
                  ))}
                </ul>
              ) : (
                <p className="pdp-empty-text">Standard terms apply.</p>
              )}
            </div>
            )}

            {/* PRODUCT DETAILS */}
            {(!product.productDetails || product.productDetails.length > 0) && (
            <div className="pdp-info-card">
              <div className="pdp-card-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
              </div>
              <h4>PRODUCT DETAILS</h4>
              {product.productDetails && product.productDetails.length > 0 ? (
                <ul>
                  {product.productDetails.map((detail: string, idx: number) => (
                    <li key={idx}>{detail}</li>
                  ))}
                </ul>
              ) : (
                <p className="pdp-empty-text">No additional details.</p>
              )}
            </div>
            )}
          </div>
        </div>
      </section>`;

const originalHtmlMatch = content.match(/<div className="pdp-info-cards-grid">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/section>/);

if (originalHtmlMatch) {
  content = content.replace(originalHtmlMatch[0], replacement);
  fs.writeFileSync(file, content, 'utf8');
  console.log('Successfully updated ProductDetailsPage.tsx');
} else {
  console.log('Regex did not match.');
}
