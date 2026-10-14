import { useState } from 'react'
import { buildQuiz } from '../data/prova'

const mono = (t) => /^[0-9]/.test(t) || /^(ip |ipv6 |access-|show |no |inspect|pass|drop|permit|delete|clear)/.test(t)

export default function Prova() {
  const [view, setView] = useState('start') // start | quiz | end
  const [mode, setMode] = useState('treino')
  const [qs, setQs] = useState([])
  const [qi, setQi] = useState(0)
  const [ans, setAns] = useState([])
  const [shown, setShown] = useState(false)

  const start = () => {
    setQs(buildQuiz())
    setQi(0)
    setAns([])
    setShown(false)
    setView('quiz')
  }
  const go = () => {
    setShown(false)
    if (qi < qs.length - 1) setQi(qi + 1)
    else setView('end')
  }
  const pick = (i) => {
    const a = [...ans]
    a[qi] = i
    setAns(a)
    if (mode === 'treino') setShown(true)
    else go()
  }

  const stats = view === 'quiz' ? `Pergunta ${qi + 1} de ${qs.length}` : ''
  const q = qs[qi]

  let result = null
  if (view === 'end') {
    const total = qs.length
    const right = qs.filter((x, i) => x.opts[ans[i]].ok).length
    const pc = Math.round((right / total) * 100)
    const by = {}
    qs.forEach((x, i) => {
      by[x.tp] = by[x.tp] || [0, 0]
      by[x.tp][1]++
      if (x.opts[ans[i]].ok) by[x.tp][0]++
    })
    const miss = qs.map((x, i) => ({ x, i })).filter(({ x, i }) => !x.opts[ans[i]].ok)
    result = { total, right, pc, by, miss }
  }

  return (
    <>
      <header>
        <h1>Treino estilo prova</h1>
        <div className="stats" aria-live="polite">{stats}</div>
      </header>
      <main>
        {view === 'start' && (
          <>
            <h2>Pratique como numa prova</h2>
            <p className="mut">
              Perguntas de múltipla escolha com endereços IP, máscaras curinga, leitura de ACLs,
              comandos e conceitos de firewall e ZPF. Os números mudam a cada rodada, então dá para
              repetir sem decorar.
            </p>
            <div className="box">
              <p className="q">Escolha o modo:</p>
              <div className="row">
                <button className={mode === 'treino' ? 'sel' : ''} onClick={() => setMode('treino')}>
                  Treino: explicação a cada resposta
                </button>
                <button className={mode === 'prova' ? 'sel' : ''} onClick={() => setMode('prova')}>
                  Prova: resultado só no final
                </button>
              </div>
              <button className="main" onClick={start}>Começar (12 perguntas)</button>
            </div>
          </>
        )}

        {view === 'quiz' && q && (
          <>
            <div className="box">
              <span className="topic">{q.tp}</span>
              <p className="q">{q.q}</p>
              {q.k && <pre>{q.k}</pre>}
              {q.opts.map((o, i) => {
                let cls = 'opt' + (mono(o.t) ? '' : ' txt')
                if (shown) cls += o.ok ? ' ok' : ans[qi] === i ? ' no' : ''
                return (
                  <button key={i} className={cls} disabled={shown} onClick={() => pick(i)}>
                    {o.t}
                  </button>
                )
              })}
            </div>
            {shown && (
              <>
                <div className="exp">
                  <strong>{q.opts[ans[qi]].ok ? 'Correto. ' : 'Não foi essa. '}</strong>
                  <span>{q.e}</span>
                </div>
                <button className="main" onClick={go}>
                  {qi === qs.length - 1 ? 'Ver resultado' : 'Próxima'}
                </button>
              </>
            )}
          </>
        )}

        {view === 'end' && result && (
          <>
            <h2>Resultado</h2>
            <p className="big">{result.right} de {result.total} ({result.pc}%)</p>
            <p className="mut">
              {result.pc >= 80
                ? 'Ótimo ritmo. Faça outra rodada para consolidar.'
                : result.pc >= 60
                ? 'Bom caminho. Reveja as explicações abaixo e refaça.'
                : 'Leia as explicações com calma e tente de novo: os números mudam.'}
            </p>
            <div className="box">
              <p className="q">Por tópico</p>
              {Object.entries(result.by).map(([k, v]) => (
                <div key={k}>
                  {k}: {v[0]}/{v[1]}
                  <div className="bar"><i style={{ width: (v[0] / v[1]) * 100 + '%' }} /></div>
                </div>
              ))}
            </div>
            {result.miss.length > 0 && (
              <div className="box">
                <p className="q">O que revisar</p>
                {result.miss.map(({ x, i }) => (
                  <div className="miss" key={i}>
                    <span className="topic">{x.tp}</span>
                    <p className="q">{x.q}</p>
                    {x.k && <pre>{x.k}</pre>}
                    <p>Você marcou: {x.opts[ans[i]].t}</p>
                    <p>Correta: {x.opts.find((o) => o.ok).t}</p>
                    <p className="mut">{x.e}</p>
                  </div>
                ))}
              </div>
            )}
            <button className="main" onClick={() => setView('start')}>Nova rodada</button>
          </>
        )}
      </main>
    </>
  )
}
