export type TransformStatus = "Failed" | "Running" | "Succeeded" | "Rejected";

export enum State {
  Uploading,
  Selecting,
  Transcribing
}


export enum Engine {
  SuntownEnhance,
  SuntownStandard,
  Azure,
  Sonix
}


export interface IResult {
  engineName: string
  status: TransformStatus,
  duration: number,
}
