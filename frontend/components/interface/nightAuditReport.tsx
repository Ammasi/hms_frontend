export type NightAuditCustomer = {
  customerName: string;
  customerAddress: string;
  customerId: string;
  mobileNumber: string;
  customerEmail: string;
  totalGuests: string;
  checkInDate: string;
  checkOutDate: string;
  expectedCheckOutDate: string;
  graceTime: string;
};

export  type NightAuditResponse = {
  date: string;  
  totalCheckouts: number;
  customers: NightAuditCustomer[];
};