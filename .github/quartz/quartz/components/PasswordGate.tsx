import { QuartzComponent, QuartzComponentConstructor } from "./types"
// @ts-ignore
import passwordGateScript from "./scripts/passwordGate.inline"
import style from "./styles/passwordGate.scss"

/**
 * Client-side password gate.
 *
 * The component renders nothing itself; its `beforeDOMLoaded` script is bundled
 * into `prescript.js`, which Quartz loads as a blocking script in `<head>`. The
 * script therefore creates the full-screen overlay before the body is parsed,
 * so no page content flashes before the gate.
 *
 * NOTE: This is a deterrent, not real access control — the content remains in
 * the static HTML and the password hash can be recovered by reading the code.
 */
export default (() => {
  const PasswordGate: QuartzComponent = () => null

  PasswordGate.css = style
  PasswordGate.beforeDOMLoaded = passwordGateScript
  return PasswordGate
}) satisfies QuartzComponentConstructor
