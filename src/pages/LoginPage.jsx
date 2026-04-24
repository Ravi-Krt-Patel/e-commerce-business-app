import { useContext, useState } from 'react'
import { ShopContext } from '../context/ShopContext'

function LoginPage() {
  const { user, login, logout } = useContext(ShopContext)
  const [form, setForm] = useState({ name: '', email: '' })

  const onSubmit = (event) => {
    event.preventDefault()
    if (!form.name.trim() || !form.email.trim()) return
    login(form.name.trim(), form.email.trim())
    setForm({ name: '', email: '' })
  }

  return (
    <section className="panel">
      <h2>{user ? 'Your Account' : 'Login'}</h2>
      {user ? (
        <div className="account-box">
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
          <button type="button" onClick={logout}>
            Logout
          </button>
        </div>
      ) : (
        <form className="login-form" onSubmit={onSubmit}>
          <input
            type="text"
            value={form.name}
            placeholder="Enter name"
            onChange={(event) =>
              setForm((current) => ({ ...current, name: event.target.value }))
            }
          />
          <input
            type="email"
            value={form.email}
            placeholder="Enter email"
            onChange={(event) =>
              setForm((current) => ({ ...current, email: event.target.value }))
            }
          />
          <button type="submit">Login</button>
        </form>
      )}
    </section>
  )
}

export default LoginPage
