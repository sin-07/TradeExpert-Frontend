import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { Mail, ArrowLeft } from 'lucide-react'
import api from '../utils/api'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function VerifyOTP(){
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const email = location.state?.email

  useEffect(() => {
    if (!email) {
      toast.error('No email provided')
      navigate('/signup')
    }
  }, [email, navigate])

  const handleOtpChange = (index, value) => {
    if (value.length > 1) value = value[0]
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').slice(0, 6)
    if (!/^\d+$/.test(pastedData)) return

    const newOtp = pastedData.split('')
    while (newOtp.length < 6) newOtp.push('')
    setOtp(newOtp)
    
    if (pastedData.length === 6) {
      document.getElementById('otp-5')?.focus()
    }
  }

  const submit = async (e) => {
    e.preventDefault()
    const otpString = otp.join('')
    
    if (otpString.length !== 6) {
      toast.error('Please enter complete OTP')
      return
    }

    setLoading(true)
    const loadingToast = toast.loading('Verifying OTP...')

    try {
      await api.verifyOTP(email, otpString)
      toast.success('Email verified successfully!', { id: loadingToast })
      navigate('/login')
    } catch (err) {
      toast.error(err.message || 'Invalid OTP', { id: loadingToast })
    } finally {
      setLoading(false)
    }
  }

  const handleResendOTP = async () => {
    setResending(true)
    const loadingToast = toast.loading('Resending OTP...')

    try {
      await api.resendOTP(email)
      toast.success('OTP sent successfully!', { id: loadingToast })
      setOtp(['', '', '', '', '', ''])
      document.getElementById('otp-0')?.focus()
    } catch (err) {
      toast.error(err.message || 'Failed to resend OTP', { id: loadingToast })
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <Navbar logged={false} setLogged={()=>{}} />
      <main className="flex-1 container mx-auto px-6 py-12 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Verify Your Email</h2>
              <p className="text-slate-600">
                We've sent a 6-digit code to<br />
                <span className="font-semibold text-slate-900">{email}</span>
              </p>
            </div>
            
            <form onSubmit={submit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3 text-center">
                  Enter OTP Code
                </label>
                <div className="flex gap-2 justify-center">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={handlePaste}
                      className="w-12 h-14 text-center text-2xl font-bold rounded-lg border-2 border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    />
                  ))}
                </div>
                <p className="text-xs text-slate-500 mt-3 text-center">
                  Code expires in 10 minutes
                </p>
              </div>
              
              <button 
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? 'Verifying...' : 'Verify Email'}
              </button>
            </form>
            
            <div className="mt-6 text-center space-y-3">
              <button
                onClick={handleResendOTP}
                disabled={resending}
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium disabled:opacity-50"
              >
                {resending ? 'Sending...' : 'Didn\'t receive code? Resend OTP'}
              </button>
              
              <button
                onClick={() => navigate('/signup')}
                className="flex items-center justify-center gap-2 text-sm text-slate-600 hover:text-slate-900 mx-auto"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Signup
              </button>
            </div>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  )
}
