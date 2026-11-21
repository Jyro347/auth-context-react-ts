import { useAuth } from './AuthContext'
import AccessCard from './AccessCard'
import Portrait from './Portrait'

export default function App() {
  const { user } = useAuth()

  return (
    <div className="shell">
      <header className="top">
        <span className="wordmark"><span className="mark" aria-hidden="true" />Студия</span>
        <span className="session" aria-live="polite">
          <span className={user ? 'dot active' : 'dot'} aria-hidden="true" />
          {user ? 'Сессия активна' : 'Гостевой режим'}
        </span>
      </header>
      <main className="layout">
        <AccessCard />
        <Portrait />
      </main>
      <footer className="footer">
        <span>Учебная авторизация</span>
        <span>React · TypeScript · Context API</span>
      </footer>
    </div>
  )
}

