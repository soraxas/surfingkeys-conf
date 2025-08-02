// import theme from "./theme.js"
import keys from "./keys.js"
import searchEngines from "./search-engines.js"


import api from "./api.js"
import help from "./help.js"
import theme from "./my_theme.js"

const { categories } = help





////////////////////////////////////////////////////////////
///// Keys
////////////////////////////////////////////////////////////
const createRegExp = (str, opts) => new RegExp(str.raw[0].replace(/\s/gm, ""), opts || "i")

const blacklistPattern = createRegExp`
inbox.google.com.*|
overleaf.com|
trello.com|
duolingo.com|
youtube.com|
mail.google.com.*/
`


////////////////////////////////////////////////////////////
///// Keys
////////////////////////////////////////////////////////////
keys.unmaps.mappings.push(
  "<Ctrl-d>", "<Ctrl-u>",
  //    "<Ctrl-n>", "<Ctrl-k>",
  "ZZ", "ZR", "ZQ",
)

// -  {
// -    alias:       "w",
// -    map:         "k",
// -    category:    categories.scroll,
// -    description: "Scroll up",
// -  },
// -  {
// -    alias:       "s",
// -    map:         "j",
// -    category:    categories.scroll,
// -    description: "Scroll down",
// -  },
// -  {
// -    alias:       "K",
// -    map:         "e",
// -    category:    categories.scroll,
// -    description: "Scroll half page up",
// -  },
// -  {
// -    alias:       "J",
// -    map:         "d",
// -    category:    categories.scroll,
// -    description: "Scroll half page down",
// -  },

// remove these keymaps added by the repo
const remove_alias_global_mapping = new Set(["w", "s", "K", "J"])
keys.maps.global = keys.maps.global.filter(
  (item) => !remove_alias_global_mapping.has(item.alias)
)
// add these new keymaps
keys.maps.global.push(
  {
    alias:       "<Alt-f>",
    map:         "cf",
    category:    categories.mouseClick,
    description: "Open multiple links in a new tab",
  },
  {
    alias:       "gxJ",
    map:         "gxt",
    category:    categories.tabs,
    description: "Close tab to left",
  },
  {
    alias:       "gxK",
    map:         "gxT",
    category:    categories.tabs,
    description: "Close tab to right",
  },
  /* ---------------------------------------------------- */
  {
    alias:       "<Ctrl-u>",
    map:         "e",
    category:    categories.scroll,
    description: "Scroll half page up",
  },
  {
    alias:       "<Ctrl-d>",
    map:         "d",
    category:    categories.scroll,
    description: "Scroll half page down",
  },
  {
    alias:       "M",
    // alias:       "H",
    map:         "S",
    category:    categories.tabs,
    description: "Go back in history",
  },
  {
    alias:       "I",
    // alias:       "L",
    map:         "D",
    category:    categories.tabs,
    description: "Go forward in history",
  },
  {
    alias:       "<Ctrl-m>",
    // alias:       "J",
    map:         "E",
    category:    categories.tabs,
    description: "Go one tab left",
  },
  {
    alias:       "<Ctrl-i>",
    // alias:       "K",
    map:         "R",
    category:    categories.tabs,
    description: "Go one tab right",
  },
  {
    alias:       "<Alt-j>",
    map:         "<Ctrl-n>",
    category:    categories.omnibar,
    description: "Forward cycle through the candidates",
  },
  {
    alias:       "<Alt-k>",
    map:         "<Ctrl-p>",
    category:    categories.omnibar,
    description: "Backward cycle through the candidates",
  },
)

// visual mapping
api.vmap("m", "h");
api.vmap("<Ctrl-n>", "j");
api.vmap("<Ctrl-e>", "k");
api.vmap("i", "l");



////////////////////////////////////////////////////////////
///// Completions
////////////////////////////////////////////////////////////
// Google scholar
searchEngines.gs = {
  alias:  "gs",
  name:   "Google Scholar",
  search: "https://scholar.google.com/scholar?hl=en&q=",
  compl:  "https://scholar.google.com/scholar_complete?q=%s&hl=en",
}

searchEngines.gs.callback = (response) => JSON.parse(response.text).l.map((s) => {
  const regex = /^.*?[|]/gi
  return createSuggestionItem(`
      ${escape(s.replace(regex, "... "))}
  `, { url: `https://scholar.google.com/scholar?hl=en&q=${escape(s.replace("|", ""))}` })
})

