import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import { createI18n } from 'vue-i18n'
import { Locale } from 'vant'

export const localLanguage = () => {
  const language = sessionStorage.getItem('IMI18n') ?? navigator.language
  if (language.includes('zh')) {
    return 'zh-CN'
  }
  if (language.includes('en')) {
    return 'en-US'
  }
  return 'en-US'
}

export function loadLanguages() {
  const context = import.meta.glob('./languages/*.ts', { eager: true })

  const languages: any = {}

  let langs = Object.keys(context)
  for (let key of langs) {
    if (key === './index.ts') return
    let lang = (context[key] as any).lang
    let name = key.replace(/(\.\/languages\/|\.ts)/g, '')
    languages[name] = lang
  }

  return languages
}

export function i18nt(key: string) {
  // @ts-ignore
  return i18n.global.t(key)
}

export const i18n = createI18n({
  locale: localLanguage(),
  fallbackLocale: 'en-US',
  messages: loadLanguages(),
})

dayjs.locale(localLanguage())
Locale.use(localLanguage(), i18n.global.messages[i18n.global.locale].vant)

export function setLanguage(locale: string) {
  i18n.global.locale = locale
  dayjs.locale(locale)
  Locale.use(locale, i18n.global.messages[i18n.global.locale].vant)
  sessionStorage.setItem('IMI18n', locale)
}
