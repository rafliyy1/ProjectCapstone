import { products as fallbackProducts } from '../data/products'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// ================= PRODUK =================
export async function fetchProducts() {
  try {
    const res = await fetch(`${API_BASE}/products`)
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
    const json = await res.json()
    if (json.success && Array.isArray(json.data) && json.data.length > 0) {
      return { data: json.data, isLive: true }
    }
    return { data: fallbackProducts, isLive: false }
  } catch (err) {
    console.warn('API backend belum aktif, menggunakan data lokal produk:', err.message)
    return { data: fallbackProducts, isLive: false }
  }
}

export async function createProduct(productData) {
  const res = await fetch(`${API_BASE}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData),
  })
  const json = await res.json()
  if (!res.ok || !json.success) {
    throw new Error(json.error || json.message || 'Gagal menambahkan produk.')
  }
  return json.data
}

export async function deleteProduct(id) {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: 'DELETE',
  })
  const json = await res.json()
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Gagal menghapus produk.')
  }
  return json
}

// ================= PESAN FORMULIR KONTAK =================
export async function sendContactMessage(messageData) {
  const res = await fetch(`${API_BASE}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(messageData),
  })
  const json = await res.json()
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Gagal menyimpan pesan ke database.')
  }
  return json
}

export async function fetchMessages() {
  const res = await fetch(`${API_BASE}/messages`)
  const json = await res.json()
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Gagal mengambil pesan.')
  }
  return json.data
}

export async function markMessageAsRead(id) {
  const res = await fetch(`${API_BASE}/messages/${id}/read`, {
    method: 'PATCH',
  })
  const text = await res.text()
  let json
  try {
    json = JSON.parse(text)
  } catch {
    throw new Error(
      'Server backend perlu direstart. Silakan tekan Ctrl+C di terminal "npm run server", lalu jalankan "npm run server" kembali.'
    )
  }
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Gagal menandai pesan.')
  }
  return json
}

export async function deleteMessage(id) {
  const res = await fetch(`${API_BASE}/messages/${id}`, {
    method: 'DELETE',
  })
  const json = await res.json()
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Gagal menghapus pesan.')
  }
  return json
}

// ================= ADMIN & AUTH =================
export async function loginAdmin(username, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
  const json = await res.json()
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Login gagal. Periksa username dan password.')
  }
  return json.admin
}

export async function fetchAdmins() {
  const res = await fetch(`${API_BASE}/admins`)
  const json = await res.json()
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Gagal mengambil data admin.')
  }
  return json.data
}

export async function createAdmin(adminData) {
  const res = await fetch(`${API_BASE}/admins`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(adminData),
  })
  const json = await res.json()
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Gagal menambahkan admin baru.')
  }
  return json.data
}

export async function deleteAdmin(id) {
  const res = await fetch(`${API_BASE}/admins/${id}`, {
    method: 'DELETE',
  })
  const json = await res.json()
  if (!res.ok || !json.success) {
    throw new Error(json.message || 'Gagal menghapus admin.')
  }
  return json
}
