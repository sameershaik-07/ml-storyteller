mkdir -p src/app/logistic-regression src/app/svm src/app/decision-tree src/app/pca

cat << 'INNER_EOF' > src/app/logistic-regression/page.tsx
export default function LogRegPage() { return <main className="p-8 text-white"><h1>Logistic Regression</h1></main>; }
INNER_EOF

cat << 'INNER_EOF' > src/app/svm/page.tsx
export default function SVMPage() { return <main className="p-8 text-white"><h1>Support Vector Machine</h1></main>; }
INNER_EOF

cat << 'INNER_EOF' > src/app/decision-tree/page.tsx
export default function DTPage() { return <main className="p-8 text-white"><h1>Decision Tree</h1></main>; }
INNER_EOF

cat << 'INNER_EOF' > src/app/pca/page.tsx
export default function PCAPage() { return <main className="p-8 text-white"><h1>PCA</h1></main>; }
INNER_EOF

