import { message } from "antd"
import { LANGUAGE_OPTIONS } from "./constant"

const PREFIX_URL = "https://stt-benchmark-service.la3.agoralab.co/v1"

type OperatingPoint = "enhanced" | "standard"

export const apiGetOSSToken = async () => {
  const url = `${PREFIX_URL}/oss/sts`
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }
  })
  const res = await response.json()
  if (res.code != 200) {
    throw new Error(res.message)
  }
  return res.data
}


export const apiCommitSpeechmaticsTask = async ({ operatingPoint, fileUrl, language }: {
  operatingPoint: OperatingPoint
  fileUrl: string
  language: string
}) => {
  const url = `${PREFIX_URL}/stt/speechmatics`
  let finLangCode = ""
  if (language == "auto") {
    finLangCode = language
  } else {
    finLangCode = LANGUAGE_OPTIONS.find(item => item.value == language)?.code ?? ""
  }
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      operatingPoint,
      fileUrl,
      language: finLangCode
    })
  })
  const res = await response.json()
  if (res.code != 200) {
    message.error(res.message)
    throw new Error(res.message)
  }
  return res.data
}


export const apiGetSpeechmaticsTaskStatus = async (jobId: string) => {
  const url = `${PREFIX_URL}/stt/speechmatics/${jobId}`
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  })
  const res = await response.json()
  return res.data
}


export const apiDownloadSpeechmaticsTask = async (jobId: string) => {
  const url = `${PREFIX_URL}/stt/speechmatics/${jobId}/file`
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  })
  const text = await response.text();
  return text
}


export const apiCommitAzureTask = async ({ locale, fileUrl }: {
  fileUrl: string
  locale: string
}) => {
  const url = `${PREFIX_URL}/stt/azure`
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      fileUrl,
      locale
    })
  })
  const res = await response.json()
  if (res.code != 200) {
    message.error(res.message)
    throw new Error(res.message)
  }
  return res.data
}


export const apiGetAzureTaskStatus = async (jobId: string) => {
  const url = `${PREFIX_URL}/stt/azure/${jobId}`
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  })
  const res = await response.json()
  return res.data
}


export const apiDownloadAzureTask = async (jobId: string) => {
  const url = `${PREFIX_URL}/stt/azure/${jobId}/file`
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  })
  const text = await response.text();
  return text
}


// export const apiGetAutoLanguages = async () => {
//   const url = `${PREFIX_URL}/stt/speechmatics/discovery/features`
//   const response = await fetch(url, {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json',
//     }
//   })
//   const res = await response.json()
//   return res.data
// }
