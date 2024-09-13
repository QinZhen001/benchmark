import { useState, useMemo } from "react";
import { getCurrentDate, useAppSelector, LANGUAGE_OPTIONS, useAppDispatch } from "../../common";
import { setState, reset } from "../../store/reducers/global";
import { IResult, State, TransformStatus } from "../../types"
import { Spin } from 'antd';


import "./index.css"

const currentDate = getCurrentDate();

const mockData: IResult[] = [
  {
    engineName: "SuntownEnhance",
    status: "Running",
    duration: 0
  },
  {
    engineName: "SuntownStandard",
    status: "Succeeded",
    duration: 1
  },
  {
    engineName: "Azure",
    status: "Succeeded",
    duration: 0
  },
  {
    engineName: "Sonix",
    status: "Succeeded",
    duration: 10
  }
]

const Result = () => {
  const dispatch = useAppDispatch();
  const fileName = useAppSelector((state) => state.global.fileName);
  const language = useAppSelector((state) => state.global.language);
  const [resultList, setResultList] = useState<IResult[]>(mockData)

  // useEffect(() => {
  //   if (fileName && language) {

  //   }
  // }, [fileName, language])

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

  const onClickPrev = () => {
    dispatch(setState(State.Selecting))
  }

  const onClickInit = () => {
    dispatch(reset())
  }


  const onClickItem = (item: IResult) => {
    if (item.status !== "Succeeded") {
      return
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
          <div className="result-top-duration result-item-duration">{item.duration ? item.duration + 's' : "-"}</div>
          <div className={`result-top-transcription result-item-btn ${item.status !== 'Succeeded' ? 'result-item-btn__disable' : ''}`} onClick={() => onClickItem(item)}>Download</div>
        </div>
      })
    }
    <div className="result-status">
      Status: Loading file to STT engine(other statuss:Language Detecting,Transcribing,Done)
    </div>
    <div className="my-select-button">
      <div className="my-select-button-left" onClick={onClickPrev}>上一步</div>
      <div className="my-select-button-right" onClick={onClickInit}>重新执行</div>
    </div>
  </div>
}


export default Result
