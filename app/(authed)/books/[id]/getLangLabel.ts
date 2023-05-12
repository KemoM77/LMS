type LanguageCode =
  | 'any'
  | 'af'
  | 'sq'
  | 'am'
  | 'ar'
  | 'an'
  | 'hy'
  | 'ast'
  | 'az'
  | 'eu'
  | 'be'
  | 'bn'
  | 'bs'
  | 'br'
  | 'bg'
  | 'ca'
  | 'ckb'
  | 'zh'
  | 'zh-HK'
  | 'zh-CN'
  | 'zh-TW'
  | 'co'
  | 'hr'
  | 'cs'
  | 'da'
  | 'nl'
  | 'en'
  | 'en-AU'
  | 'en-CA'
  | 'en-IN'
  | 'en-NZ'
  | 'en-ZA'
  | 'en-GB'
  | 'en-US'
  | 'eo'
  | 'et'
  | 'fo'
  | 'fil'
  | 'fi'
  | 'fr'
  | 'fr-CA'
  | 'fr-FR'
  | 'fr-CH'
  | 'gl'
  | 'ka'
  | 'de'
  | 'de-AT'
  | 'de-DE'
  | 'de-LI'
  | 'de-CH'
  | 'el'
  | 'gn'
  | 'gu'
  | 'ha'
  | 'haw'
  | 'he'
  | 'hi'
  | 'hu'
  | 'is'
  | 'id'
  | 'ia'
  | 'ga'
  | 'it'
  | 'it-IT'
  | 'it-CH'
  | 'ja'
  | 'kn'
  | 'kk'
  | 'km'
  | 'ko'
  | 'ku'
  | 'ky'
  | 'lo'
  | 'la'
  | 'lv'
  | 'ln'
  | 'lt'
  | 'mk'
  | 'ms'
  | 'ml'
  | 'mt'
  | 'mr'
  | 'mn'
  | 'ne'
  | 'no'
  | 'nb'
  | 'nn'
  | 'oc'
  | 'or'
  | 'om'
  | 'ps'
  | 'fa'
  | 'pl'
  | 'pt'
  | 'pt-BR'
  | 'pt-PT'
  | 'pa'
  | 'qu'
  | 'ro'
  | 'mo'
  | 'rm'
  | 'ru'
  | 'gd'
  | 'sr'
  | 'sh'
  | 'sn'
  | 'sd'
  | 'si'
  | 'sk'
  | 'sl'
  | 'so'
  | 'st'
  | 'es'
  | 'es-AR'
  | 'es-419'
  | 'es-MX'
  | 'es-ES'
  | 'es-US'
  | 'su'
  | 'sw'
  | 'sv'
  | 'tg'
  | 'ta'
  | 'tt'
  | 'te'
  | 'th'
  | 'ti'
  | 'to'
  | 'tr'
  | 'tk'
  | 'tw'
  | 'uk'
  | 'ur'
  | 'ug'
  | 'uz'
  | 'vi'
  | 'wa'
  | 'cy'
  | 'fy'
  | 'xh'
  | 'yi'
  | 'yo'
  | 'zu';

