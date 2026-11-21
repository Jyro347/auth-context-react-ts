import { useState, type FormEvent } from 'react'
import { useAuth } from './AuthContext'

export default function AccessCard() {
  const { user, login, logout } = useAuth()
  const [name, setName] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    login(name)
    setName('')
  }

  if (user) {
    return (
      <section className="access" aria-labelledby="access-title">
        <div className="access-body">
          <div className="monogram" aria-hidden="true">{Array.from(user.name)[0]?.toUpperCase()}</div>
          <h1 id="access-title">Привет, <span>{user.name}.</span></h1>
          <p>Ты вошёл в личный кабинет. Сессия сохранится после обновления страницы.</p>
          <button className="primary" type="button" onClick={logout}>Выйти из аккаунта</button>
        </div>
      </section>
    )
  }

  return (
    <section className="access" aria-labelledby="access-title">
      <div className="access-body">
        <h1 id="access-title">Личный <span>кабинет.</span></h1>
        <p>Введи своё имя, чтобы открыть профиль.</p>
        <form onSubmit={handleSubmit} className="access-form">
          <label htmlFor="name">Твоё имя</label>
          <input
            id="name"
            name="name"
            value={name}
            onChange={event => setName(event.target.value)}
            placeholder="Например, Артём"
            autoComplete="given-name"
            maxLength={40}
            required
          />
          <button className="primary" type="submit" disabled={!name.trim()}>Войти</button>
        </form>
      </div>
    </section>
  )
}

