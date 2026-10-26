// Client-side password gate. This script is bundled into prescript.js, which
// Quartz loads as a blocking script in <head> — so the overlay is created
// before the body is ever painted.
//
// NOTE: This is a deterrent, not real access control. The content stays in
// the static HTML and the hash can always be recovered by reading the code.
//
// The password is never stored in plain text, only its SHA-256 hash:
const GATE_HASH =
  "631dd16891e2f5218967bfd176056360355fbc4153463bd969151651b53c07b4" // sha256("kbase")
// To change the password, run
//   printf '%s' '<new-password>' | sha256sum | awk '{print $1}'
// and replace GATE_HASH with the output.

const UNLOCK_KEY = "kbase.unlocked"
const GATE_CLASS = "password-gate"
const LOCK_BUTTON_CLASS = "password-gate-lock"

let gateEl = null

function rightRotate(value, amount) {
  return (value >>> amount) | (value << (32 - amount))
}

// Compact SHA-256 for ASCII strings.
function sha256(ascii) {
  const maxWord = Math.pow(2, 32)
  const words = []
  const asciiBitLength = ascii.length * 8
  let hash = []
  let k = []
  const isComposite = {}
  let primeCounter = 0
  for (let candidate = 2; primeCounter < 64; candidate++) {
    if (!isComposite[candidate]) {
      for (let i = 0; i < 313; i += candidate) {
        isComposite[i] = candidate
      }
      hash[primeCounter] = (Math.pow(candidate, 0.5) * maxWord) | 0
      k[primeCounter++] = (Math.pow(candidate, 1 / 3) * maxWord) | 0
    }
  }
  ascii += "\x80"
  while ((ascii.length % 64) - 56) ascii += "\x00"
  for (let i = 0; i < ascii.length; i++) {
    const j = ascii.charCodeAt(i)
    if (j >> 8) return
    words[i >> 2] |= j << (((3 - i) % 4) * 8)
  }
  words[words.length] = (asciiBitLength / maxWord) | 0
  words[words.length] = asciiBitLength
  for (let j = 0; j < words.length; ) {
    const w = words.slice(j, (j += 16))
    const oldHash = hash.slice(0, 8)
    for (let i = 0; i < 64; i++) {
      const w15 = w[i - 15]
      const w2 = w[i - 2]
      const a = hash[0]
      const e = hash[4]
      const temp1 =
        hash[7] +
        (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) +
        ((e & hash[5]) ^ (~e & hash[6])) +
        k[i] +
        (w[i] =
          i < 16
            ? w[i]
            : (w[i - 16] +
                (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3)) +
                w[i - 7] +
                (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))) |
              0)
      const temp2 =
        (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) +
        ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]))
      hash = [(temp1 + temp2) | 0].concat(hash)
      hash[4] = (hash[4] + temp1) | 0
    }
    for (let i = 0; i < 8; i++) {
      hash[i] = (hash[i] + oldHash[i]) | 0
    }
  }
  let result = ""
  for (let i = 0; i < 8; i++) {
    for (let j = 3; j + 1; j--) {
      const b = (hash[i] >> (j * 8)) & 255
      result += (b < 16 ? "0" : "") + b.toString(16)
    }
  }
  return result
}

function isUnlocked() {
  try {
    return localStorage.getItem(UNLOCK_KEY) === "1"
  } catch (e) {
    return false
  }
}

function setUnlocked(on) {
  try {
    if (on) localStorage.setItem(UNLOCK_KEY, "1")
    else localStorage.removeItem(UNLOCK_KEY)
  } catch (e) {}
}

function showGate() {
  if (gateEl) return
  const wrap = document.createElement("div")
  wrap.className = GATE_CLASS
  wrap.setAttribute("role", "dialog")
  wrap.setAttribute("aria-label", "Password required")

  const form = document.createElement("form")
  form.className = GATE_CLASS + "__form"

  const input = document.createElement("input")
  input.type = "password"
  input.id = "password-gate-input"
  input.className = GATE_CLASS + "__input"
  input.autocomplete = "off"
  input.setAttribute("aria-label", "Password")

  const error = document.createElement("p")
  error.className = GATE_CLASS + "__error"
  error.textContent = "Wrong password."
  error.setAttribute("role", "alert")
  error.hidden = true

  form.appendChild(input)
  form.appendChild(error)
  wrap.appendChild(form)
  document.documentElement.appendChild(wrap)

  form.addEventListener("submit", (e) => {
    e.preventDefault()
    if (sha256(input.value) === GATE_HASH) {
      setUnlocked(true)
      hideGate()
    } else {
      error.hidden = false
      input.select()
      input.focus()
    }
  })

  gateEl = wrap
  input.focus()
}

function hideGate() {
  if (gateEl) gateEl.remove()
  gateEl = null
  ensureLockButton()
}

function ensureLockButton() {
  if (document.querySelector("." + LOCK_BUTTON_CLASS)) return
  if (!document.body) return // body not parsed yet; DOMContentLoaded/nav retries
  const btn = document.createElement("button")
  btn.className = LOCK_BUTTON_CLASS
  btn.title = "Lock site"
  btn.setAttribute("aria-label", "Lock site")
  btn.textContent = "🔒"
  btn.addEventListener("click", () => {
    setUnlocked(false)
    showGate()
  })
  document.body.appendChild(btn)
}

// Discourage indexing while the site is gated.
if (!document.querySelector('meta[name="robots"]')) {
  const meta = document.createElement("meta")
  meta.name = "robots"
  meta.content = "noindex, nofollow"
  document.head.appendChild(meta)
}

document.addEventListener("DOMContentLoaded", () => {
  if (isUnlocked()) {
    ensureLockButton()
  } else {
    const input = document.getElementById("password-gate-input")
    if (input) input.focus()
  }
})

// SPA navigation swaps the page content; keep the lock button around.
document.addEventListener("nav", () => {
  if (isUnlocked()) ensureLockButton()
})

if (isUnlocked()) {
  ensureLockButton()
} else {
  showGate()
}
