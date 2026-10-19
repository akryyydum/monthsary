import { config } from './config.js'

const gifModules = import.meta.glob('./photos/*.{gif,GIF}', {
  eager: true,
  query: '?url',
  import: 'default',
})

const characterGifs = Object.fromEntries(
  Object.entries(config.characterGifs).map(([slot, path]) => [slot, gifModules[path]]),
)

function BearSVG() {
  return (
    <svg viewBox="0 0 120 130" role="img" aria-label="cute teddy bear">
      <ellipse cx="60" cy="108" rx="34" ry="24" fill="#a8745a" />
      <ellipse cx="60" cy="110" rx="20" ry="15" fill="#ffdcc4" />
      <circle cx="26" cy="30" r="15" fill="#a8745a" />
      <circle cx="26" cy="30" r="8" fill="#ffb3c7" />
      <circle cx="94" cy="30" r="15" fill="#a8745a" />
      <circle cx="94" cy="30" r="8" fill="#ffb3c7" />
      <ellipse cx="60" cy="62" rx="44" ry="38" fill="#b8806a" />
      <ellipse cx="60" cy="74" rx="18" ry="13" fill="#ffe6d2" />
      <ellipse cx="60" cy="67" rx="6.5" ry="4.5" fill="#5a3a2e" />
      <path
        d="M60 71 V77 M60 77 Q54 83 49 78 M60 77 Q66 83 71 78"
        stroke="#5a3a2e"
        strokeWidth="2.4"
        strokeLinecap="round"
        fill="none"
      />
      <ellipse className="eye" cx="41" cy="56" rx="4.6" ry="5.6" fill="#2d1b14" />
      <circle cx="42.6" cy="54" r="1.6" fill="#fff" />
      <ellipse className="eye" cx="79" cy="56" rx="4.6" ry="5.6" fill="#2d1b14" />
      <circle cx="80.6" cy="54" r="1.6" fill="#fff" />
      <ellipse cx="31" cy="70" rx="8" ry="5" fill="#ff8fb2" opacity="0.55" />
      <ellipse cx="89" cy="70" rx="8" ry="5" fill="#ff8fb2" opacity="0.55" />
      <path d="M60 102 L47 95 L47 109 Z M60 102 L73 95 L73 109 Z" fill="#7fb8ff" />
      <circle cx="60" cy="102" r="3.6" fill="#5a98e6" />
    </svg>
  )
}

function BunnySVG() {
  return (
    <svg viewBox="0 0 120 130" role="img" aria-label="cute bunny">
      <ellipse cx="60" cy="108" rx="32" ry="24" fill="#fff4ee" />
      <ellipse cx="60" cy="110" rx="19" ry="15" fill="#ffe3ec" />
      <g transform="rotate(-10 42 40)">
        <ellipse cx="42" cy="24" rx="11" ry="28" fill="#fff4ee" />
        <ellipse cx="42" cy="27" rx="5.5" ry="19" fill="#ffb3c7" />
      </g>
      <g transform="rotate(10 78 40)">
        <ellipse cx="78" cy="24" rx="11" ry="28" fill="#fff4ee" />
        <ellipse cx="78" cy="27" rx="5.5" ry="19" fill="#ffb3c7" />
      </g>
      <ellipse cx="60" cy="64" rx="42" ry="36" fill="#fff8f3" stroke="#f3dccd" strokeWidth="2" />
      <ellipse cx="60" cy="68" rx="4.2" ry="3.2" fill="#ff8fb2" />
      <path
        d="M60 71 V75 M60 75 Q55 80 51 76 M60 75 Q65 80 69 76"
        stroke="#b8806a"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
      <ellipse className="eye" cx="42" cy="59" rx="4.6" ry="5.6" fill="#2d1b14" />
      <circle cx="43.6" cy="57" r="1.6" fill="#fff" />
      <ellipse className="eye" cx="78" cy="59" rx="4.6" ry="5.6" fill="#2d1b14" />
      <circle cx="79.6" cy="57" r="1.6" fill="#fff" />
      <ellipse cx="32" cy="71" rx="8" ry="5" fill="#ff8fb2" opacity="0.55" />
      <ellipse cx="88" cy="71" rx="8" ry="5" fill="#ff8fb2" opacity="0.55" />
      <path d="M34 40 L21 33 L21 47 Z M34 40 L47 33 L47 47 Z" fill="#ff6f9c" />
      <circle cx="34" cy="40" r="3.6" fill="#f0477f" />
    </svg>
  )
}

export function Character({ kind = 'bear', className = '', gifSlot }) {
  const characterGif = gifSlot ? characterGifs[gifSlot] : undefined

  return (
    <div className={`char ${className}`}>
      {characterGif ? (
        <img className="char-gif" src={characterGif} alt="cute couple animation" draggable="false" />
      ) : kind === 'bear' ? (
        <BearSVG />
      ) : (
        <BunnySVG />
      )}
    </div>
  )
}

export function Couple({ happy = false, small = false, gifSlot = 'main' }) {
  const characterGif = characterGifs[gifSlot]

  return (
    <div className={`couple ${happy ? 'happy' : ''} ${small ? 'small' : ''}`}>
      {characterGif ? (
        <Character kind="couple" gifSlot={gifSlot} />
      ) : (
        <>
          <Character kind="bear" />
          <Character kind="bunny" />
        </>
      )}
      <span className="couple-heart">💗</span>
    </div>
  )
}
