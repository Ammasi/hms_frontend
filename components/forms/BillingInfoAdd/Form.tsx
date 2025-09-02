'use client';
import { useEffect, useState } from 'react';
import { createBillingInfo, getBillingInfoById, updateBillingInfo } from '../../../lib/api';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { BillingFormData, ExtraService } from '../../interface/billing';
 

const initialForm: BillingFormData = {
  hotelDetails: { hotelName: '', hotelAddress: '', hotelMobileNo: '', gstin: '', hsnCode: '' },
  invoiceDetails: { clientId: '', propertyId: '', invoiceNumber: '', invoiceDate: '', paymentType: '' },
  customerDetails: { customerName: '', contactNumber: '' },
  stayDetails: { roomNo: '', roomType: '', checkinDate: '', checkoutDate: '' },
  extraServices: [],
  amountDetails: { subtotal: '', cgst: '', sgst: '', igst: '', discount: '', paidAmount: '', grandTotal: '', amountInWords: '' },
};

export default function BillingInfoAdd() {
  const { user } = useAuth();
  const [id, setId] = useState<string | null>(null);
    const router = useRouter();
  const [formData, setFormData] = useState<BillingFormData>({
    ...initialForm,
    invoiceDetails: {
      ...initialForm.invoiceDetails,
      clientId: user?.clientId || '',
      propertyId: user?.propertyId || '',
    },
  });
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const storedId = localStorage.getItem('editBillingId');
    if (storedId) {
      setId(storedId);
      localStorage.removeItem('editBillingId');

      (async () => {
        try {
          const res = await getBillingInfoById(storedId);


          const formatDate = (dateString: string | undefined) => {
            if (!dateString) return '';
            const d = new Date(dateString);
            if (isNaN(d.getTime())) return ''; // invalid date guard
            return d.toISOString().split('T')[0];
          };

          const formattedData = {
            ...res,
            invoiceDetails: {
              ...res.invoiceDetails,
              invoiceDate: formatDate(res.invoiceDetails?.invoiceDate),
            },
            stayDetails: {
              ...res.stayDetails,
              checkinDate: formatDate(res.stayDetails?.checkinDate),
              checkoutDate: formatDate(res.stayDetails?.checkoutDate),
            },
          };

          setFormData((prev) => ({ ...prev, ...formattedData }));
        } catch (err) {
          alert('Failed to load data  ');
        }
      })();
    }
  }, []);
  const handleNestedChange = (
    section: keyof BillingFormData,
    field: string,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleServiceChange = (index: number, field: keyof ExtraService, value: string) => {
    const updated = [...formData.extraServices];
    updated[index] = { ...updated[index], [field]: value };
    setFormData((prev) => ({ ...prev, extraServices: updated }));
  };

  const addService = () => {
    setFormData((prev) => ({
      ...prev,
      extraServices: [...prev.extraServices, { serviceName: '', hsncode: '', amount: '' }],
    }));
  };

  const removeService = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      extraServices: prev.extraServices.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        // Hotel
        hotelName: formData.hotelDetails.hotelName,
        hotelAddress: formData.hotelDetails.hotelAddress,
        hotelMobileNo: formData.hotelDetails.hotelMobileNo,
        gstin: formData.hotelDetails.gstin,
        hsnCode: formData.hotelDetails.hsnCode,

        // Invoice
        clientId: user?.clientId || '',
        propertyId: user?.propertyId || '',
        // clientId: formData.invoiceDetails.clientId,
        // propertyId: formData.invoiceDetails.propertyId,
        invoiceNumber: formData.invoiceDetails.invoiceNumber,
        invoiceDate: new Date(formData.invoiceDetails.invoiceDate).toISOString(),
        paymentType: formData.invoiceDetails.paymentType,

        // Customer
        customerName: formData.customerDetails.customerName,
        contactNumber: formData.customerDetails.contactNumber,

        // Stay
        roomNo: formData.stayDetails.roomNo,
        roomType: formData.stayDetails.roomType,
        checkinDate: new Date(formData.stayDetails.checkinDate).toISOString(),
        checkoutDate: new Date(formData.stayDetails.checkoutDate).toISOString(),

        // Extra Services
        extraServices: formData.extraServices.map((s) => ({
          serviceName: s.serviceName,
          hsncode: s.hsncode,
          amount: String(s.amount), // must be string
        })),

        // Amount
        subtotal: Number(formData.amountDetails.subtotal),
        // cgst: Number(formData.amountDetails.cgst),
        // sgst: Number(formData.amountDetails.sgst),
        // igst: Number(formData.amountDetails.igst),
        // discount: Number(formData.amountDetails.discount),
        paidAmount: Number(formData.amountDetails.paidAmount),

      };
      if (id) {
        await updateBillingInfo(id, payload);
        alert('Updated successfully  ');
      }
      else {
        console.log("➡️ Submitting Payload:", payload);
        await createBillingInfo(payload);

        alert("Billing info created successfully!");
      }


      setFormData(initialForm);
      router.push('/BillingInfoList');
    } catch (err: any) {
      console.error(" Billing info create failed:", err);
      alert(err.message || "Failed to create billing info");
    } finally {
      setLoading(false);
    }
  };





  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white shadow rounded space-y-6">
      <h2 className="text-lg font-bold border-b pb-2">Add Billing Info</h2>

      {/* Hotel Details */}
      <h3 className="font-semibold text-blue-700">Hotel Details</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-medium">Hotel Name</label>
          <input
            value={formData.hotelDetails.hotelName}
            onChange={(e) => handleNestedChange("hotelDetails", "hotelName", e.target.value)}
            className="border p-2 w-full rounded"
          />
        </div>
        <div>
          <label className="block font-medium">Hotel Address</label>
          <input
            value={formData.hotelDetails.hotelAddress}
            onChange={(e) => handleNestedChange("hotelDetails", "hotelAddress", e.target.value)}
            className="border p-2 w-full rounded"
          />
        </div>
        <div>
          <label className="block font-medium">Hotel Mobile No</label>
          <input
            value={formData.hotelDetails.hotelMobileNo}
            onChange={(e) => handleNestedChange("hotelDetails", "hotelMobileNo", e.target.value)}
            className="border p-2 w-full rounded"
          />
        </div>
        <div>
          <label className="block font-medium">GSTIN</label>
          <input
            value={formData.hotelDetails.gstin}
            onChange={(e) => handleNestedChange("hotelDetails", "gstin", e.target.value)}
            className="border p-2 w-full rounded"
          />
        </div>
        <div>
          <label className="block font-medium">HSN Code</label>
          <input
            value={formData.hotelDetails.hsnCode}
            onChange={(e) => handleNestedChange("hotelDetails", "hsnCode", e.target.value)}
            className="border p-2 w-full rounded"
          />
        </div>
      </div>

      {/* Invoice Details */}
      <h3 className="font-semibold text-blue-700">Invoice Details</h3>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block font-medium">Invoice Number</label>
          <input
            value={formData.invoiceDetails.invoiceNumber}
            onChange={(e) => handleNestedChange("invoiceDetails", "invoiceNumber", e.target.value)}
            className="border p-2 w-full rounded"
          />
        </div>
        <div>
          <label className="block font-medium">Invoice Date</label>
          <input
            type="date"
            value={formData.invoiceDetails.invoiceDate}
            onChange={(e) => handleNestedChange("invoiceDetails", "invoiceDate", e.target.value)}
            className="border p-2 w-full rounded"
          />
        </div>
        <div>
          <label className="block font-medium">Payment Type</label>
          <select
            value={formData.invoiceDetails.paymentType}
            onChange={(e) => handleNestedChange("invoiceDetails", "paymentType", e.target.value)}
            className="border p-2 w-full rounded"
          >
            <option value="">Select</option>
            <option value="Cash">Cash</option>
            <option value="Card">Card</option>
            <option value="UPI">UPI</option>
          </select>
        </div>
      </div>

      {/* Customer Details */}
      <h3 className="font-semibold text-blue-700">Customer Details</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-medium">Customer Name</label>
          <input
            value={formData.customerDetails.customerName}
            onChange={(e) => handleNestedChange("customerDetails", "customerName", e.target.value)}
            className="border p-2 w-full rounded"
          />
        </div>
        <div>
          <label className="block font-medium">Contact Number</label>
          <input
            value={formData.customerDetails.contactNumber}
            onChange={(e) => handleNestedChange("customerDetails", "contactNumber", e.target.value)}
            className="border p-2 w-full rounded"
          />
        </div>
      </div>

      {/* Stay Details */}
      <h3 className="font-semibold text-blue-700">Stay Details</h3>
      <div className="grid grid-cols-4 gap-4">
        <div>
          <label className="block font-medium">Room No</label>
          <input
            value={formData.stayDetails.roomNo}
            onChange={(e) => handleNestedChange("stayDetails", "roomNo", e.target.value)}
            className="border p-2 w-full rounded"
          />
        </div>
        <div>
          <label className="block font-medium">Room Type</label>
          <input
            value={formData.stayDetails.roomType}
            onChange={(e) => handleNestedChange("stayDetails", "roomType", e.target.value)}
            className="border p-2 w-full rounded"
          />
        </div>
        <div>
          <label className="block font-medium">Check-in Date</label>
          <input
            type="date"
            value={formData.stayDetails.checkinDate}
            onChange={(e) => handleNestedChange("stayDetails", "checkinDate", e.target.value)}
            className="border p-2 w-full rounded"
          />
        </div>
        <div>
          <label className="block font-medium">Check-out Date</label>
          <input
            type="date"
            value={formData.stayDetails.checkoutDate}
            onChange={(e) => handleNestedChange("stayDetails", "checkoutDate", e.target.value)}
            className="border p-2 w-full rounded"
          />
        </div>
      </div>

      {/* Extra Services */}
      <h3 className="font-semibold text-blue-700">Extra Services</h3>
      {formData.extraServices.map((service, idx) => (
        <div key={idx} className="grid grid-cols-4 gap-2 mb-2">
          <input
            placeholder="Service Name"
            value={service.serviceName}
            onChange={(e) => handleServiceChange(idx, "serviceName", e.target.value)}
            className="border p-2 rounded"
          />
          <input
            placeholder="HSN Code"
            value={service.hsncode}
            onChange={(e) => handleServiceChange(idx, "hsncode", e.target.value)}
            className="border p-2 rounded"
          />
          <input
            placeholder="Amount"
            type="number"
            value={service.amount}
            onChange={(e) => handleServiceChange(idx, "amount", e.target.value)}
            className="border p-2 rounded"
          />
          <button
            type="button"
            onClick={() => removeService(idx)}
            className="bg-red-500 text-white px-2 rounded"
          >
            ✕
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addService}
        className="bg-green-500 text-white px-4 py-1 rounded"
      >
        + Add Service
      </button>

      {/* Amount Details */}
      <h3 className="font-semibold text-blue-700">Amount Details</h3>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block font-medium">Subtotal</label>
          <input
            value={formData.amountDetails.subtotal}
            onChange={(e) => handleNestedChange("amountDetails", "subtotal", e.target.value)}
            className="border p-2 w-full rounded"
          />
        </div>

        <div>
          <label className="block font-medium">Paid Amount</label>
          <input
            value={formData.amountDetails.paidAmount}
            onChange={(e) => handleNestedChange("amountDetails", "paidAmount", e.target.value)}
            className="border p-2 w-full rounded"
          />
        </div>
      </div>

      {/* Submit */}
      <div className="pt-4 text-right">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Saving..." : "Submit"}
        </button>
      </div>
    </form>

  );
}
