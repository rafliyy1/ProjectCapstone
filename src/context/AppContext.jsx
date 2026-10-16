import { createContext, useContext, useState, useEffect } from 'react'
import { products as initialProducts } from '../data/products'

// ─── Admin User ───────────────────────────────────────────────────────────────
// Hanya admin yang dapat login. Kredensial lengkap ada di ADMIN_CREDENTIALS.md
const DUMMY_USERS = [
  { id: 1, username: 'admin', password: 'admin123', role: 'admin', nama: 'Admin Reka Limbah' },
]

const AppContext = createContext(null)

// ─── Helpers localStorage ─────────────────────────────────────────────────────
function loadFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // silent fail
  }
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export function AppProvider({ children }) {
  // Auth
  const [currentUser, setCurrentUser] = useState(() =>
    loadFromStorage('rl_user', null)
  )

  // Produk (dari localStorage jika ada, fallback ke data statis)
  const [products, setProducts] = useState(() =>
    loadFromStorage('rl_products', initialProducts)
  )

  // Pesan dari FormulirKontak
  const [messages, setMessages] = useState(() =>
    loadFromStorage('rl_messages', [])
  )

  // Sinkronisasi ke localStorage setiap kali state berubah
  useEffect(() => {
    saveToStorage('rl_user', currentUser)
  }, [currentUser])

  useEffect(() => {
    saveToStorage('rl_products', products)
  }, [products])

  useEffect(() => {
    saveToStorage('rl_messages', messages)
  }, [messages])

  // ── Auth actions ───────────────────────────────────────────────────────────
  function login(username, password) {
    const user = DUMMY_USERS.find(
      (u) => u.username === username && u.password === password
    )
    if (user) {
      setCurrentUser(user)
      return { success: true, user }
    }
    return { success: false, error: 'Username atau password salah.' }
  }

  function logout() {
    setCurrentUser(null)
  }

  // ── Product actions ────────────────────────────────────────────────────────
  function addProduct(product) {
    const newProduct = {
      ...product,
      id: Date.now(),
      harga: Number(product.harga),
    }
    setProducts((prev) => [...prev, newProduct])
    return newProduct
  }

  function updateProduct(id, updatedData) {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, ...updatedData, harga: Number(updatedData.harga) } : p
      )
    )
  }

  function deleteProduct(id) {
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }

  // ── Message actions ────────────────────────────────────────────────────────
  function addMessage(msgData) {
    const newMsg = {
      ...msgData,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      isRead: false,
    }
    setMessages((prev) => [newMsg, ...prev])
  }

  function markMessageRead(id) {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isRead: true } : m))
    )
  }

  function deleteMessage(id) {
    setMessages((prev) => prev.filter((m) => m.id !== id))
  }

  return (
    <AppContext.Provider
      value={{
        // auth
        currentUser,
        login,
        logout,
        isAdmin: currentUser?.role === 'admin',
        isLoggedIn: !!currentUser,
        // products
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        // messages
        messages,
        addMessage,
        markMessageRead,
        deleteMessage,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}
