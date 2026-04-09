'use client'

import { QRCodeSVG } from 'qrcode.react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Printer, QrCode, MessageCircleQuestion, Wrench } from 'lucide-react'

const BASE_URL = 'https://atencionst.vercel.app'

const QR_CONFIGS = [
  {
    id: 'consulta',
    label: 'Consulta',
    url: `${BASE_URL}/review?type=consulta`,
    icon: MessageCircleQuestion,
    color: '#2563eb',
    bg: '#eff6ff',
  },
  {
    id: 'reparacion',
    label: 'Reparación',
    url: `${BASE_URL}/review?type=reparacion`,
    icon: Wrench,
    color: '#7c3aed',
    bg: '#f5f3ff',
  },
]

function printQR(id: string, label: string, url: string) {
  const svgEl = document.getElementById(`qr-svg-${id}`)
  const win = window.open('', '_blank')
  if (!win || !svgEl) return
  win.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>QR ${label} — Thermomix</title>
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
          <h2>¿Cómo fue tu ${label.toLowerCase()}?</h2>
          <p>Escanea el código y déjanos tu opinión</p>
          ${svgEl.outerHTML}
          <div class="url">${url}</div>
        </div>
        <script>window.onload = () => { window.print(); window.close(); }</script>
      </body>
    </html>
  `)
  win.document.close()
}

export function QRPanel() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <QrCode className="w-4 h-4" /> Códigos QR para clientes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid sm:grid-cols-2 gap-6">
          {QR_CONFIGS.map(({ id, label, url, icon: Icon, color, bg }) => (
            <div key={id} className="flex flex-col items-center gap-3 p-4 rounded-xl border border-gray-100">
              <div className="flex items-center gap-2" style={{ color }}>
                <Icon className="w-5 h-5" />
                <span className="font-medium text-sm">{label}</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm" style={{ background: bg }}>
                <QRCodeSVG
                  id={`qr-svg-${id}`}
                  value={url}
                  size={150}
                  level="M"
                  includeMargin={false}
                  fgColor="#111111"
                />
              </div>
              <p className="text-xs text-gray-400 text-center break-all">{url}</p>
              <Button
                onClick={() => printQR(id, label, url)}
                variant="outline"
                size="sm"
                className="gap-2 w-full"
              >
                <Printer className="w-3 h-3" /> Imprimir QR de {label}
              </Button>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-4 text-center">
          El QR de Consulta va en el mostrador · El de Reparación se entrega con el equipo
        </p>
      </CardContent>
    </Card>
  )
}
