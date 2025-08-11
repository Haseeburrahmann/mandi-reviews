// app/page.js
import { redirect } from 'next/navigation'

export default function HomePage() {
  // Automatically redirect to review page
  redirect('/review')
}