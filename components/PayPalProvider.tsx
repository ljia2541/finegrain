'use client'

import { PayPalScriptProvider } from '@paypal/react-paypal-js'

const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || ''

export default function PayPalProvider({ children }: { children: React.ReactNode }) {
  return (
    <PayPalScriptProvider
      options={{
        clientId,
        currency: 'USD',
        intent: 'capture',
        vault: false,
      }}
    >
      {children}
    </PayPalScriptProvider>
  )
}
