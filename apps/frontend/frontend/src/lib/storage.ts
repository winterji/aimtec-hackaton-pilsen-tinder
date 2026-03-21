// ----------------------
// lib/storage.ts
// ----------------------
export const saveToStorage = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data))
}

export const getFromStorage = (key: string) => {
  const data = localStorage.getItem(key)
  return data ? JSON.parse(data) : null
}
