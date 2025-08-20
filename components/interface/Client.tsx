export type ClientList = {
  id: string;
  companyName: string;
  clientName: string;
  clientEmail: string;
  clientMobileNo: string;
  gst: string;
  currency: string;
  subscription: string;
  subscriptionStatus: string;
  subscriptionStartDate: string;
  subscriptionEndDate: string;
  clientAddress: string;
  clientDocuments: File[] | string[];
  status: string;
  noOfHotels: number;
  subscriptionDuration: string;
  propertyCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  existingImages: string[];
};



export  type ClientAddData = {
  id?: string | number;
  companyName: string;
  clientName: string;
  clientEmail: string;
  clientMobileNo: string;
  gst: string;
  currency: string;
  subscription: string;
  subscriptionStatus: string;
  subscriptionStartDate: string;
  subscriptionEndDate: string;
  clientAddress: string;
  clientDocuments: File[] | string[];
  status: string;
  noOfHotels: number;
  subscriptionDuration: string;
  propertyCount: number;
  isActive: boolean;
  subscripton?: string;
  subscriptonStatus?: string;
  subscriptonEndDate?: string;
  subscriptonDuration?: string;
};