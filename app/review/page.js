// app/review/page.js
import ReviewForm from '../../components/ReviewForm'

export const metadata = {
  title: 'Rate Your Mandi Experience',
  description: 'Share your feedback about our delicious mandi',
  viewport: 'width=device-width, initial-scale=1',
}

export default function ReviewPage() {
  return <ReviewForm />
}