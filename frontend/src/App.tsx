import { BrowserRouter } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import AppRoutes from './routes/AppRoutes'

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
      <MainLayout />
    </BrowserRouter>
  )
}

export default App
