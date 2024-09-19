export type TransformStatus = "Failed" | "Running" | "Succeeded" |
  "Rejected" | "Deleted" | "Expired" | "NotStarted"

export enum State {
  Uploading,
  Selecting,
  Transcribing
}


// export enum Engine {
//   SuntownEnhance = "SuntownEnhance",
//   SuntownStandard = "SuntownStandard",
//   Azure = "Azure",
//   Sonix = "Sonix"
// }


export interface IResult {
  engineName: string
  status: TransformStatus,
  startTime?: number,
  endTime?: number,
  jobId?: string
}
