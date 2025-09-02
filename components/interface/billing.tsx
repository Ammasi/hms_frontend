export type BillingInfo = {
  id: string;
  clientId: string;
  propertyId: string;
  hotelDetails: {
    hotelName: string;
    hotelAddress: string;
    hotelMobileNo: string;
    gstin: string;
    hsnCode: string;
  };
  invoiceDetails: {
    clientId: string;
    propertyId: string;
    invoiceNumber: string;
    invoiceDate: string;
    paymentType: string;
  };
  customerDetails: {
    customerName: string;
    contactNumber: string;
  };
  stayDetails: {
    roomNo: string;
    roomType: string;
    checkinDate: string;
    checkoutDate: string;
  };
  extraServices: { serviceName: string; hsncode: string; amount: string }[];
  amountDetails: {
    subtotal: number;
    cgst: number;
    sgst: number;
    igst: number;
    discount: number;
    paidAmount: number;
    grandTotal: number;
    amountInWords: string;
  };
}; 
export interface ExtraService {
  serviceName: string;
  hsncode: string;
  amount: string;
}

export interface BillingFormData {
  hotelDetails: {
    hotelName: string;
    hotelAddress: string;
    hotelMobileNo: string;
    gstin: string;
    hsnCode: string;
  };
  invoiceDetails: {
    clientId: string;
    propertyId: string;
    invoiceNumber: string;
    invoiceDate: string;
    paymentType: string;
  };
  customerDetails: {
    customerName: string;
    contactNumber: string;
  };
  stayDetails: {
    roomNo: string;
    roomType: string;
    checkinDate: string;
    checkoutDate: string;
  };
  extraServices: ExtraService[];
  amountDetails: {
    subtotal: string;
    cgst: string;
    sgst: string;
    igst: string;
    discount: string;
    paidAmount: string;
    grandTotal: string;
    amountInWords: string;
  };
}

 

 
