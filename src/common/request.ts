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


// ----------- engine1 -----------------
export const apiCommitEngine1Task = async ({ fileUrl, language }: {
  fileUrl: string
  language: string
}) => {
  const url = `${PREFIX_URL}/stt/engine1`
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
      operatingPoint: "enhanced",
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


export const apiGetEngine1TaskStatus = async (jobId: string) => {
  const url = `${PREFIX_URL}/stt/engine1/${jobId}`
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  })
  const res = await response.json()
  return res.data
}


export const apiDownloadEngine1Task = async (jobId: string) => {
  const url = `${PREFIX_URL}/stt/engine1/${jobId}/file`
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  })
  const text = await response.text();
  return text
}


// ----------- engine2 -----------------

export const apiCommitEngine2Task = async ({ fileUrl, language }: {
  fileUrl: string
  language: string
}) => {
  const url = `${PREFIX_URL}/stt/engine2`
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
      operatingPoint: "standard",
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


export const apiGetEngine2TaskStatus = async (jobId: string) => {
  const url = `${PREFIX_URL}/stt/engine2/${jobId}`
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  })
  const res = await response.json()
  return res.data
}


export const apiDownloadEngine2Task = async (jobId: string) => {
  const url = `${PREFIX_URL}/stt/engine2/${jobId}/file`
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  })
  const text = await response.text();
  return text
}


// ----------- engine3 -----------------
export const apiCommitEngine3Task = async ({ language, fileUrl }: {
  fileUrl: string
  language: string
}) => {
  const url = `${PREFIX_URL}/stt/engine3`
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      fileUrl,
      locale: language
    })
  })
  const res = await response.json()
  if (res.code != 200) {
    message.error(res.message)
    throw new Error(res.message)
  }
  return res.data
}


export const apiGetEngine3TaskStatus = async (jobId: string) => {
  const url = `${PREFIX_URL}/stt/engine3/${jobId}`
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  })
  const res = await response.json()
  return res.data
}


export const apiDownloadEngine3Task = async (jobId: string) => {
  const url = `${PREFIX_URL}/stt/engine3/${jobId}/file`
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
