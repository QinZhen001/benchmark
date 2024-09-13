const PREFIX_URL = "https://stt-benchmark-service.la3.agoralab.co/v1/"

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


export const apiCommitSpeechmaticsTask = ({ operatingPoint, fileUrl, language }: {
  operatingPoint: OperatingPoint
  fileUrl: string
  language: string
}) => {
  const url = `${PREFIX_URL}/stt/speechmatics`
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      operatingPoint,
      fileUrl,
      language
    })
  })
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
  const res = await response.json()
  return res.data
}


export const apiCommitAzureTask = ({ locale, fileUrl }: {
  fileUrl: string
  locale: string
}) => {
  const url = `${PREFIX_URL}/stt/azure`
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      fileUrl,
      locale
    })
  })
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
  const res = await response.json()
  return res.data
}


export const apiGetAutoLanguages = async () => {
  const url = `${PREFIX_URL}/stt/speechmatics/discovery/features`
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  })
  const res = await response.json()
  return res.data
}
