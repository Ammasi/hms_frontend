export interface   NotificationRow {
  id?: string;
  defaultNotificationName: string;
  customNotificationName: string;
  defaultActionName: string;
  customActionName: string;
  isEnableOrDisable: boolean;
  noOfTypes?: number;
}