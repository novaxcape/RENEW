import { useLayoutEffect } from 'react'
import KycHeader from '../components/KycHeader'
import KycForm from '../components/KycForm'
import Footer from '../components/Footer'

const KycPage = () => {
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  return (
    <div>
      <KycHeader />
      <KycForm />
      <Footer />

    </div>
  )
}

export default KycPage
