

import { useState } from "react";
import LoginForm from "./login-form";
import RegisterForm from "./register-form";
import ForgotPasswordForm from "./forgot-password-form";

export default function LandingPage() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-purple-800">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center">
          {/* <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7 text-purple-600"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
              clipRule="evenodd"
            />
          </svg> */}

<svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-white"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 5a1 1 0 100 2h1a2 2 0 011.732 1H7a1 1 0 100 2h2.732A2 2 0 018 11H7a1 1 0 00-.707 1.707l3 3a1 1 0 001.414-1.414l-1.483-1.484A4.008 4.008 0 0011.874 10H13a1 1 0 100-2h-1.126a3.976 3.976 0 00-.41-1H13a1 1 0 100-2H7z"
              clipRule="evenodd"
            />
          </svg>
          <h1 className="text-white text-2xl font-bold ml-2">FinTrack</h1>
        </div>
        <div className="space-x-4">
          <button
            onClick={() => {
              setShowLogin(true);
              setShowRegister(false);
              setShowForgotPassword(false);
            }}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Login
          </button>
          <button
            onClick={() => {
              setShowRegister(true);
              setShowLogin(false);
              setShowForgotPassword(false);
            }}
            className="bg-white text-purple-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            Sign Up
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Take Control of Your Finances
            </h2>
            <p className="text-xl mb-8 text-purple-100">
              Track expenses, visualize spending patterns, and achieve your
              financial goals with FinTrack.
            </p>
            <div className="space-y-6 mb-8">
              <div className="flex items-start">
                <div className="bg-white bg-opacity-20 p-2 rounded-full mr-4 mt-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">
                    Smart Expense Tracking
                  </h3>
                  <p className="text-purple-100">
                    Categorize and track your expenses with beautiful
                    visualizations
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-white bg-opacity-20 p-2 rounded-full mr-4 mt-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">
                    Budget Management
                  </h3>
                  <p className="text-purple-100">
                    Set budgets for different categories and track your progress
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-white bg-opacity-20 p-2 rounded-full mr-4 mt-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-white"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">
                    Insightful Reports
                  </h3>
                  <p className="text-purple-100">
                    Get detailed insights about your spending habits and savings
                    opportunities
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                setShowRegister(true);
                setShowLogin(false);
                setShowForgotPassword(false);
              }}
              className="bg-white text-purple-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors shadow-lg"
            >
              Get Started — It's Free
            </button>
          </div>

          <div className="hidden md:block relative">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-400 rounded-full opacity-30 animate-blob"></div>
            <div className="absolute top-20 right-10 w-40 h-40 bg-purple-300 rounded-full opacity-30 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-10 left-20 w-40 h-40 bg-purple-200 rounded-full opacity-30 animate-blob animation-delay-4000"></div>
            <div className="bg-white p-6 rounded-2xl shadow-2xl relative z-10 transform rotate-2">
              <div className="bg-gradient-to-br from-purple-500 to-purple-700 text-white p-4 rounded-xl mb-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold">Monthly Overview</h3>
                  <span className="text-sm">April 2025</span>
                </div>
                <div className="text-3xl font-bold mb-2">₹ 3,240.50</div>
                <div className="h-24 flex items-end space-x-2">
                  <div className="w-1/6 bg-white bg-opacity-20 rounded-t-md h-1/3"></div>
                  <div className="w-1/6 bg-white bg-opacity-20 rounded-t-md h-1/2"></div>
                  <div className="w-1/6 bg-white bg-opacity-20 rounded-t-md h-3/4"></div>
                  <div className="w-1/6 bg-white bg-opacity-20 rounded-t-md h-full"></div>
                  <div className="w-1/6 bg-white bg-opacity-20 rounded-t-md h-2/3"></div>
                  <div className="w-1/6 bg-white bg-opacity-20 rounded-t-md h-1/2"></div>
                </div>
              </div>
             
              
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="bg-purple-100 p-2 rounded-md mr-3">🏠</div>
                    <div>
                      <div className="font-medium">Housing</div>
                      <div className="text-xs text-gray-500">Monthly rent</div>
                    </div>
                  </div>
                  <div className="font-bold">₹ 1,200</div>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="bg-purple-100 p-2 rounded-md mr-3">🛒</div>
                    <div>
                      <div className="font-medium">Groceries</div>
                      <div className="text-xs text-gray-500">
                        Weekly shopping
                      </div>
                    </div>
                  </div>
                  <div className="font-bold">₹ 120</div>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="bg-purple-100 p-2 rounded-md mr-3">🍽️</div>
                    <div>
                      <div className="font-medium">Dining</div>
                      <div className="text-xs text-gray-500">
                        Dinner with friends
                      </div>
                    </div>
                  </div>
                  <div className="font-bold">₹ 45</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Login/Register */}
      {(showLogin || showRegister || showForgotPassword) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative">
            <button
              onClick={() => {
                setShowLogin(false);
                setShowRegister(false);
                setShowForgotPassword(false);
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {showLogin && (
              <LoginForm
                onSwitch={(target) => {
                  if (target === "forgot-password") {
                    setShowLogin(false);
                    setShowForgotPassword(true);
                  } else {
                    setShowLogin(false);
                    setShowRegister(true);
                  }
                }}
              />
            )}
            {showRegister && (
              <RegisterForm
                onSwitch={() => {
                  setShowRegister(false);
                  setShowLogin(true);
                }}
              />
            )}
            {showForgotPassword && (
              <ForgotPasswordForm
                onSwitch={() => {
                  setShowForgotPassword(false);
                  setShowLogin(true);
                }}
                onClose={() => {
                  setShowForgotPassword(false);
                }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
