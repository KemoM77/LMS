import React from 'react';

import { Option, Select } from '@material-tailwind/react';

export default function LanguagesDropdown({onChange ,value = 'en' }) {
  return (
    <Select onChange={(value) => onChange(value)} value={value} className="form-select bg-white" id="languages" name="languages">
    <Option value="any">Any Language</Option>
    <Option value="af">Afrikaans</Option>
    <Option value="sq">Albanian</Option>
    <Option value="am">Amharic</Option>
    <Option value="ar">Arabic</Option>
    <Option value="an">Aragonese</Option>
    <Option value="hy">Armenian</Option>
    <Option value="ast">Asturian</Option>
    <Option value="az">Azerbaijani</Option>
    <Option value="eu">Basque</Option>
    <Option value="be">Belarusian</Option>
    <Option value="bn">Bengali</Option>
    <Option value="bs">Bosnian</Option>
    <Option value="br">Breton</Option>
    <Option value="bg">Bulgarian</Option>
    <Option value="ca">Catalan</Option>
    <Option value="ckb">Central Kurdish</Option>
    <Option value="zh">Chinese</Option>
    <Option value="zh-HK">Chinese (Hong Kong)</Option>
    <Option value="zh-CN">Chinese (Simplified)</Option>
    <Option value="zh-TW">Chinese (Traditional)</Option>
    <Option value="co">Corsican</Option>
    <Option value="hr">Croatian</Option>
    <Option value="cs">Czech</Option>
    <Option value="da">Danish</Option>
    <Option value="nl">Dutch</Option>
    <Option value="en">English</Option>
    <Option value="en-AU">English (Australia)</Option>
    <Option value="en-CA">English (Canada)</Option>
    <Option value="en-IN">English (India)</Option>
    <Option value="en-NZ">English (New Zealand)</Option>
    <Option value="en-ZA">English (South Africa)</Option>
    <Option value="en-GB">English (United Kingdom)</Option>
    <Option value="en-US">English (United States)</Option>
    <Option value="eo">Esperanto</Option>
    <Option value="et">Estonian</Option>
    <Option value="fo">Faroese</Option>
    <Option value="fil">Filipino</Option>
    <Option value="fi">Finnish</Option>
    <Option value="fr">French</Option>
    <Option value="fr-CA">French (Canada)</Option>
    <Option value="fr-FR">French (France)</Option>
    <Option value="fr-CH">French (Switzerland)</Option>
    <Option value="gl">Galician</Option>
    <Option value="ka">Georgian</Option>
    <Option value="de">German</Option>
    <Option value="de-AT">German (Austria)</Option>
    <Option value="de-DE">German (Germany)</Option>
    <Option value="de-LI">German (Liechtenstein)</Option>
    <Option value="de-CH">German (Switzerland)</Option>
    <Option value="el">Greek</Option>
    <Option value="gn">Guarani</Option>
    <Option value="gu">Gujarati</Option>
    <Option value="ha">Hausa</Option>
    <Option value="haw">Hawaiian</Option>
    <Option value="he">Hebrew</Option>
    <Option value="hi">Hindi</Option>
    <Option value="hu">Hungarian</Option>
    <Option value="is">Icelandic</Option>
    <Option value="id">Indonesian</Option>
    <Option value="ia">Interlingua</Option>
    <Option value="ga">Irish</Option>
    <Option value="it">Italian</Option>
    <Option value="it-IT">Italian (Italy)</Option>
    <Option value="it-CH">Italian (Switzerland)</Option>
    <Option value="ja">Japanese</Option>
    <Option value="kn">Kannada</Option>
    <Option value="kk">Kazakh</Option>
    <Option value="km">Khmer</Option>
    <Option value="ko">Korean</Option>
    <Option value="ku">Kurdish</Option>
    <Option value="ky">Kyrgyz</Option>
    <Option value="lo">Lao</Option>
    <Option value="la">Latin</Option>
    <Option value="lv">Latvian</Option>
    <Option value="ln">Lingala</Option>
    <Option value="lt">Lithuanian</Option>
    <Option value="mk">Macedonian</Option>
    <Option value="ms">Malay</Option>
    <Option value="ml">Malayalam</Option>
    <Option value="mt">Maltese</Option>
    <Option value="mr">Marathi</Option>
    <Option value="mn">Mongolian</Option>
    <Option value="ne">Nepali</Option>
    <Option value="no">Norwegian</Option>
    <Option value="nb">Norwegian Bokmål</Option>
    <Option value="nn">Norwegian Nynorsk</Option>
    <Option value="oc">Occitan</Option>
    <Option value="or">Oriya</Option>
    <Option value="om">Oromo</Option>
    <Option value="ps">Pashto</Option>
    <Option value="fa">Persian</Option>
    <Option value="pl">Polish</Option>
    <Option value="pt">Portuguese</Option>
    <Option value="pt-BR">Portuguese (Brazil)</Option>
    <Option value="pt-PT">Portuguese (Portugal)</Option>
    <Option value="pa">Punjabi</Option>
    <Option value="qu">Quechua</Option>
    <Option value="ro">Romanian</Option>
    <Option value="mo">Romanian (Moldova)</Option>
    <Option value="rm">Romansh</Option>
    <Option value="ru">Russian</Option>
    <Option value="gd">Scottish Gaelic</Option>
    <Option value="sr">Serbian</Option>
    <Option value="sh">Serbo</Option>
    <Option value="sn">Shona</Option>
    <Option value="sd">Sindhi</Option>
    <Option value="si">Sinhala</Option>
    <Option value="sk">Slovak</Option>
    <Option value="sl">Slovenian</Option>
    <Option value="so">Somali</Option>
    <Option value="st">Southern Sotho</Option>
    <Option value="es">Spanish</Option>
    <Option value="es-AR">Spanish (Argentina)</Option>
    <Option value="es-419">Spanish (Latin America)</Option>
    <Option value="es-MX">Spanish (Mexico)</Option>
    <Option value="es-ES">Spanish (Spain)</Option>
    <Option value="es-US">Spanish (United States)</Option>
    <Option value="su">Sundanese</Option>
    <Option value="sw">Swahili</Option>
    <Option value="sv">Swedish</Option>
    <Option value="tg">Tajik</Option>
    <Option value="ta">Tamil</Option>
    <Option value="tt">Tatar</Option>
    <Option value="te">Telugu</Option>
    <Option value="th">Thai</Option>
    <Option value="ti">Tigrinya</Option>
    <Option value="to">Tongan</Option>
    <Option value="tr">Turkish</Option>
    <Option value="tk">Turkmen</Option>
    <Option value="tw">Twi</Option>
    <Option value="uk">Ukrainian</Option>
    <Option value="ur">Urdu</Option>
    <Option value="ug">Uyghur</Option>
    <Option value="uz">Uzbek</Option>
    <Option value="vi">Vietnamese</Option>
    <Option value="wa">Walloon</Option>
    <Option value="cy">Welsh</Option>
    <Option value="fy">Western Frisian</Option>
    <Option value="xh">Xhosa</Option>
    <Option value="yi">Yiddish</Option>
    <Option value="yo">Yoruba</Option>
    <Option value="zu">Zulu</Option>
</Select>
  )
}
