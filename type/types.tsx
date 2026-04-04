 export type ProjectDetail = {
  id: number,
  projectId: string,
  deviceType: string,
  userInput: string | null,
  createdOn: string | null,
  projectName: string | null,
  theme: string | null,
  projectVisualDescription: string | null,
 }

 export type ScreenConfig = {
  id: number,
  projectId: string | null,
  screenId: string | null,
  screenName: string | null,
  purpose: string | null,
  screenDescription: string | null,
  code: string | null,
 }

export type ScreenConfig = {
  id: number,
  screenId: string,
  screenName: string,
  purpose: string,
  screenDescription: string,
  code?: string,
}
