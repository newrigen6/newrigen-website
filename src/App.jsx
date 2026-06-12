import { createContext, useContext } from 'react'
import { useEditMode } from './hooks/useEditMode'
import EditBar from './components/EditBar'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Services from './components/Services'
import ComparisonGrid from './components/ComparisonGrid'
import HowItWorks from './components/HowItWorks'
import Testimonials from './components/Testimonials'
import CTASection from './components/CTASection'
import Footer from './components/Footer'

// Context global pour le mode édition — accessible dans tous les composants
export const EditContext = createContext(false)
export function useEdit() { return useContext(EditContext) }

export default function App() {
  const { editMode, setEditMode } = useEditMode()

  return (
    <EditContext.Provider value={editMode}>
      <div className="min-h-screen bg-[#0A0A0F] text-white">
        <Navbar />
        <main>
          <Hero />
          <Services />
          <ComparisonGrid />
          <HowItWorks />
          <Testimonials />
          <CTASection />
        </main>
        <Footer />

        {/* Barre d'édition flottante */}
        <EditBar editMode={editMode} setEditMode={setEditMode} />
      </div>
    </EditContext.Provider>
  )
}