export function getLanguageLabel(langCode: LanguageCode | string): string {
  const languageMap: Record<LanguageCode, string> = {
    any: 'Any',
    af: 'Afrikaans',
    sq: 'Albanian',
    am: 'Amharic',
    ar: 'Arabic',
    an: 'Aragonese',
    hy: 'Armenian',
    ast: 'Asturian',
    az: 'Azerbaijani',
    eu: 'Basque',
    be: 'Belarusian',
    bn: 'Bengali',
    bs: 'Bosnian',
    br: 'Breton',
    bg: 'Bulgarian',
    ca: 'Catalan',
    ckb: 'Central Kurdish',
    zh: 'Chinese',
    'zh-HK': 'Chinese (Hong Kong)',
    'zh-CN': 'Chinese (Simplified)',
    'zh-TW': 'Chinese (Traditional)',
    co: 'Corsican',
    hr: 'Croatian',
    cs: 'Czech',
    da: 'Danish',
    nl: 'Dutch',
    en: 'English',
    'en-AU': 'English (Australia)',
    'en-CA': 'English (Canada)',
    'en-IN': 'English (India)',
    'en-NZ': 'English (New Zealand)',
    'en-ZA': 'English (South Africa)',
    'en-GB': 'English (United Kingdom)',
    'en-US': 'English (United States)',
    eo: 'Esperanto',
    et: 'Estonian',
    fo: 'Faroese',
    fil: 'Filipino',
    fi: 'Finnish',
    fr: 'French',
    'fr-CA': 'French (Canada)',
    'fr-FR': 'French (France)',
    'fr-CH': 'French (Switzerland)',
    gl: 'Galician',
    ka: 'Georgian',
    de: 'German',
    'de-AT': 'German (Austria)',
    'de-DE': 'German (Germany)',
    'de-LI': 'German (Liechtenstein)',
    'de-CH': 'German (Switzerland)',
    el: 'Greek',
    gn: 'Guarani',
    gu: 'Gujarati',
    ha: 'Hausa',
    haw: 'Hawaiian',
    he: 'Hebrew',
    hi: 'Hindi',
    hu: 'Hungarian',
    is: 'Icelandic',
    id: 'Indonesian',
    ia: 'Interlingua',
    ga: 'Irish',
    it: 'Italian',
    'it-IT': 'Italian (Italy)',
    'it-CH': 'Italian (Switzerland)',
    ja: 'Japanese',
    kn: 'Kannada',
    kk: 'Kazakh',
    km: 'Khmer',
    ko: 'Korean',
    ku: 'Kurdish',
    ky: 'Kyrgyz',
    lo: 'Lao',
    la: 'Latin',
    lv: 'Latvian',
    ln: 'Lingala',
    lt: 'Lithuanian',
    mk: 'Macedonian',
    ms: 'Malay',
    ml: 'Malayalam',
    mt: 'Maltese',
    mr: 'Marathi',
    mn: 'Mongolian',
    ne: 'Nepali',
    no: 'Norwegian',
    nb: 'Norwegian Bokmål',
    nn: 'Norwegian Nynorsk',
    oc: 'Occitan',
    or: 'Oriya',
    om: 'Oromo',
    ps: 'Pashto',
    fa: 'Persian',
    pl: 'Polish',
    pt: 'Portuguese',
    'pt-BR': 'Portuguese (Brazil)',
    'pt-PT': 'Portuguese (Portugal)',
    pa: 'Punjabi',
    qu: 'Quechua',
    ro: 'Romanian',
    mo: 'Romanian (Moldova)',
    rm: 'Romansh',
    ru: 'Russian',
    gd: 'Scottish Gaelic',
    sr: 'Serbian',
    sh: 'Serbo',
    sn: 'Shona',
    sd: 'Sindhi',
    si: 'Sinhala',
    sk: 'Slovak',
    sl: 'Slovenian',
    so: 'Somali',
    st: 'Southern Sotho',
    es: 'Spanish',
    'es-AR': 'Spanish (Argentina)',
    'es-419': 'Spanish (Latin America)',
    'es-MX': 'Spanish (Mexico)',
    'es-ES': 'Spanish (Spain)',
    'es-US': 'Spanish (United States)',
    su: 'Sundanese',
    sw: 'Swahili',
    sv: 'Swedish',
    tg: 'Tajik',
    ta: 'Tamil',
    tt: 'Tatar',
    te: 'Telugu',
    th: 'Thai',
    ti: 'Tigrinya',
    to: 'Tongan',
    tr: 'Turkish',
    tk: 'Turkmen',
    tw: 'Twi',
    uk: 'Ukrainian',
    ur: 'Urdu',
    ug: 'Uyghur',
    uz: 'Uzbek',
    vi: 'Vietnamese',
    wa: 'Walloon',
    cy: 'Welsh',
    fy: 'Western Frisian',
    xh: 'Xhosa',
    yi: 'Yiddish',
    yo: 'Yoruba',
    zu: 'Zulu',
  };

  return languageMap[langCode];
}
