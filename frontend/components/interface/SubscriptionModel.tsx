import { ReactNode } from "react";

export type SubscriptionModelData = {
  id: string;
  clientId: string;
  propertyId: string;
  planDefaultName: string;
  planCustomName: string;
  price: number;
  duration: string;
  noOfProperty: number;
  noOfFloors: number[];
  noOfRooms: number[];
  noOfRoomTypes: string[];
  noOfReportTypes: string[];
  noOfStatus?: string[];
  noOfCall?: string[];
  noOfNotification: string[];
  priority?: ReactNode;
  deadline?: string;
};
 
export type FlatStatusMessage = {
  id: string;
  defaultStatusName: string;
  customStatusName?: string;
  isEnableOrDisable: boolean;
};
export interface FlatCallMessage {
  id: string;
  defaultCallName: string;
  customCallName: string;
  isEnableOrDisable: boolean;
}
export interface FlatNotificationMessage {
  id: string;
  defaultNotificationName: string;
  customNotificationName: string;
  isEnableOrDisable: boolean;
}