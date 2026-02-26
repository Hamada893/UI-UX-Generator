import { createContext, type Dispatch, type SetStateAction } from "react";

export type UserDetail = {
  id: number;
  name: string;
  email: string;
  credits: number;
} | null;

export type UserDetailContextValue = {
  userDetail: UserDetail;
  setUserDetail: Dispatch<SetStateAction<UserDetail>>;
} | null

export const UserDetailContext = createContext<UserDetailContextValue>(null)
