import { useAppSelector, getCurrentDate, useAppDispatch } from "../../common";
import { setState } from "../../store/reducers/global";
import { Select, message } from 'antd';
import { LANGUAGE_OPTIONS } from "../../common";
import { State } from "../../types";
import { setLanguage } from "../../store/reducers/global";
import "./index.css"

const currentDate = getCurrentDate();




const MySelect = () => {
  const dispatch = useAppDispatch();
  const language = useAppSelector((state) => state.global.language);
  const fileName = useAppSelector((state) => state.global.fileName);

  const onClickPrev = () => {
    dispatch(setState(State.Uploading))
  }

  const onClickNext = () => {
    if (!language) {
      return message.error("Please select a language")
    }
    dispatch(setState(State.Transcribing))
  }

  const handleSelectChange = (lang: string) => {
    dispatch(setLanguage(lang))
  }

  return <div className="my-select">
    <div className="my-select-top-text">
      {`${currentDate.year}-${currentDate.month}-${currentDate.day}`}
      <span className="my-select-top-text-filename">{fileName}，</span>
      <span className="my-select-top-text-success">上传成功</span>
    </div>
    <div className="my-select-center">
      <div className="my-select-center-text">
        Select Transcription Language
      </div>
      <div>
        <Select
          style={{ width: "100%", height: "40px" }}
          onChange={handleSelectChange}
          options={LANGUAGE_OPTIONS}></Select>
      </div>
    </div>
    <div className="my-select-button">
      <div className="my-select-button-left" onClick={onClickPrev}>上一步</div>
      <div className="my-select-button-right" onClick={onClickNext}>下一步</div>
    </div>
  </div>
}


export default MySelect;
