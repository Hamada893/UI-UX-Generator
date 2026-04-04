 export type ProjectDetail = {
  id: number,
  projectId: string,
  deviceType: string,
  userInput: string,
  createdOn: Date,
  projectName?: string,
  theme?: string,
 }

 export type ScreenConfig = {
  id: number,
  screenId: string,
  screenName: string,
  purpose: string,
  screenDescription: string,
  code: string,
 }

export type ScreenConfig = {
  id: number,
  screenId: string,
  screenName: string,
  purpose: string,
  screenDescription: string,
  code?: string,
}
