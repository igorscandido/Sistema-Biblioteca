import { useEffect, useState } from 'react'
import axios from 'axios'
import './Emprestimos.css'

function Emprestimos() {
  const [emprestimos, setEmprestimos] = useState([])
  const [livros, setLivros] = useState([])
  const [usuarios, setUsuarios] = useState([])
  const [form, setForm] = useState({ livro_id: '', usuario_id: '', data_emprestimo: '', data_devolucao: '', status: 'pendente' })
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

  const fetchEmprestimos = async () => {
    setLoading(true)
    try {
      const { data } = await axios.get('http://localhost:3000/emprestimos')
      setEmprestimos(data)
      setError('')
    } catch (err) {
      setError('Erro ao buscar empréstimos')
      clearMessages()
    }
    setLoading(false)
  }

  const fetchLivros = async () => {
    try {
      const { data } = await axios.get('http://localhost:3000/livros')
      setLivros(data)
    } catch {}
  }

  const fetchUsuarios = async () => {
    try {
      const { data } = await axios.get('http://localhost:3000/usuarios')
      setUsuarios(data)
    } catch {}
  }

  useEffect(() => {
    fetchEmprestimos()
    fetchLivros()
    fetchUsuarios()
  }, [])

  const validateForm = (f) => {
    if (!f.livro_id) return 'Selecione um livro'
    if (!f.usuario_id) return 'Selecione um usuário'
    if (!f.data_emprestimo) return 'Data de empréstimo obrigatória'
    // data_devolucao pode ser vazia (em aberto)
    return ''
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    return dateStr.slice(0, 10)
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
      await axios.post('http://localhost:3000/emprestimos', { ...form, livro_id: Number(form.livro_id), usuario_id: Number(form.usuario_id) })
      setForm({ livro_id: '', usuario_id: '', data_emprestimo: '', data_devolucao: '', status: 'pendente' })
      setSuccess('Empréstimo adicionado com sucesso!')
      fetchEmprestimos()
      clearMessages()
    } catch {
      setError('Erro ao adicionar empréstimo')
      clearMessages()
    }
  }

  const handleEdit = (emp) => {
    setEditId(emp.id)
    setForm({
      livro_id: emp.livro_id,
      usuario_id: emp.usuario_id,
      data_emprestimo: formatDate(emp.data_emprestimo),
      data_devolucao: formatDate(emp.data_devolucao),
      status: emp.status
    })
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
      await axios.put(`http://localhost:3000/emprestimos/${editId}`, { ...form, livro_id: Number(form.livro_id), usuario_id: Number(form.usuario_id) })
      setEditId(null)
      setForm({ livro_id: '', usuario_id: '', data_emprestimo: '', data_devolucao: '', status: 'pendente' })
      setSuccess('Empréstimo atualizado com sucesso!')
      fetchEmprestimos()
      clearMessages()
    } catch {
      setError('Erro ao atualizar empréstimo')
      clearMessages()
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Remover empréstimo?')) return
    try {
      await axios.delete(`http://localhost:3000/emprestimos/${id}`)
      setSuccess('Empréstimo removido com sucesso!')
      fetchEmprestimos()
      clearMessages()
    } catch {
      setError('Erro ao remover empréstimo')
      clearMessages()
    }
  }

  return (
    <div className="emprestimos-container">
      <h2>Empréstimos</h2>
      <form className="emprestimos-form" onSubmit={editId ? handleUpdate : handleAdd}>
        <select name="livro_id" value={form.livro_id} onChange={handleChange}>
          <option value="">Livro</option>
          {livros.map(l => <option key={l.id} value={l.id}>{l.titulo}</option>)}
        </select>
        <select name="usuario_id" value={form.usuario_id} onChange={handleChange}>
          <option value="">Usuário</option>
          {usuarios.map(u => <option key={u.id} value={u.id}>{u.nome}</option>)}
        </select>
        <input name="data_emprestimo" type="date" value={form.data_emprestimo} onChange={handleChange} />
        <input name="data_devolucao" type="date" value={form.data_devolucao} onChange={handleChange} />
        <select name="status" value={form.status} onChange={handleChange}>
          <option value="pendente">Pendente</option>
          <option value="devolvido">Devolvido</option>
        </select>
        <button type="submit">{editId ? 'Atualizar' : 'Adicionar'}</button>
        {editId && <button type="button" onClick={() => { setEditId(null); setForm({ livro_id: '', usuario_id: '', data_emprestimo: '', data_devolucao: '', status: 'pendente' }) }}>Cancelar</button>}
      </form>
      {loading ? <p>Carregando...</p> : null}
      {error && <p className="emprestimos-error msg-error">{error}</p>}
      {success && <p className="emprestimos-success msg-success">{success}</p>}
      <table className="emprestimos-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Livro</th>
            <th>Usuário</th>
            <th>Data Empréstimo</th>
            <th>Data Devolução</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {emprestimos.map(emp => (
            <tr key={emp.id}>
              <td>{emp.id}</td>
              <td>{livros.find(l => l.id === emp.livro_id)?.titulo || '-'}</td>
              <td>{usuarios.find(u => u.id === emp.usuario_id)?.nome || '-'}</td>
              <td>{emp.data_emprestimo}</td>
              <td>{emp.data_devolucao || '-'}</td>
              <td>{emp.status}</td>
              <td>
                <button onClick={() => handleEdit(emp)}>Editar</button>
                <button onClick={() => handleDelete(emp.id)}>Remover</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Emprestimos