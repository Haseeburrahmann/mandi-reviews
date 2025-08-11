// app/qr-generator/page.js
import QRCodeGenerator from '../../components/QRCodeGenerator'

export const metadata = {
  title: 'QR Code Generator - Food Review System',
  description: 'Generate QR codes for your food review collection',
}

export default function QRGeneratorPage() {
  return <QRCodeGenerator />
}