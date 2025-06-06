import { useEffect, useState } from 'react'
import axios from 'axios'
import './Usuarios.css'

function Usuarios() {
  const [usuarios, setUsuarios] = useState([])
  const [form, setForm] = useState({ nome: '', email: '' })
  const [editId, setEditId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const clearMessages = () => {
    setTimeout(() => {
      setError('')
      setSuccess('')
    }, 3000)
  }

  const fetchUsuarios = async () => {
    setLoading(true)
    try {
      const { data } = await axios.get('http://localhost:3000/usuarios')
      setUsuarios(data)
      setError('')
    } catch (err) {
      setError('Erro ao buscar usuários')
      clearMessages()
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchUsuarios()
  }, [])

  const validateForm = (f) => {
    if (!f.nome.trim() || f.nome.trim().length < 3) return 'Nome obrigatório (mín. 3 letras)'
    if (!f.email.trim()) return 'Email obrigatório'
    // Regex simples para email
    if (!/^\S+@\S+\.\S+$/.test(f.email)) return 'Email inválido'
    return ''
  }

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    const validation = validateForm(form)
    if (validation) {
      setError(validation)
      clearMessages()
      return
    }
    try {
      await axios.post('http://localhost:3000/usuarios', form)
      setForm({ nome: '', email: '' })
      setSuccess('Usuário adicionado com sucesso!')
      fetchUsuarios()
      clearMessages()
    } catch {
      setError('Erro ao adicionar usuário')
      clearMessages()
    }
  }

  const handleEdit = (usuario) => {
    setEditId(usuario.id)
    setForm({ nome: usuario.nome, email: usuario.email })
    setError('')
    setSuccess('')
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    const validation = validateForm(form)
    if (validation) {
      setError(validation)
      clearMessages()
      return
    }
    try {
      await axios.put(`http://localhost:3000/usuarios/${editId}`, form)
      setEditId(null)
      setForm({ nome: '', email: '' })
      setSuccess('Usuário atualizado com sucesso!')
      fetchUsuarios()
      clearMessages()
    } catch {
      setError('Erro ao atualizar usuário')
      clearMessages()
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Remover usuário?')) return
    try {
      await axios.delete(`http://localhost:3000/usuarios/${id}`)
      setSuccess('Usuário removido com sucesso!')
      fetchUsuarios()
      clearMessages()
    } catch {
      setError('Erro ao remover usuário')
      clearMessages()
    }
  }

  return (
    <div className="usuarios-container">
      <h2>Usuários</h2>
      <form className="usuarios-form" onSubmit={editId ? handleUpdate : handleAdd}>
        <input name="nome" placeholder="Nome" value={form.nome} onChange={handleChange} />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
        <button type="submit">{editId ? 'Atualizar' : 'Adicionar'}</button>
        {editId && <button type="button" onClick={() => { setEditId(null); setForm({ nome: '', email: '' }) }}>Cancelar</button>}
      </form>
      {loading ? <p>Carregando...</p> : null}
      {error && <p className="usuarios-error msg-error">{error}</p>}
      {success && <p className="usuarios-success msg-success">{success}</p>}
      <table className="usuarios-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map(usuario => (
            <tr key={usuario.id}>
              <td>{usuario.id}</td>
              <td>{usuario.nome}</td>
              <td>{usuario.email}</td>
              <td>
                <button onClick={() => handleEdit(usuario)}>Editar</button>
                <button onClick={() => handleDelete(usuario.id)}>Remover</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Usuarios