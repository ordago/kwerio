import { useSelector } from "react-redux"
import { get } from "lodash"

function _interpolate(text, params) {
  for (let i = 0; i < params.length; i ++) {
    text = text.replace(/%s/, params[i])
  }

  return text
}

function useT(translations = null) {
  const core = useSelector(state => state.app),
    module = useSelector(state => state.module)

  // Use user provided translation
  if (translations) {
    return (text, params = []) => _interpolate(get(translations, text, text), params)
  }

  // If we are not inside the module, then pick translation from the core.
  if (!module) {
    return (text, params = []) => _interpolate(get(core.t, text, text), params)
  }

  // First try to get translations from the module, if not available use the
  // one provided by the core.
  return (text, params = []) => _interpolate(get(
    module.t,
    text,
    get(core.t, text, text)
  ), params)
}

export default useT
