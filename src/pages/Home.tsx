import Nav from '../components/Nav'
import Hero from '../components/Hero'
import Services from '../components/Services'
import HowItWorks from '../components/HowItWorks'
import SelectedWork from '../components/SelectedWork'
import Impact from '../components/Impact'
import Coverage from '../components/Coverage'
import NewsSection from '../components/NewsSection'
import Contact from '../components/Contact'
import Newsletter from '../components/Newsletter'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Services />
        <HowItWorks />
        <SelectedWork />
        <Impact />
        <Coverage />
        <NewsSection />
        <Contact />
        <Newsletter />
      </main>
      <Footer />
    </>
  )
}
