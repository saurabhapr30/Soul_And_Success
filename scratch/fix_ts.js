import fs from 'fs';
import path from 'path';

const baseDir = 'c:/Users/worka/OneDrive/onedrive desk/Soul_And_Success/src';
const files = [
    'components/admin/AdminCrudModal.tsx',
    'components/admin/DeleteConfirmModal.tsx',
    'pages/admin/AdminCoursesPage.tsx',
    'pages/admin/AdminBooksPage.tsx',
    'pages/admin/AdminMerchandisePage.tsx',
    'pages/admin/AdminTestimonialsPage.tsx'
];

for (const fName of files) {
    const p = path.join(baseDir, fName);
    let content = fs.readFileSync(p, 'utf8');
    
    // Fix toast
    content = content.replace(/import toast from 'react-hot-toast';/g, "const toast = { error: (msg: string) => alert(msg), success: (msg: string) => alert(msg) };");
    
    // Fix FieldDef import
    content = content.replace(/import \{ AdminCrudModal, FieldDef \} from '\.\.\/\.\.\/components\/admin\/AdminCrudModal';/g, "import { AdminCrudModal } from '../../components/admin/AdminCrudModal';\nimport type { FieldDef } from '../../components/admin/AdminCrudModal';");
    
    // Fix X unused import
    content = content.replace(/import \{ X, AlertTriangle \} from 'lucide-react';/g, "import { AlertTriangle } from 'lucide-react';");
    
    fs.writeFileSync(p, content);
}
console.log('Fixed TS errors');
