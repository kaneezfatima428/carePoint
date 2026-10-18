import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import DoctorPage from './pages/DoctorPage'
import HomeDoctorPage from './pages/HomeDoctorPage'
import MaleDoctorsPage from './pages/MaleDoctorsPage'
import FemaleDoctorsPage from './pages/FemaleDoctorsPage'
import GeneralDoctorPage from './pages/GeneralDoctorPage'
import EmergencyDoctorPage from './pages/EmergencyDoctorPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import BookingPage from './pages/BookingPage'
import LoginPage from './pages/LoginPage'
import NotFoundPage from './pages/NotFoundPage'
import PatientDashboard from './pages/PatientDashboard'
import DoctorDashboard from './pages/DoctorDashboard'

// Routes ke andar:

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/dashboard" element={<PatientDashboard />} />
            <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
            <Route path="/book/:type" element={<BookingPage />} />
            <Route path="/not-found" element={<NotFoundPage />} />
            <Route path="*" element={<NotFoundPage />} />
            {/* Doctor nested routes */}
            <Route path="/doctor" element={<DoctorPage />} />
            <Route path="/doctor/general" element={<GeneralDoctorPage />} />
            <Route path="/doctor/emergency" element={<EmergencyDoctorPage />} />
            <Route path="/doctor/home" element={<HomeDoctorPage />} />
            <Route path="/doctor/home/male" element={<MaleDoctorsPage />} />
            <Route path="/doctor/home/female" element={<FemaleDoctorsPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
