import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { State } from "../../types"

export interface InitialState {
  state: State
  fileName: string
  language: string
}

const getInitialState = (): InitialState => {
  return {
    state: State.Transcribing,
    fileName: "xxxx.mp3",
    language: "auto",
  } as InitialState
}

export const globalSlice = createSlice({
  name: "global",
  initialState: getInitialState(),
  reducers: {
    // setAgoraTokens: (
    //   state,
    //   action: PayloadAction<Partial<{ rtmToken: string; rtcToken: string }>>,
    // ) => {
    //   const payload = action.payload
    //   const { rtcToken = "", rtmToken = "" } = payload
    //   if (rtcToken) {
    //     state.agoraTokens.rtcToken = rtcToken
    //   }
    //   if (rtmToken) {
    //     state.agoraTokens.rtmToken = rtmToken
    //   }
    // },
    setState: (state, action: PayloadAction<State>) => {
      state.state = action.payload
    },
    setFileName: (state, action: PayloadAction<string>) => {
      state.fileName = action.payload
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload
    },
    reset: (state) => {
      Object.assign(state, getInitialState())
    },
  },
})

export const { reset, setState, setFileName, setLanguage } =
  globalSlice.actions

export default globalSlice.reducer
