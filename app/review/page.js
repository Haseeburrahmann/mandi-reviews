// app/review/page.js
import ReviewForm from '@/components/ReviewForm'

export const metadata = {
  title: 'Rate Your Food Experience',
  description: 'Share your feedback about our delicious food',
  viewport: 'width=device-width, initial-scale=1',
}

export default function ReviewPage() {
  return <ReviewForm />
}