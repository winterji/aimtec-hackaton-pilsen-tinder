// ----------------------
// components/CategoryBar.tsx
// ----------------------
export default function CategoryBar() {
  const categories = ['Kavárny', 'Parky', 'Restaurace']

  return (
    <div className="flex overflow-x-auto gap-2 p-2">
      {categories.map((c) => (
        <button key={c} className="px-4 py-1 bg-gray-800 rounded-full">
          {c}
        </button>
      ))}
    </div>
  )
}