import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from './store/authStore'
import AuthPage from './pages/AuthPage'
import WalletPage from './pages/WalletPage'
import CreateWalletPage from './pages/CreateWalletPage'
import ImportWalletPage from './pages/ImportWalletPage'
import SendPage from './pages/SendPage'

function App() {
  const { user } = useAuthStore()

  return (
    <Router>
      <div className="min-h-screen bg-dark-900">
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1A1A1A',
              color: '#fff',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            },
            success: {
              iconTheme: {
                primary: '#00D4AA',
                secondary: '#fff',
              },
            },
          }}
        />
        <Routes>
          <Route path="/auth" element={!user ? <AuthPage /> : <Navigate to="/wallet" />} />
          <Route path="/wallet" element={user ? <WalletPage /> : <Navigate to="/auth" />} />
          <Route path="/create-wallet" element={user ? <CreateWalletPage /> : <Navigate to="/auth" />} />
          <Route path="/import-wallet" element={user ? <ImportWalletPage /> : <Navigate to="/auth" />} />
          <Route path="/send" element={user ? <SendPage /> : <Navigate to="/auth" />} />
          <Route path="/" element={<Navigate to={user ? "/wallet" : "/auth"} />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
