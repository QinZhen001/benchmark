import { useState, useMemo, useEffect } from "react";
import {
  getCurrentDate, useAppSelector, LANGUAGE_OPTIONS,
  useAppDispatch, langToEngineList, apiCommitSpeechmaticsTask,
  apiCommitAzureTask, apiGetSpeechmaticsTaskStatus,
  apiGetAzureTaskStatus, apiDownloadAzureTask, apiDownloadSpeechmaticsTask,
  downloadText
} from "../../common";
import { setState, reset } from "../../store/reducers/global";
import { Engine, IResult, State, TransformStatus } from "../../types"
import { Spin, message } from 'antd';

import "./index.css"

const currentDate = getCurrentDate();
let timer: any = null

const getTaskDuration = (result: IResult) => {
  if (!result.startTime || !result.endTime) {
    return "-"
  }
  if (result.endTime < result.startTime) {
    return "-"
  }
  return Math.floor((result.endTime - result.startTime) / 1000) + "s"
}

const Result = () => {
  const dispatch = useAppDispatch();
  const fileName = useAppSelector((state) => state.global.fileName);
  const fileUrl = useAppSelector((state) => state.global.fileUrl);
  const language = useAppSelector((state) => state.global.language);
  const [resultList, setResultList] = useState<IResult[]>([])

  useEffect(() => {
    if (fileUrl && language) {
      initResultList()
    }

  }, [fileUrl, language])

  const needSchedule = useMemo(() => {
    return resultList.some((item) => item.status === "Running")
  }, [resultList])

  const totalStatus: TransformStatus = useMemo(() => {
    for (let i = 0; i < resultList.length; i++) {
      if (resultList[i].status === "Failed") {
        return "Failed"
      } else if (resultList[i].status === "Running") {
        return "Running"
      }
    }

    return "Succeeded"

  }, [resultList])

  const targetLangLabel = useMemo(() => {
    return LANGUAGE_OPTIONS.find((item) => item.value === language)?.label
  }, [language])

  useEffect(() => {
    if (needSchedule) {
      startScheduleTaskList()
    }

    return () => {
      stopScheduleTaskList()
    }

  }, [needSchedule, resultList])

  const initResultList = async () => {
    const engineList = await langToEngineList(language)
    const resultList = engineList.map((engine) => {
      return {
        engineName: engine,
        status: "Running",
        duration: 0,
        startTime: Date.now(),
      } as IResult
    })
    setResultList(resultList)
    await startTaskList(engineList)
  }

  const startTaskList = async (engineList: Engine[]) => {
    engineList.forEach(async (engine) => {
      let data: any = null
      switch (engine) {
        case Engine.SuntownEnhance:
          data = await apiCommitSpeechmaticsTask({
            operatingPoint: "enhanced",
            fileUrl: fileUrl,
            language: language
          })
          if (data.jobId) {
            updateResultItem(Engine.SuntownEnhance, { jobId: data.jobId })
          }
          break;
        case Engine.SuntownStandard:
          data = await apiCommitSpeechmaticsTask({
            operatingPoint: "standard",
            fileUrl: fileUrl,
            language: language
          })
          if (data.jobId) {
            updateResultItem(Engine.SuntownStandard, { jobId: data.jobId })
          }
          break;
        case Engine.Azure:
          data = await apiCommitAzureTask({
            fileUrl: fileUrl,
            locale: language
          })
          if (data.jobId) {
            updateResultItem(Engine.Azure, { jobId: data.jobId })
          }
          break;
        case Engine.Sonix:
          break;
      }
    })
  }

  const updateResultItem = (engineName: string, data: Partial<IResult>) => {
    setResultList((list) => {
      return list.map((item) => {
        if (item.engineName === engineName) {
          return {
            ...item,
            ...data
          }
        }
        return item
      })
    })
  }

  const onClickPrev = () => {
    dispatch(setState(State.Selecting))
  }

  const onClickInit = () => {
    dispatch(reset())
  }


  const onClickItem = async (item: IResult) => {
    if (item.status !== "Succeeded") {
      return
    }
    let data = null
    switch (item.engineName) {
      case Engine.SuntownEnhance:
        if (item.jobId) {
          data = await apiDownloadSpeechmaticsTask(item.jobId)
          downloadText(data, `${fileName}_enhanced.txt`)
        }
        break;
      case Engine.SuntownStandard:
        if (item.jobId) {
          data = await apiDownloadSpeechmaticsTask(item.jobId)
          downloadText(data, `${fileName}_standard.txt`)
        }
        break;
      case Engine.Azure:
        if (item.jobId) {
          data = await apiDownloadAzureTask(item.jobId)
          downloadText(data, `${fileName}_azure.txt`)
        }
        break;
      case Engine.Sonix:
        break;
    }
  }


  const startScheduleTaskList = () => {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
    timer = setInterval(() => {
      let data: any = null
      resultList.forEach(async item => {
        const time = Date.now()
        switch (item.engineName) {
          case Engine.SuntownEnhance:
            if (item.jobId && item.status === "Running") {
              data = await apiGetSpeechmaticsTaskStatus(item.jobId)
              const status = data.status
              if (status) {
                updateResultItem(Engine.SuntownEnhance, {
                  status: status,
                  endTime: status != "Running" ? time : undefined
                })
              }
            }
            break;
          case Engine.SuntownStandard:
            if (item.jobId && item.status === "Running") {
              data = await apiGetSpeechmaticsTaskStatus(item.jobId)
              const status = data.status
              if (status) {
                updateResultItem(Engine.SuntownStandard, {
                  status: status,
                  endTime: status != "Running" ? time : undefined
                })
              }
            }
            break;
          case Engine.Azure:
            if (item.jobId && item.status === "Running") {
              data = await apiGetAzureTaskStatus(item.jobId)
              const status = data.status
              if (status) {
                updateResultItem(Engine.Azure, {
                  status: status,
                  endTime: status != "Running" ? time : undefined
                })
              }
            }
            break;
          case Engine.Sonix:
            break;
        }
      })
    }, 3000)
  }

  const stopScheduleTaskList = () => {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  return <div>
    <div className="result-text">
      {`${currentDate.year}-${currentDate.month}-${currentDate.day}`}
      <span className="result-text-filename">{fileName}, </span>
      <span>Transcription language setting: {targetLangLabel}</span>
    </div>
    <div className="result-top">
      <div className="result-top-engine"></div>
      <div className="result-top-status">Status: {totalStatus}</div>
      <div className="result-top-duration">Transcription Duration</div>
      <div className="result-top-transcription">Transcription</div>
    </div>
    {
      resultList.map((item, index) => {
        return <div key={index} className="result-item">
          <div className="result-top-engine result-item-engine">{item.engineName}</div>
          <div className="result-top-status result-item-status">{item.status}
            {item.status == "Running" ? <Spin size="small" style={{
              marginLeft: "8px"
            }}></Spin> : null}
          </div>
          <div className="result-top-duration result-item-duration">{getTaskDuration(item)}</div>
          <div className={`result-top-transcription result-item-btn ${item.status !== 'Succeeded' ? 'result-item-btn__disable' : ''}`} onClick={() => onClickItem(item)}>Download</div>
        </div>
      })
    }
    <div className="result-status">
      Status: Loading file to STT engine(other statuss:Language Detecting,Transcribing,Done)
    </div>
    <div className="my-select-button">
      <div className="my-select-button-left" onClick={onClickPrev}>Previous Step</div>
      <div className="my-select-button-right" onClick={onClickInit}>Execute Again</div>
    </div>
  </div>
}


export default Result
