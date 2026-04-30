import { useState } from 'react'

export function useSessionStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = sessionStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Error reading sessionStorage key "${key}":`, error)
      return initialValue
    }
  })

  const setValue = (value: T) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      sessionStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error(`Error setting sessionStorage key "${key}":`, error)
    }
  }

  //   useEffect(() => {
  //     if (typeof window !== 'undefined') {
  //       window.addEventListener('storage', (event) => {
  //         if (event.key === key) {
  //           try {
  //             const newValue = event.newValue ? JSON.parse(event.newValue) : initialValue
  //             setStoredValue(newValue)
  //           } catch (error) {
  //             console.error(`Error parsing sessionStorage key "${key}" on storage event:`, error)
  //           }
  //         }
  //       })
  //     }
  //   }, [])

  return [storedValue, setValue]
}
