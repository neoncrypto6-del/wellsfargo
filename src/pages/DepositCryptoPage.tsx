import React, { useState } from 'react'
import { useAuth } from '../lib/auth'
import { supabase, CRYPTO_WALLETS } from '../lib/supabase'
import { DashboardLayout } from '../components/DashboardLayout'
import { XIcon, CopyIcon, CheckIcon, UploadIcon } from 'lucide-react'

/* ✅ FIXED QR MAP (matches your EXACT filenames) */
const QR_MAP: Record<string, string> = {
  'Bitcoin (BTC)': '/qrcode/bitcoin.JPG',
  'Ethereum (ETH)': '/qrcode/ethereun.JPG',
  'Solana (SOL)': '/qrcode/solana.JPG',
  'BNB Smart Chain': '/qrcode/bnd.JPG',
  'USDT (ERC20)': '/qrcode/usdt.JPG',
  'USDC (ERC20)': '/qrcode/usdc.JPG',
  'Dogecoin (DOGE)': '/qrcode/dogecoin.JPG',
  'Tron (TRX)': '/qrcode/tron.JPG',
  XRP: '/qrcode/xrp.JPG',
  'Litecoin (LTC)': '/qrcode/litecoin.JPG',
}

export function DepositCryptoPage() {
  const { user } = useAuth()
  const [selectedCrypto, setSelectedCrypto] = useState<string | null>(null)
  const [amount, setAmount] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const cryptoList = Object.entries(CRYPTO_WALLETS)

  function copyWallet() {
    if (!selectedCrypto) return
    navigator.clipboard.writeText(CRYPTO_WALLETS[selectedCrypto].wallet)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleSubmit() {
    if (!selectedCrypto || !amount || !file) {
      setError('Please fill in all fields and upload proof.')
      return
    }

    setLoading(true)
    setError('')

    let proofUrl = ''
    const path = `deposit-proofs/${user!.id}/${Date.now()}-${file.name}`

    const { error: uploadError } = await supabase.storage
      .from('uploads')
      .upload(path, file)

    if (!uploadError) {
      proofUrl = supabase.storage.from('uploads').getPublicUrl(path)
        .data.publicUrl
    }

    const { error: insertError } = await supabase
      .from('deposit_requests')
      .insert({
        user_id: user!.id,
        deposit_type: 'crypto',
        crypto_type: selectedCrypto,
        amount: parseFloat(amount),
        proof_image_url: proofUrl,
        status: 'pending_review',
      })

    if (!insertError) {
      await supabase.from('transactions').insert({
        user_id: user!.id,
        type: 'deposit',
        description: `Deposit of $${amount} via Crypto submitted`,
        amount: parseFloat(amount),
        status: 'pending',
        reference: 'DEP' + Date.now().toString(36).toUpperCase(),
      })
    }

    setLoading(false)

    if (insertError) {
      setError(insertError.message)
      return
    }

    setSuccess(true)
    setSelectedCrypto(null)
    setAmount('')
    setFile(null)
  }

  return (
    <DashboardLayout showBackToDashboard title="Deposit Cryptocurrency">
      <div className="max-w-2xl">
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 text-sm">
            Deposit request submitted successfully! It will be reviewed shortly.
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-6">
          {cryptoList.map(([key, info]) => (
            <button
              key={key}
              onClick={() => {
                setSelectedCrypto(key)
                setSuccess(false)
              }}
              className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                selectedCrypto === key
                  ? 'border-[#D71E28] bg-red-50 text-[#D71E28]'
                  : 'border-gray-200 bg-white text-[#2D2D2D] hover:border-gray-300'
              }`}
            >
              {info.name}
            </button>
          ))}
        </div>

        {selectedCrypto && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={() => setSelectedCrypto(null)}
          >
            <div
              className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-[#2D2D2D]">
                  Deposit {selectedCrypto}
                </h3>
                <button
                  onClick={() => setSelectedCrypto(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Wallet Address */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-[#2D2D2D] mb-1">
                  Wallet Address
                </label>
                <div className="flex items-center gap-2 bg-[#F5F5F5] rounded-lg p-3">
                  <p className="text-xs font-mono text-[#2D2D2D] break-all flex-1">
                    {CRYPTO_WALLETS[selectedCrypto].wallet}
                  </p>
                  <button
                    onClick={copyWallet}
                    className="flex-shrink-0 text-gray-400 hover:text-[#D71E28]"
                  >
                    {copied ? (
                      <CheckIcon className="w-4 h-4 text-green-500" />
                    ) : (
                      <CopyIcon className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* ✅ QR CODE (FIXED) */}
              <div className="flex justify-center mb-4">
                <div className="w-40 h-40 bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center">
                  <img
                    src={QR_MAP[selectedCrypto]}
                    alt={`QR Code for ${selectedCrypto}`}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                      target.parentElement!.innerHTML = `<span class="text-xs text-gray-400 text-center px-4">QR Code not found</span>`
                    }}
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-[#D71E28] px-4 py-3 rounded-lg mb-4 text-sm">
                  {error}
                </div>
              )}

              <div className="mb-4">
                <label className="block text-sm font-medium text-[#2D2D2D] mb-1">
                  Amount (USD) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#D71E28]"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-[#2D2D2D] mb-1">
                  Upload Transaction Receipt *
                </label>
                <label className="flex items-center gap-2 border border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-[#D71E28] transition-colors">
                  <UploadIcon className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-[#666]">
                    {file ? file.name : 'Choose file...'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                </label>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-[#D71E28] text-white py-3 rounded-full font-semibold hover:bg-[#B21B1C] transition-colors disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit for Review'}
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
