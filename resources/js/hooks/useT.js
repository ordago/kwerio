import _ from "lodash"

function useT(translations) {
  return text => {
    return _.get(translations, text, text)
  }
}

export default useT
