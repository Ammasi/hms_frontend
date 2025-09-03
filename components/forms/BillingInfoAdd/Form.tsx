'use client';
import { useEffect, useState } from 'react';
import { createBillingInfo, getBillingInfoById, updateBillingInfo } from '../../../lib/api';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { BillingFormData, ExtraService } from '../../interface/billing';
import { FaHotel, FaUserFriends, FaTasks } from "react-icons/fa";

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
  const [step, setStep] = useState(1);
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


  const steps = [
    { label: "Hotel & Invoice", icon: <FaHotel className="text-xl mr-2" /> },
    { label: "Customer & Stay", icon: <FaUserFriends className="text-xl mr-2" /> },
    { label: "Extra Services & Amount", icon: <FaTasks className="text-xl mr-2" /> },
  ];


  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-amber-50 px-2">

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow w-[1000px] h-[500px] flex flex-col rounded-2xl"
      >
        {/* Stepper */}
        <div className="flex items-center bg-gray-50 justify-between w-full px-2 py-3">
          {steps.map((stepData, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center relative">
              <button
                type="button"
                onClick={() => setStep(idx + 1)}
                className={`
              flex items-center justify-center w-10 h-10 rounded-full border-2 text-lg font-semibold
              transform hover:scale-105 transition
              ${step === idx + 1
                    ? "bg-blue-600 text-white border-blue-600"
                    : step > idx + 1
                      ? "bg-green-500 text-white border-green-500"
                      : "bg-gray-200 text-gray-600 border-gray-300"
                  }
            `}
              >
                {idx + 1}
              </button>
              <span
                className={`mt-2 text-sm md:text-base font-medium text-center
              ${step === idx + 1 ? "text-blue-700" : "text-gray-500"}
            `}
              >
                {stepData.label}
              </span>
              {idx < steps.length - 1 && (
                <div
                  className={`absolute top-6 left-1/2 w-full h-1 -z-10
                ${step > idx + 1 ? "bg-green-500" : "bg-gray-300"}
              `}
                />
              )}
            </div>
          ))}
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2">
          {/* Step 1 */}
          {step === 1 && (
            <>
              <h3 className="font-semibold text-blue-700">Hotel Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {/* Hotel Name */}
                <div>
                  <label className="text-sm font-semibold text-gray-700">Hotel Name</label>
                  <input
                    value={formData.hotelDetails.hotelName}
                    onChange={(e) => handleNestedChange("hotelDetails", "hotelName", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm
                  focus:outline-none text-gray-900 placeholder-gray-400 transition-all"
                  />
                </div>
                {/* Hotel Address */}
                <div>
                  <label className="text-sm font-semibold text-gray-700">Hotel Address</label>
                  <input
                    value={formData.hotelDetails.hotelAddress}
                    onChange={(e) => handleNestedChange("hotelDetails", "hotelAddress", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm
                  focus:outline-none text-gray-900 placeholder-gray-400 transition-all"
                  />
                </div>
                {/* Hotel Mobile No */}
                <div>
                  <label className="text-sm font-semibold text-gray-700">Hotel Mobile No</label>
                  <input
                    value={formData.hotelDetails.hotelMobileNo}
                    onChange={(e) => handleNestedChange("hotelDetails", "hotelMobileNo", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm
                  focus:outline-none text-gray-900 placeholder-gray-400 transition-all"
                  />
                </div>
                {/* GSTIN */}
                <div>
                  <label className="text-sm font-semibold text-gray-700">GSTIN</label>
                  <input
                    value={formData.hotelDetails.gstin}
                    onChange={(e) => handleNestedChange("hotelDetails", "gstin", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm
                  focus:outline-none text-gray-900 placeholder-gray-400 transition-all"
                  />
                </div>
                {/* HSN Code */}
                <div>
                  <label className="text-sm font-semibold text-gray-700">HSN Code</label>
                  <input
                    value={formData.hotelDetails.hsnCode}
                    onChange={(e) => handleNestedChange("hotelDetails", "hsnCode", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm
                  focus:outline-none text-gray-900 placeholder-gray-400 transition-all"
                  />
                </div>
              </div>

              <h3 className="font-semibold text-blue-700">Invoice Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                <div>
                  <label className="text-sm font-semibold text-gray-700">Invoice Number</label>
                  <input
                    value={formData.invoiceDetails.invoiceNumber}
                    onChange={(e) => handleNestedChange("invoiceDetails", "invoiceNumber", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm
                  focus:outline-none text-gray-900 placeholder-gray-400 transition-all"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700">Invoice Date</label>
                  <input
                    type="date"
                    value={formData.invoiceDetails.invoiceDate}
                    onChange={(e) => handleNestedChange("invoiceDetails", "invoiceDate", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm
                  focus:outline-none text-gray-900 placeholder-gray-400 transition-all"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700">Payment Type</label>
                  <select
                    value={formData.invoiceDetails.paymentType}
                    onChange={(e) => handleNestedChange("invoiceDetails", "paymentType", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm
                  focus:outline-none text-gray-900 placeholder-gray-400 transition-all"
                  >
                    <option value="">Select</option>
                    <option value="Cash">Cash</option>
                    <option value="Card">Card</option>
                    <option value="UPI">UPI</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h3 className="font-semibold text-blue-700">Customer Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                  <label className="text-sm font-semibold text-gray-700">Customer Name</label>
                  <input
                    value={formData.customerDetails.customerName}
                    onChange={(e) => handleNestedChange("customerDetails", "customerName", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm 
            focus:outline-none text-gray-900 placeholder-gray-400 transition-all"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700">Contact Number</label>
                  <input
                    value={formData.customerDetails.contactNumber}
                    onChange={(e) => handleNestedChange("customerDetails", "contactNumber", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm 
            focus:outline-none text-gray-900 placeholder-gray-400 transition-all"
                  />
                </div>
              </div>

              <h3 className="font-semibold text-blue-700 mt-3">Stay Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                  <label className="text-sm font-semibold text-gray-700">Room No</label>
                  <input
                    value={formData.stayDetails.roomNo}
                    onChange={(e) => handleNestedChange("stayDetails", "roomNo", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm 
            focus:outline-none text-gray-900 placeholder-gray-400 transition-all"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700">Room Type</label>
                  <input
                    value={formData.stayDetails.roomType}
                    onChange={(e) => handleNestedChange("stayDetails", "roomType", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm 
            focus:outline-none text-gray-900 placeholder-gray-400 transition-all"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700">Check-in Date</label>
                  <input
                    type="date"
                    value={formData.stayDetails.checkinDate}
                    onChange={(e) => handleNestedChange("stayDetails", "checkinDate", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm 
            focus:outline-none text-gray-900 placeholder-gray-400 transition-all"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700">Check-out Date</label>
                  <input
                    type="date"
                    value={formData.stayDetails.checkoutDate}
                    onChange={(e) => handleNestedChange("stayDetails", "checkoutDate", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm 
            focus:outline-none text-gray-900 placeholder-gray-400 transition-all"
                  />
                </div>
              </div>
            </>
          )}
          {step === 3 && (
            <>
              <h3 className="font-semibold text-blue-700">Extra Services</h3>
              {formData.extraServices.map((service, idx) => (
                <div key={idx} className="flex flex-col md:flex-row items-start md:items-center gap-2 mb-2">
                  <div className="flex-1 w-full">
                    <label className="text-sm font-semibold text-gray-700">Service Name</label>
                    <input
                      value={service.serviceName}
                      onChange={(e) => handleServiceChange(idx, "serviceName", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm 
              focus:outline-none text-gray-900 placeholder-gray-400 transition-all"
                    />
                  </div>
                  <div className="flex-1 w-full">
                    <label className="text-sm font-semibold text-gray-700">HSN Code</label>
                    <input
                      value={service.hsncode}
                      onChange={(e) => handleServiceChange(idx, "hsncode", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm 
              focus:outline-none text-gray-900 placeholder-gray-400 transition-all"
                    />
                  </div>
                  <div className="flex-1 w-full">
                    <label className="text-sm font-semibold text-gray-700">Amount</label>
                    <input
                      type="number"
                      value={service.amount}
                      onChange={(e) => handleServiceChange(idx, "amount", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm 
              focus:outline-none text-gray-900 placeholder-gray-400 transition-all"
                    />
                  </div>
                  {/* Delete Button */}
                  <div className="flex items-center mt-6">
                    <button
                      type="button"
                      onClick={() => removeService(idx)}
                      className="flex items-center justify-center w-8 h-8 rounded-full 
              bg-red-500 text-white text-sm font-bold 
              shadow hover:bg-red-600 transition"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addService}
                className="flex items-center gap-2 px-6 py-2 rounded-lg bg-gradient-to-r from-green-500 to-green-700 
        text-white font-semibold shadow hover:from-green-600 hover:to-green-800 
        transform hover:scale-105 transition focus:outline-none"
              >
                + Add Service
              </button>

              <h3 className="font-semibold text-blue-700 mt-3">Amount Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700">Subtotal</label>
                  <input
                    value={formData.amountDetails.subtotal}
                    onChange={(e) => handleNestedChange("amountDetails", "subtotal", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm 
            focus:outline-none text-gray-900 placeholder-gray-400 transition-all"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700">Paid Amount</label>
                  <input
                    value={formData.amountDetails.paidAmount}
                    onChange={(e) => handleNestedChange("amountDetails", "paidAmount", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm 
            focus:outline-none text-gray-900 placeholder-gray-400 transition-all"
                  />
                </div>
              </div>
            </>
          )}

        </div>

        {/* Bottom Actions */}
        <div className="sticky bottom-0 left-0 right-0 bg-gray-50 px-4 py-2 flex flex-col md:flex-row gap-2 md:gap-0 md:items-center md:justify-between z-10">

          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="w-full md:w-auto flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-gray-500 to-gray-600 
            text-white font-medium shadow hover:from-gray-600 hover:to-gray-700 
            transform hover:scale-105 transition"
            >
              Back
            </button>
          ) : (
            <div />
          )}


          {step < 3 && (
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              className="w-full md:w-auto flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 
            text-white font-semibold shadow hover:from-blue-600 hover:to-blue-800 
            transform hover:scale-105 transition"
            >
              Next
            </button>
          )}
          {step === 3 && (
            <button
              type="submit"
              className="w-full md:w-auto flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-green-500 to-green-700 
            text-white font-semibold shadow hover:from-green-600 hover:to-green-800 
            transform hover:scale-105 transition"
            >
              Submit
            </button>
          )}
        </div>
      </form>
    </div>

  );
}
