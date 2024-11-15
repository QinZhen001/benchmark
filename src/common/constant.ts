// https://confluence.agoralab.co/pages/viewpage.action?spaceKey=PM&title=Multi-Language+List

export const LANGUAGE_OPTIONS = [
  // { label: "Auto", value: "auto" },
  { label: "Tamil", value: "ta-IN", code: "ta" },
  { label: "Dutch", value: "nl-NL", code: "nl" },
  { label: "Thai", value: "th-TH", code: "th" },
  { label: "Vietnamese", value: "vi-VN", code: "vi" },
  { label: "Turkish", value: "tr-TR", code: "tr" },
  { label: "Russian", value: "ru-RU", code: "ru" },
  { label: "Malay", value: "ms-MY", code: "ms" },
  { label: "Chinese(HK)", value: "zh-HK", code: "yue" },
  { label: "Indonesian", value: "id-ID", code: "id" },
  { label: "Arabic(JO)", value: "ar-JO", code: "ar" },
  { label: "Arabic(EG)", value: "ar-EG", code: "ar" },
  { label: "Arabic(SA)", value: "ar-SA", code: "ar" },
  { label: "Arabic(UAE)", value: "ar-AE", code: "ar" },
  { label: "English", value: "en-US", code: "en" },
  { label: "Hindi", value: "hi-IN", code: "hi" },
  { label: "Korean", value: "ko-KR", code: "ko" },
  { label: "Japanese", value: "ja-JP", code: "ja" },
  { label: "German", value: "de-DE", code: "de" },
  { label: "Spanish", value: "es-ES", code: "es" },
  { label: "French", value: "fr-FR", code: "fr" },
  { label: "Italian", value: "it-IT", code: "it" },
  { label: "Chinese", value: "zh-CN", code: "cmn" },
  { label: "Portuguese", value: "pt-PT", code: "pt" },
].sort((a, b) => {
  return a.label.localeCompare(b.label)
})
