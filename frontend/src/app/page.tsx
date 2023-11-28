import Image from 'next/image'
import Link from 'next/link'
import './static/index.css';

export default function Home() {
  return (


      <main>
        <h1>Welcome home!</h1>
        {/* always use link, not href because the network is faster */}
        <Link href="/documents">documents</Link>
      </main>

  )
}
