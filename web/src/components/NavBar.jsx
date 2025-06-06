import { Link } from 'react-router-dom'
import './NavBar.css'

function NavBar() {
  return (
    <nav className="navbar">
      <Link to="/categorias">Categorias</Link>
      <Link to="/livros">Livros</Link>
      <Link to="/usuarios">Usuários</Link>
      <Link to="/emprestimos">Empréstimos</Link>
    </nav>
  )
}

export default NavBar 