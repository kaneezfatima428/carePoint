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
import PhysiotherapistPage from './pages/PhysiotherapistPage'
import PhysioCategoryPage from './pages/PhysioCategoryPage'
import PhysioListPage from './pages/PhysioListPage'
import PhysioBookingPage from './pages/PhysioBookingPage'
import UltrasoundPage from './pages/UltrasoundPage'
import UltrasoundHospitalsPage from './pages/UltrasoundHospitalsPage'
import UltrasoundBookingPage from './pages/UltrasoundBookingPage'
import DietitianPage from './pages/DietitianPage'
import DietitianCategoryPage from './pages/DietitianCategoryPage'
import DietitianBookingPage from './pages/DietitianBookingPage'
import LabTestPage from './pages/LabTestPage'
import LabTestListPage from './pages/LabTestListPage'
import LabBookingPage from './pages/LabBookingPage'
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

            <Route path="/physiotherapist" element={<PhysiotherapistPage />} />
            <Route path="/physiotherapist/:category" element={<PhysioCategoryPage />} />
            <Route path="/physiotherapist/:category/:gender" element={<PhysioListPage />} />
            <Route path="/book/physiotherapy" element={<PhysioBookingPage />} />
            <Route path="/dietitian" element={<DietitianPage />} />
            <Route path="/dietitian/:goal" element={<DietitianCategoryPage />} />
            <Route path="/dietitian/:goal/:mode" element={<DietitianBookingPage />} />
            <Route path="/ultrasound" element={<UltrasoundPage />} />
            <Route path="/ultrasound/:shift" element={<UltrasoundHospitalsPage />} />
            <Route path="/book/ultrasound" element={<UltrasoundBookingPage />} />
            <Route path="/lab-tests" element={<LabTestPage />} />
            <Route path="/lab-tests/:gender" element={<LabTestListPage />} />
            <Route path="/book/lab-test" element={<LabBookingPage />} />
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
