"use client"

import { useState } from "react"
import { useAuth } from "../context/auth-context"

export default function RegisterForm({ onSwitch }) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      // Validate form
      if (!name || !email || !password || !confirmPassword) {
        throw new Error("Please fill in all fields")
      }

      if (password !== confirmPassword) {
        throw new Error("Passwords do not match")
      }

      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters")
      }

      // Register user
      const result = register(name, email, password, false) // Pass false to prevent auto-login

      if (!result.success) {
        throw new Error(result.message || "Registration failed")
      }

      // Show success message and redirect to login after delay
      setSuccess("Registration successful! You can now log in with your credentials.")
      setTimeout(() => {
        onSwitch()
      }, 3000)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Create Your Account</h2>

      {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">{error}</div>}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg mb-4">{success}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
            placeholder="firstname lastname"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
            placeholder="••••••••"
          />
        </div>

        <div>
          <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
            placeholder="••••••••"
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={loading || success}
            className="w-full bg-gradient-to-r from-purple-500 to-purple-700 text-white py-2 px-4 rounded-lg hover:from-purple-600 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </div>

        <div className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <button type="button" onClick={onSwitch} className="text-purple-600 hover:text-purple-500 font-medium">
            Sign in
          </button>
        </div>
      </form>
    </div>
  )
}
