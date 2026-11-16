import { Link } from 'react-router-dom'
export default function NotFound() {
  return (
    <div className="wrap py-24 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-2 text-4xl font-bold">Бет табылмады</h1>
      <p className="mt-3 text-ink-700">Сілтеме дұрыс емес немесе бет жойылған.</p>
      <Link to="/" className="btn btn-primary mt-6">Басты бетке</Link>
    </div>
  )
}
