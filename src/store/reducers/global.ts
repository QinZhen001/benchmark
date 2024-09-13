import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { State } from "../../types"

export interface InitialState {
  state: State
  fileName: string
  language: string
  fileUrl: string
}

const getInitialState = (): InitialState => {
  return {
    state: State.Uploading,
    fileName: "",
    fileUrl: "",
    language: "",
  } as InitialState
}

const getTestState = (): InitialState => {
  return {
    state: State.Transcribing,
    fileName: "Edu-sample-lesson_out_1.mp3",
    fileUrl: "https://agora-offline-stt.s3.us-east-1.amazonaws.com/1726212645144_Edu-sample-lesson_out_1.mp3",
    language: "auto",
  }
}

export const globalSlice = createSlice({
  name: "global",
  initialState: getInitialState(),
  // initialState: getTestState(),
  reducers: {
    setState: (state, action: PayloadAction<State>) => {
      state.state = action.payload
    },
    setFileName: (state, action: PayloadAction<string>) => {
      state.fileName = action.payload
    },
    setFileUrl: (state, action: PayloadAction<string>) => {
      state.fileUrl = action.payload
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload
    },
    reset: (state) => {
      Object.assign(state, getInitialState())
    },
  },
})

export const { reset, setState, setFileName, setLanguage, setFileUrl } =
  globalSlice.actions

export default globalSlice.reducer
