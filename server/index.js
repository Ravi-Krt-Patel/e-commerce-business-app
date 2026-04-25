import crypto from 'crypto'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import Razorpay from 'razorpay'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

function getRazorpayInstance() {
  const key_id = process.env.RAZORPAY_KEY_ID
  const key_secret = process.env.RAZORPAY_KEY_SECRET
  if (!key_id || !key_secret) {
    return null
  }
  return new Razorpay({ key_id, key_secret })
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

app.get('/api/razorpay/config', (_req, res) => {
  res.json({
    keyId: process.env.RAZORPAY_KEY_ID || null,
  })
})

app.post('/api/razorpay/order', async (req, res) => {
  try {
    const instance = getRazorpayInstance()
    if (!instance) {
      return res.status(500).json({
        error: 'Missing Razorpay keys. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in server env.',
      })
    }

    const amount = Number(req.body?.amount)
    const currency = req.body?.currency || 'INR'
    const receipt = req.body?.receipt || `rcpt_${Date.now()}`

    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' })
    }

    const order = await instance.orders.create({
      amount: Math.round(amount),
      currency,
      receipt,
    })

    return res.json(order)
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to create order',
      details: error?.message || String(error),
    })
  }
})

app.post('/api/razorpay/verify', (req, res) => {
  try {
    const key_secret = process.env.RAZORPAY_KEY_SECRET
    if (!key_secret) {
      return res.status(500).json({
        error: 'Missing RAZORPAY_KEY_SECRET in server env.',
      })
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body || {}
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: 'Missing payment fields' })
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`
    const expectedSignature = crypto
      .createHmac('sha256', key_secret)
      .update(body)
      .digest('hex')

    const isValid = expectedSignature === razorpay_signature
    if (!isValid) {
      return res.status(400).json({ verified: false })
    }

    return res.json({ verified: true })
  } catch (error) {
    return res.status(500).json({
      error: 'Verification failed',
      details: error?.message || String(error),
    })
  }
})

const port = Number(process.env.PORT) || 5174
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Razorpay server listening on http://localhost:${port}`)
})

