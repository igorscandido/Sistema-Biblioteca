import { useEffect, useState } from 'react'
import axios from 'axios'
import './Categorias.css'

function Categorias() {
  const [categorias, setCategorias] = useState([])
  const [nome, setNome] = useState('')
  const [editId, setEditId] = useState(null)
  const [editNome, setEditNome] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const clearMessages = () => {
    setTimeout(() => {
      setError('')
      setSuccess('')
    }, 3000)
  }

  const fetchCategorias = async () => {
    setLoading(true)
    try {
      const { data } = await axios.get('http://localhost:3000/categorias')
      setCategorias(data)
      setError('')
    } catch (err) {
      setError('Erro ao buscar categorias')
      clearMessages()
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchCategorias()
  }, [])

  const validateNome = (value) => {
    if (!value.trim()) return 'O nome é obrigatório.'
    if (value.trim().length < 3) return 'O nome deve ter pelo menos 3 letras.'
    return ''
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    const validation = validateNome(nome)
    if (validation) {
      setError(validation)
      clearMessages()
      return
    }
    try {
      await axios.post('http://localhost:3000/categorias', { nome })
      setNome('')
      setSuccess('Categoria adicionada com sucesso!')
      fetchCategorias()
      clearMessages()
    } catch {
      setError('Erro ao adicionar categoria')
      clearMessages()
    }
  }

  const handleEdit = (cat) => {
    setEditId(cat.id)
    setEditNome(cat.nome)
    setError('')
    setSuccess('')
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    const validation = validateNome(editNome)
    if (validation) {
      setError(validation)
      clearMessages()
      return
    }
    try {
      await axios.put(`http://localhost:3000/categorias/${editId}`, { nome: editNome })
      setEditId(null)
      setEditNome('')
      setSuccess('Categoria atualizada com sucesso!')
      fetchCategorias()
      clearMessages()
    } catch {
      setError('Erro ao atualizar categoria')
      clearMessages()
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Remover categoria?')) return
    try {
      await axios.delete(`http://localhost:3000/categorias/${id}`)
      setSuccess('Categoria removida com sucesso!')
      fetchCategorias()
      clearMessages()
    } catch {
      setError('Erro ao remover categoria')
      clearMessages()
    }
  }

  return (
    <div className="categorias-container">
      <h2>Categorias</h2>
      <form className="categorias-form" onSubmit={editId ? handleUpdate : handleAdd}>
        <input
          type="text"
          placeholder="Nome da categoria"
          value={editId ? editNome : nome}
          onChange={e => editId ? setEditNome(e.target.value) : setNome(e.target.value)}
        />
        <button type="submit">{editId ? 'Atualizar' : 'Adicionar'}</button>
        {editId && <button type="button" onClick={() => { setEditId(null); setEditNome('') }}>Cancelar</button>}
      </form>
      {loading ? <p>Carregando...</p> : null}
      {error && <p className="categorias-error msg-error">{error}</p>}
      {success && <p className="categorias-success msg-success">{success}</p>}
      <table className="categorias-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {categorias.map(cat => (
            <tr key={cat.id}>
              <td>{cat.id}</td>
              <td>{cat.nome}</td>
              <td>
                <button onClick={() => handleEdit(cat)}>Editar</button>
                <button onClick={() => handleDelete(cat.id)}>Remover</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Categorias