// theasurus.com
searchEngines.sy = {
  alias:  "sy",
  name:   "synonyms & antonyms",
  search: "https://www.thesaurus.com/browse/",
  compl:  "https://tuna.thesaurus.com/pageData/",
}

searchEngines.sy.callback = (response, input) => { // eslint-disable-line no-unused-vars
  const { data } = JSON.parse(response.text)
  if (!data) return []

  const maxLength = 10
  const words = []
  const def = data.definitionData.definitions[0]
  // sort ascend
  let { synonyms } = def
  synonyms.sort((a, b) => parseInt(b.similarity, 10) - parseInt(a.similarity, 10))
  synonyms = synonyms.slice(0, maxLength)
  synonyms.forEach((s) => {
    const w = createSuggestionItem(
      `
        [syn: ${escape(
    s.similarity,
  )}] <div class="title" style="display: inline"><strong>${escape(
  s.term,
)}</strong></div>
    `,
      { url: `https://thesaurus.com/browse/${escape(s.targetSlug)}` },
    )

    words.push(w)
  })
  // sort descend
  let { antonyms } = def
  antonyms.sort((a, b) => parseInt(a.similarity, 10) - parseInt(b.similarity, 10))
  antonyms = antonyms.slice(0, maxLength)
  antonyms.forEach((s) => {
    const w = createSuggestionItem(
      `
        [ant: ${escape(
    s.similarity,
  )}] <div class="url" style="display: inline"><strong>${escape(
  s.term,
)}</strong></div>
    `,
      { url: `https://thesaurus.com/browse/${escape(s.targetSlug)}` },
    )

    words.push(w)
  })
  return words
}
////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////
///// Theme
////////////////////////////////////////////////////////////
const hintsCss =
  "font-size: 13pt; font-family: 'JetBrains Mono NL', 'Cascadia Code', 'Helvetica Neue', Helvetica, Arial, sans-serif; border: 0px; color: #e0def4 !important; background: #191724; background-color: #191724"

// Hints.style("border: solid 1px #C5C8C6; color:#52C196; background: initial; background-color: #1D1F21;")
// Hints.style("border: solid 1px #C5C8C6 !important; padding: 1px !important; color: #C5C8C6 !important; background: #FD971F !important;", "text")
// }
// if (typeof Visual !== "undefined") {
//   /* global Visual */
//   Visual.style("marks", "background-color: #52C19699;")
//   Visual.style("cursor", "background-color: #51AFEF;")
// }


api.Hints.style("font-size: 10pt; border: solid 1px #C5C8C6; color:#52C196; background: initial; background-color: #1D1F21;")
api.Hints.style(
  "font-size: 10pt; border: solid 1px #C5C8C6 !important; padding: 1px !important; color:  #3B4252 !important; background: #FD971F !important;",
  "text"
)

// api.Hints.setCharacters('arstoiengmplfuwydhvkc,');
api.Hints.setCharacters('rtkneimyswfauhlvpgdcxzq;bj/RTKNEIMYSWFAUHLVPGDCXZQ:BJ?');


export default {
  settings: {
    hintAlign: "left",
    // normal
    // hintCharacters: "qwertasdfgzxcvb",
    // colemak-DH
    // hintCharacters: "arstgjluy;qwfpbkhxcdv",
    omnibarSuggestionTimeout: 500,
    richHintsForKeystroke: 1,
    defaultSearchEngine: "ka",
    stealFocusOnLoad: false,
    theme,
    ////////////////////
    blacklistPattern,
    // focusFirstCandidate: false,
    // focusAfterClosed:    "last",
    // scrollStepSize:      150,
    // tabsThreshold: 7,
    modeAfterYank:       "Normal",
    hintShiftNonActive:  true,
    ////////////////////
  },

  keys,
  searchEngines,

  // Leader for site-specific mappings
  siteleader: "<Space>",

  // Leader for OmniBar searchEngines
  searchleader: "a",
  // searchleader: "s",

  // Array containing zero or more log levels to enable: log, warn, error
  logLevels: [
    // "log",
    // "warn",
    "error",
  ],
}
