const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src', 'components', 'admin', 'ProductFormModal.tsx');
let content = fs.readFileSync(file, 'utf8');

// 1. Add fields to CourseFormData
content = content.replace(
  /thumbnail: string;\s*images: string\[\];/g,
  `thumbnail: string;\n  images: string[];\n  bestOffers: string[];\n  termsAndConditions: string[];\n  productDetails: string[];`
);

// 2. Add fields to BookFormData
content = content.replace(
  /coverImage: string;\s*images: string\[\];/g,
  `coverImage: string;\n  images: string[];\n  bestOffers: string[];\n  termsAndConditions: string[];\n  productDetails: string[];`
);

// 3. Add fields to MerchFormData
content = content.replace(
  /image: string;\s*images: string\[\];/g,
  `image: string;\n  images: string[];\n  bestOffers: string[];\n  termsAndConditions: string[];\n  productDetails: string[];`
);

// 4. Update useState initialization for Course
content = content.replace(
  /date: '', time: '', categoryId: '', meetLink: '',/g,
  `date: '', time: '', categoryId: '', meetLink: '', bestOffers: [], termsAndConditions: [], productDetails: [],`
);

// 5. Update useState initialization for Book
content = content.replace(
  /coverImage: '', images: \[\], isActive: true, featured: false, categoryId: '', downloadLink: '',/g,
  `coverImage: '', images: [], isActive: true, featured: false, categoryId: '', downloadLink: '', bestOffers: [], termsAndConditions: [], productDetails: [],`
);

// 6. Update useState initialization for Merch
content = content.replace(
  /categoryId: '', image: '', images: \[\], isActive: true, isFeatured: false,/g,
  `categoryId: '', image: '', images: [], isActive: true, isFeatured: false, bestOffers: [], termsAndConditions: [], productDetails: [],`
);

// 7. Update useEffect mapping for Course
content = content.replace(
  /meetLink: initialData.meetLink \?\? '',/g,
  `meetLink: initialData.meetLink ?? '',\n            bestOffers: Array.isArray(initialData.bestOffers) ? initialData.bestOffers : [],\n            termsAndConditions: Array.isArray(initialData.termsAndConditions) ? initialData.termsAndConditions : [],\n            productDetails: Array.isArray(initialData.productDetails) ? initialData.productDetails : [],`
);

// 8. Update useEffect mapping for Book
content = content.replace(
  /downloadLink: initialData.downloadLink \?\? '',\n\s*}\);/g,
  `downloadLink: initialData.downloadLink ?? '',\n            bestOffers: Array.isArray(initialData.bestOffers) ? initialData.bestOffers : [],\n            termsAndConditions: Array.isArray(initialData.termsAndConditions) ? initialData.termsAndConditions : [],\n            productDetails: Array.isArray(initialData.productDetails) ? initialData.productDetails : [],\n          });`
);

// 9. Update useEffect mapping for Merch
content = content.replace(
  /isFeatured: !!initialData.isFeatured,\n\s*}\);/g,
  `isFeatured: !!initialData.isFeatured,\n            bestOffers: Array.isArray(initialData.bestOffers) ? initialData.bestOffers : [],\n            termsAndConditions: Array.isArray(initialData.termsAndConditions) ? initialData.termsAndConditions : [],\n            productDetails: Array.isArray(initialData.productDetails) ? initialData.productDetails : [],\n          });`
);

// 10. Add StringListInput Component before ProductFormModal definition
const stringListInputCode = `
const StringListInput: React.FC<{
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
}> = ({ label, items, onChange, placeholder }) => {
  const [input, setInput] = useState('');

  const handleAdd = () => {
    if (input.trim()) {
      onChange([...items, input.trim()]);
      setInput('');
    }
  };

  const handleRemove = (index: number) => {
    const copy = [...items];
    copy.splice(index, 1);
    onChange(copy);
  };

  return (
    <div className="pf-field-group pf-span2" style={{ border: '1px solid #eee', padding: '1rem', borderRadius: '8px' }}>
      <label className="pf-label">{label}</label>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
        <input 
          className="pf-input pf-flex1" 
          value={input} 
          onChange={e => setInput(e.target.value)}
          placeholder={placeholder || "Add bullet point..."}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAdd();
            }
          }}
        />
        <button type="button" onClick={handleAdd} className="pf-add-url-btn" style={{ padding: '0 1rem' }}>Add</button>
      </div>
      {items.length > 0 && (
        <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem', margin: 0, fontSize: '0.9rem', color: '#555' }}>
          {items.map((item, i) => (
            <li key={i} style={{ marginBottom: '4px' }}>
              <span>{item}</span>
              <button type="button" onClick={() => handleRemove(i)} style={{ background: 'none', border: 'none', color: '#e53e3e', cursor: 'pointer', marginLeft: '8px', padding: 0 }}>&times;</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
`;

content = content.replace(
  /export const ProductFormModal: React.FC<ProductFormModalProps> = /g,
  stringListInputCode + '\nexport const ProductFormModal: React.FC<ProductFormModalProps> = '
);

// 11. Add a new tab for details, wait, better to just append it to 'basic' tab or 'settings' tab. Let's add a new tab 'content' for it.
content = content.replace(
  /<button\n\s*type="button"\n\s*className={`pf-tab \${activeTab === 'settings' \? 'pf-tab--active' : ''}`}\n\s*onClick={\(\) => setActiveTab\('settings'\)}\n\s*>\n\s*Settings\n\s*<\/button>/g,
  `<button\n            type="button"\n            className={\`pf-tab \${activeTab === 'settings' ? 'pf-tab--active' : ''}\`}\n            onClick={() => setActiveTab('settings')}\n          >\n            Settings\n          </button>\n          <button\n            type="button"\n            className={\`pf-tab \${activeTab === 'details' ? 'pf-tab--active' : ''}\`}\n            onClick={() => setActiveTab('details')}\n          >\n            Cards Content\n          </button>`
);

content = content.replace(
  /const \[activeTab, setActiveTab\] = useState<'basic' \| 'pricing' \| 'media' \| 'settings'>\('basic'\);/g,
  `const [activeTab, setActiveTab] = useState<'basic' | 'pricing' | 'media' | 'settings' | 'details'>('basic');`
);

// Add the 'details' tab section right before {/* FOOTER */}
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

content = content.replace(
  /\{\/\* \?? FOOTER \?? \*\/\}/g,
  detailsTabCode + '\n            {/* 🦶 FOOTER */}'
);

fs.writeFileSync(file, content, 'utf8');
console.log('Successfully updated ProductFormModal.tsx');
