import { useCallback, useEffect, useState } from 'react'

const PREFIX = 'qazaq-site:'

export function readStore<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}
export function writeStore<T>(key: string, value: T) {
  try { localStorage.setItem(PREFIX + key, JSON.stringify(value)) } catch { /* сақтау қолжетімсіз */ }
}

export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => readStore(key, initial))
  useEffect(() => { writeStore(key, value) }, [key, value])
  const reset = useCallback(() => setValue(initial), [initial])
  return [value, setValue, reset] as const
}
