'use client'

import { QRCodeSVG } from 'qrcode.react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Printer, QrCode } from 'lucide-react'

const REVIEW_URL = 'https://atencionst.vercel.app/review'

export function QRPanel() {
  const handlePrint = () => {
    const win = window.open('', '_blank')
    if (!win) return
    win.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>QR Reseñas — Thermomix</title>
          <style>
            body { margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; font-family: sans-serif; background: white; }
            .container { text-align: center; padding: 40px; }
            h2 { font-size: 22px; color: #111; margin-bottom: 4px; }
            p { font-size: 14px; color: #555; margin-bottom: 24px; }
            svg { width: 220px; height: 220px; }
            .url { font-size: 11px; color: #999; margin-top: 16px; }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>¿Cómo fue tu experiencia?</h2>
            <p>Escanea el código y déjanos tu opinión</p>
            ${document.getElementById('qr-svg')?.outerHTML ?? ''}
            <div class="url">${REVIEW_URL}</div>
          </div>
          <script>window.onload = () => { window.print(); window.close(); }</script>
        </body>
      </html>
    `)
    win.document.close()
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <QrCode className="w-4 h-4" /> Código QR para clientes
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col sm:flex-row items-center gap-6">
        <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
          <QRCodeSVG
            id="qr-svg"
            value={REVIEW_URL}
            size={160}
            level="M"
            includeMargin={false}
            fgColor="#111111"
          />
        </div>
        <div className="space-y-3 text-center sm:text-left">
          <div>
            <p className="text-sm font-medium text-gray-800">Formulario de reseñas</p>
            <p className="text-xs text-gray-500 break-all">{REVIEW_URL}</p>
          </div>
          <p className="text-xs text-gray-400">
            Imprime este QR y colócalo en el mostrador o en el recibo de entrega. El cliente lo escanea y deja su reseña en segundos.
          </p>
          <Button onClick={handlePrint} variant="outline" size="sm" className="gap-2">
            <Printer className="w-4 h-4" /> Imprimir QR
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
