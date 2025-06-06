import { useEffect, useState } from 'react'
import axios from 'axios'
import './Livros.css'

function Livros() {
  const [livros, setLivros] = useState([])
  const [categorias, setCategorias] = useState([])
  const [form, setForm] = useState({ titulo: '', autor: '', ano_publicacao: '', categoria_id: '', quantidade_disponivel: 1 })
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

  const fetchLivros = async () => {
    setLoading(true)
    try {
      const { data } = await axios.get('http://localhost:3000/livros')
      setLivros(data)
      setError('')
    } catch (err) {
      setError('Erro ao buscar livros')
      clearMessages()
    }
    setLoading(false)
  }

  const fetchCategorias = async () => {
    try {
      const { data } = await axios.get('http://localhost:3000/categorias')
      setCategorias(data)
    } catch {}
  }

  useEffect(() => {
    fetchLivros()
    fetchCategorias()
  }, [])

  const validateForm = (f) => {
    if (!f.titulo.trim() || f.titulo.trim().length < 3) return 'Título obrigatório (mín. 3 letras)'
    if (!f.autor.trim() || f.autor.trim().length < 3) return 'Autor obrigatório (mín. 3 letras)'
    if (!f.ano_publicacao || isNaN(f.ano_publicacao) || Number(f.ano_publicacao) <= 0) return 'Ano obrigatório e deve ser positivo'
    if (!f.categoria_id) return 'Selecione uma categoria'
    if (!f.quantidade_disponivel || isNaN(f.quantidade_disponivel) || Number(f.quantidade_disponivel) < 0) return 'Quantidade deve ser zero ou positiva'
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
      await axios.post('http://localhost:3000/livros', { ...form, ano_publicacao: Number(form.ano_publicacao), categoria_id: Number(form.categoria_id), quantidade_disponivel: Number(form.quantidade_disponivel) })
      setForm({ titulo: '', autor: '', ano_publicacao: '', categoria_id: '', quantidade_disponivel: 1 })
      setSuccess('Livro adicionado com sucesso!')
      fetchLivros()
      clearMessages()
    } catch {
      setError('Erro ao adicionar livro')
      clearMessages()
    }
  }

  const handleEdit = (livro) => {
    setEditId(livro.id)
    setForm({
      titulo: livro.titulo,
      autor: livro.autor,
      ano_publicacao: livro.ano_publicacao,
      categoria_id: livro.categoria_id,
      quantidade_disponivel: livro.quantidade_disponivel
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
      await axios.put(`http://localhost:3000/livros/${editId}`, { ...form, ano_publicacao: Number(form.ano_publicacao), categoria_id: Number(form.categoria_id), quantidade_disponivel: Number(form.quantidade_disponivel) })
      setEditId(null)
      setForm({ titulo: '', autor: '', ano_publicacao: '', categoria_id: '', quantidade_disponivel: 1 })
      setSuccess('Livro atualizado com sucesso!')
      fetchLivros()
      clearMessages()
    } catch {
      setError('Erro ao atualizar livro')
      clearMessages()
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Remover livro?')) return
    try {
      await axios.delete(`http://localhost:3000/livros/${id}`)
      setSuccess('Livro removido com sucesso!')
      fetchLivros()
      clearMessages()
    } catch {
      setError('Erro ao remover livro')
      clearMessages()
    }
  }

  return (
    <div className="livros-container">
      <h2>Livros</h2>
      <form className="livros-form" onSubmit={editId ? handleUpdate : handleAdd}>
        <input name="titulo" placeholder="Título" value={form.titulo} onChange={handleChange} />
        <input name="autor" placeholder="Autor" value={form.autor} onChange={handleChange} />
        <input name="ano_publicacao" placeholder="Ano" type="number" value={form.ano_publicacao} onChange={handleChange} />
        <select name="categoria_id" value={form.categoria_id} onChange={handleChange}>
          <option value="">Categoria</option>
          {categorias.map(cat => <option key={cat.id} value={cat.id}>{cat.nome}</option>)}
        </select>
        <input name="quantidade_disponivel" placeholder="Qtd" type="number" value={form.quantidade_disponivel} onChange={handleChange} />
        <button type="submit">{editId ? 'Atualizar' : 'Adicionar'}</button>
        {editId && <button type="button" onClick={() => { setEditId(null); setForm({ titulo: '', autor: '', ano_publicacao: '', categoria_id: '', quantidade_disponivel: 1 }) }}>Cancelar</button>}
      </form>
      {loading ? <p>Carregando...</p> : null}
      {error && <p className="livros-error msg-error">{error}</p>}
      {success && <p className="livros-success msg-success">{success}</p>}
      <table className="livros-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Título</th>
            <th>Autor</th>
            <th>Ano</th>
            <th>Categoria</th>
            <th>Qtd</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {livros.map(livro => (
            <tr key={livro.id}>
              <td>{livro.id}</td>
              <td>{livro.titulo}</td>
              <td>{livro.autor}</td>
              <td>{livro.ano_publicacao}</td>
              <td>{categorias.find(c => c.id === livro.categoria_id)?.nome || '-'}</td>
              <td>{livro.quantidade_disponivel}</td>
              <td>
                <button onClick={() => handleEdit(livro)}>Editar</button>
                <button onClick={() => handleDelete(livro.id)}>Remover</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Livros