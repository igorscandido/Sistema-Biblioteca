import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import NavBar from './components/NavBar'

import Categorias from './pages/Categorias'
import Livros from './pages/Livros'
import Usuarios from './pages/Usuarios'
import Emprestimos from './pages/Emprestimos'

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/categorias" element={<Categorias />} />
        <Route path="/livros" element={<Livros />} />
        <Route path="/usuarios" element={<Usuarios />} />
        <Route path="/emprestimos" element={<Emprestimos />} />
        <Route path="/" element={<h1>Sistema de biblioteca</h1>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
