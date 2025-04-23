"use client"

import { useState } from "react"
import { useAuth } from "../context/auth-context"

export default function ForgotPasswordForm({ onSwitch, onClose }) {
  const [email, setEmail] = useState("")
  const [resetCode, setResetCode] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [step, setStep] = useState(1) // 1: Email, 2: Code, 3: New Password
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const { requestPasswordReset, verifyResetCode, resetPassword } = useAuth()

  const handleRequestReset = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (!email) {
        throw new Error("Please enter your email address")
      }

      const result = requestPasswordReset(email)

      if (!result.success) {
        throw new Error(result.message || "Failed to send reset code")
      }

      setSuccess("Reset code sent to your email. Please check your inbox.")
      setStep(2)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyCode = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (!resetCode) {
        throw new Error("Please enter the reset code")
      }

      const result = verifyResetCode(email, resetCode)

      if (!result.success) {
        throw new Error(result.message || "Invalid reset code")
      }

      setSuccess("Code verified. Please set a new password.")
      setStep(3)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (!newPassword || !confirmPassword) {
        throw new Error("Please fill in all fields")
      }

      if (newPassword !== confirmPassword) {
        throw new Error("Passwords do not match")
      }

      if (newPassword.length < 6) {
        throw new Error("Password must be at least 6 characters")
      }

      const result = resetPassword(email, resetCode, newPassword)

      if (!result.success) {
        throw new Error(result.message || "Failed to reset password")
      }

      setSuccess("Password reset successful! You can now login with your new password.")
      setTimeout(() => {
        onSwitch && onSwitch()
      }, 3000)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Reset Your Password</h2>

      {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">{error}</div>}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg mb-4">{success}</div>
      )}

      {step === 1 && (
        <form onSubmit={handleRequestReset} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
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
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 to-purple-700 text-white py-2 px-4 rounded-lg hover:from-purple-600 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sending..." : "Send Reset Code"}
            </button>
          </div>

          <div className="text-center text-sm text-gray-500">
            Remember your password?{" "}
            <button type="button" onClick={onSwitch} className="text-purple-600 hover:text-purple-500 font-medium">
              Sign in
            </button>
          </div>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleVerifyCode} className="space-y-4">
          <div>
            <label htmlFor="resetCode" className="block text-sm font-medium text-gray-700 mb-1">
              Reset Code
            </label>
            <input
              id="resetCode"
              type="text"
              value={resetCode}
              onChange={(e) => setResetCode(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
              placeholder="Enter the 6-digit code"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 to-purple-700 text-white py-2 px-4 rounded-lg hover:from-purple-600 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Verifying..." : "Verify Code"}
            </button>
          </div>

          <div className="text-center text-sm text-gray-500">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-purple-600 hover:text-purple-500 font-medium"
            >
              Back to Email
            </button>
          </div>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
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
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 to-purple-700 text-white py-2 px-4 rounded-lg hover:from-purple-600 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </div>

          <div className="text-center text-sm text-gray-500">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="text-purple-600 hover:text-purple-500 font-medium"
            >
              Back to Code Verification
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
