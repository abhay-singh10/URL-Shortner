import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../store/slice/authSlice'
import { logoutUser } from '../api/user.api'
import { queryClient } from '../main'

// ...existing code...
const Navbar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useSelector((s) => s.auth)
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)

  const handleLogout = async () => {
    try { await logoutUser() } catch {}
    dispatch(logout())
    queryClient.removeQueries({ queryKey: ['userUrls'] })
    setOpen(false)
    navigate({ to: '/' })
  }

  // Close on outside click or Esc
  useEffect(() => {
    const onDocClick = (e) => {
      if (open && menuRef.current && !menuRef.current.contains(e.target)) setOpen(false)
    }
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <nav className="bg-white border border-b-black">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-gray-800 hover:text-blue-600 transition">
              URLMon
            </Link>
          </div>

          {!isAuthenticated ? (
            <div className="flex items-center">
              <Link
                to="/auth"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium cursor-pointer transition"
              >
                Login
              </Link>
            </div>
          ) : (
            // Note: no onMouseEnter/Leave here; open only toggles on click
            <div ref={menuRef} className="relative">
              <button
                onClick={() => setOpen(v => !v)}
                className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 cursor-pointer transition"
              >
                <span>{user?.name || user?.email || 'Account'}</span>
                <svg className={`w-4 h-4 transition ${open ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
                </svg>
              </button>

              {open && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-20">
                  <Link
                    to="/dashboard"
                    onClick={() => setOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-700 cursor-pointer transition"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer transition"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar;