import { useState } from 'react'
import { levels as L } from '../data/monte'

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const reduce = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
const rule = (lv, id) => lv.rules.find((r) => r.id === id)

export default function Monte() {
  const [view, setView] = useState('start') // start | play | end
  const [li, setLi] = useState(0)
  const [list, setList] = useState([])
  const [tries, setTries] = useState(0)
  const [stars, setStars] = useState(0)
  const [busy, setBusy] = useState(false)
  const [res, setRes] = useState(null)
  const [chip, setChip] = useState(null)

  const lv = L[li]
  const ok = res && res.every((o) => o.ok)
  const st = tries === 1 ? 3 : tries === 2 ? 2 : 1

  const edit = (fn) => {
    setList(fn)
    setRes(null)
  }
  const move = (i, d) =>
    edit((l) => {
      const n = [...l]
      ;[n[i], n[i + d]] = [n[i + d], n[i]]
      return n
    })

  async function run() {
    if (busy) return
    setBusy(true)
    setRes(null)
    const rs = list.map((id) => rule(lv, id))
    const out = lv.pk.map((p) => {
      const i = rs.findIndex((r) => r.f(p.p))
      const a = i >= 0 ? rs[i].a : 'D'
      return { p, i, a, ok: a === p.e }
    })
    for (const o of out) {
      setChip({ t: '🦉 ' + o.p.n, c: o.a === 'P' ? 'p' : 'd', left: '2%' })
      if (reduce) {
        await sleep(150)
      } else {
        await sleep(40)
        setChip((c) => ({ ...c, left: '38%' }))
        await sleep(800)
        if (o.a === 'P') {
          setChip((c) => ({ ...c, left: '62%' }))
          await sleep(800)
        } else {
          setChip((c) => ({ ...c, t: '✋ ' + o.p.n }))
          await sleep(700)
        }
      }
      setChip(null)
    }
    setTries((t) => t + 1)
    setRes(out)
    setBusy(false)
  }

  const next = () => {
    setStars(stars + st)
    setList([])
    setTries(0)
    setRes(null)
    if (li + 1 >= L.length) setView('end')
    else setLi(li + 1)
  }

  const restart = () => {
    setView('start')
    setLi(0)
    setList([])
    setTries(0)
    setStars(0)
    setRes(null)
  }

  const stats = view === 'play' ? `Fase ${li + 1} de ${L.length} · Estrelas: ${stars}` : ''
  const avail = lv.rules.filter((r) => !list.includes(r.id))
  const cfg =
    (lv.head ? lv.head + '\n' : '') +
    list.map((id) => rule(lv, id).c).join('\n') +
    (lv.tail ? '\n' + lv.tail : '')

  return (
    <>
      <header>
        <h1>Monte a Lista do Filch</h1>
        <div className="stats" aria-live="polite">{stats}</div>
      </header>
      <main>
        {view === 'start' && (
          <>
            <h2>Você escreve a lista</h2>
            <p className="mut">
              Dessa vez, você não só decide: você monta a lista de regras do Filch. Escolha as
              regras, coloque na ordem certa e abra o portão para ver as corujas passarem ou serem
              barradas.
            </p>
            <button className="main" onClick={() => setView('play')}>Começar</button>
          </>
        )}

        {view === 'end' && (
          <>
            <h2>Fim de jogo</h2>
            <p className="big">★ {stars} de {L.length * 3}</p>
            <p className="mut">
              Você escreveu {L.length} listas de regras de verdade. É isso que se faz em ACLs e no
              ZPF: escolher as regras, cuidar da ordem e testar.
            </p>
            <button className="main" onClick={restart}>Jogar de novo</button>
          </>
        )}

        {view === 'play' && (
          <>
            <h2>{lv.t}</h2>
            <p className="mut">Objetivo: {lv.goal}</p>
            <div className="scene">
              <span className="w">Quem chega</span>
              <div className="g">🚪<small>Filch</small></div>
              <span className="c">Castelo 🏰</span>
              {chip && <div className={'chip ' + chip.c} style={{ left: chip.left }}>{chip.t}</div>}
            </div>

            <div className="cols">
              <div className="box">
                <h3>Regras disponíveis</h3>
                {avail.map((r) => (
                  <div className="rule" key={r.id}>
                    <span className={'tag ' + (r.a === 'P' ? 'p' : 'd')}>{r.a === 'P' ? 'PERMITE' : 'BARRA'}</span>
                    <span className="t">{r.x}</span>
                    <button className="s" disabled={busy} onClick={() => edit((l) => [...l, r.id])}>Usar</button>
                  </div>
                ))}
                {!avail.length && <p className="mut">Todas as regras estão na lista.</p>}
              </div>
              <div className="box">
                <h3>Sua lista (lida de cima para baixo)</h3>
                {list.map((id, i) => (
                  <div className="rule" key={id}>
                    <b className="n">{i + 1}.</b>
                    <span className="t">{rule(lv, id).x}</span>
                    <button className="s" aria-label="Subir" disabled={busy || i === 0} onClick={() => move(i, -1)}>↑</button>
                    <button className="s" aria-label="Descer" disabled={busy || i === list.length - 1} onClick={() => move(i, 1)}>↓</button>
                    <button className="s" aria-label="Remover" disabled={busy} onClick={() => edit((l) => l.filter((x) => x !== id))}>✕</button>
                  </div>
                ))}
                {!list.length && <p className="mut">Vazia. Se você abrir o portão assim, ninguém passa.</p>}
                <div className="rule inv">
                  <b className="n">·</b>
                  <span className="t">Barrar todo o resto (regra invisível do final)</span>
                </div>
              </div>
            </div>

            <div className="row">
              <button className="main" disabled={busy || !list.length} onClick={run}>Abrir o portão e testar</button>
              <button disabled={busy || !list.length} onClick={() => edit(() => [])}>Limpar a lista</button>
            </div>

            {res && (
              <div className="box">
                <h3>Resultado do teste</h3>
                {res.map((o, i) => (
                  <div className={'res ' + (o.ok ? 'ok' : 'no')} key={i}>
                    <span className="i">{o.ok ? '✓' : '✗'}</span>
                    <span>
                      {o.p.n}: {o.a === 'P' ? 'passou' : 'foi barrado'}
                      {o.i >= 0 ? ` (regra ${o.i + 1})` : ' (regra invisível)'}
                      {o.ok ? '' : `. Deveria ${o.p.e === 'P' ? 'passar' : 'ser barrado'}: ${o.p.w}`}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {ok && (
              <div className="win">
                <strong>
                  Lista aprovada! {'★'.repeat(st)} ({tries} {tries === 1 ? 'tentativa' : 'tentativas'})
                </strong>
                <p>{lv.lesson}</p>
                <p>Na prática, a sua lista vira isto no roteador:</p>
                <pre>{cfg}</pre>
                <button className="main" onClick={next}>
                  {li === L.length - 1 ? 'Ver resultado' : 'Próxima fase'}
                </button>
              </div>
            )}
            {res && !ok && tries >= 2 && <div className="hint">Dica: {lv.hint}</div>}
          </>
        )}
      </main>
    </>
  )
}
