import { useState, useMemo, useEffect } from "react";
import {
  getCurrentDate, useAppSelector, LANGUAGE_OPTIONS,
  useAppDispatch,
  downloadText, formatTime,
  apiCommitEngine1Task,
  apiCommitEngine2Task,
  apiCommitEngine3Task,
  apiDownloadEngine1Task,
  apiDownloadEngine2Task,
  apiDownloadEngine3Task,
  apiGetEngine1TaskStatus,
  apiGetEngine2TaskStatus,
  apiGetEngine3TaskStatus,
} from "../../common";
import { setState, reset } from "../../store/reducers/global";
import { IResult, State, TransformStatus } from "../../types"
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
  return formatTime(Math.floor((result.endTime - result.startTime) / 1000))
}

const getInitResultList = (): IResult[] => {
  return [{
    engineName: "Engine 1",
    status: "Running",
    startTime: Date.now(),
  }, {
    engineName: "Engine 2",
    status: "Running",
    startTime: Date.now(),
  }, {
    engineName: "Engine 3",
    status: "Running",
    startTime: Date.now(),
  }]
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
    const list = getInitResultList()
    setResultList(getInitResultList())
    const jobIds: string[] = []
    for (let i = 0; i < list.length; i++) {
      const data = {
        fileUrl,
        language
      }
      const res = await commitTask(i + 1, data)
      if (res.jobId) {
        jobIds[i] = res.jobId
      }
    }
    setResultList((list) => {
      return list.map((item, index) => {
        return {
          ...item,
          jobId: jobIds[index]
        }
      })
    })
  }

  const commitTask = async (index: number, data: any) => {
    if (index == 1) {
      return await apiCommitEngine1Task(data)
    } else if (index == 2) {
      return await apiCommitEngine2Task(data)
    } else if (index == 3) {
      return await apiCommitEngine3Task(data)
    }
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
      case "Engine 1":
        if (item.jobId) {
          data = await apiDownloadEngine1Task(item.jobId)
          downloadText(data, `${fileName}_engine1_${item.jobId}.txt`)
        }
        break;
      case "Engine 2":
        if (item.jobId) {
          data = await apiDownloadEngine2Task(item.jobId)
          downloadText(data, `${fileName}_engine2_${item.jobId}.txt`)
        }
        break;
      case "Engine 3":
        if (item.jobId) {
          data = await apiDownloadEngine3Task(item.jobId)
          if (item.jobId.length > 10) {
            downloadText(data, `${fileName}_engine3_${item.jobId.slice(-10)}.txt`)
          } else {
            downloadText(data, `${fileName}_engine3_${item.jobId}.txt`)
          }
        }
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
          case "Engine 1":
            if (item.jobId && item.status === "Running") {
              data = await apiGetEngine1TaskStatus(item.jobId)
              const status = data.status
              if (status) {
                updateResultItem("Engine 1", {
                  status: status,
                  endTime: status != "Running" ? time : undefined
                })
              }
            }
            break;
          case "Engine 2":
            if (item.jobId && item.status === "Running") {
              data = await apiGetEngine2TaskStatus(item.jobId)
              const status = data.status
              if (status) {
                updateResultItem("Engine 2", {
                  status: status,
                  endTime: status != "Running" ? time : undefined
                })
              }
            }
            break;
          case "Engine 3":
            if (item.jobId && item.status === "Running") {
              data = await apiGetEngine3TaskStatus(item.jobId)
              const status = data.status
              if (status) {
                updateResultItem("Engine 3", {
                  status: status,
                  endTime: status != "Running" ? time : undefined
                })
              }
            }
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
      Status: Loading file to STT engine(other status:Language Detecting,Transcribing,Done)
    </div>
    <div className="my-select-button">
      <div className="my-select-button-left" onClick={onClickPrev}>Previous Step</div>
      <div className="my-select-button-right" onClick={onClickInit}>Execute Again</div>
    </div>
  </div>
}


export default Result
