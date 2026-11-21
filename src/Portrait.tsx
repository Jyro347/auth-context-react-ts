import { useEffect, useRef } from 'react'
import { useAuth } from './AuthContext'

function SessionDetails() {
  const { user } = useAuth()

  return (
    <div className="portrait-caption">
      <div>
        <span className="caption-label">Профиль</span>
        <strong>{user?.name ?? 'Гость'}</strong>
      </div>
      <span className="motion-note">Портрет следит за курсором</span>
    </div>
  )
}

export default function Portrait() {
  const portrait = useRef<HTMLElement>(null)

  useEffect(() => {
    const element = portrait.current
    if (!element) return
    const stage = element

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0

    function reset() {
      cancelAnimationFrame(frame)
      stage.dataset.pose = 'center'
      stage.style.setProperty('--tilt', '0px')
    }

    function follow(event: PointerEvent) {
      if (reducedMotion.matches || event.pointerType !== 'mouse') return

      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const x = event.clientX / window.innerWidth
        const y = event.clientY / window.innerHeight
        stage.dataset.pose = x < 0.39 ? 'left' : x > 0.65 ? 'right' : 'center'
        stage.style.setProperty('--tilt', `${(0.5 - y) * 13}px`)
      })
    }

    function leave(event: PointerEvent) {
      if (event.relatedTarget === null) reset()
    }

    window.addEventListener('pointermove', follow, { passive: true })
    window.addEventListener('pointerout', leave)
    window.addEventListener('blur', reset)
    reducedMotion.addEventListener('change', reset)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', follow)
      window.removeEventListener('pointerout', leave)
      window.removeEventListener('blur', reset)
      reducedMotion.removeEventListener('change', reset)
    }
  }, [])

  return (
    <figure className="portrait" ref={portrait} data-pose="center">
      <div className="portrait-frames" role="img" aria-label="Чёрно-белый портрет женщины">
        <img className="pose pose-left" src="/portrait/left.jpg" alt="" />
        <img className="pose pose-center" src="/portrait/center.jpg" alt="" />
        <img className="pose pose-right" src="/portrait/right.jpg" alt="" />
      </div>
      <figcaption><SessionDetails /></figcaption>
    </figure>
  )
}

