'use client';
import { useEffect, useState } from 'react';
import { deleteBillingInfo, fetchBillingInfos } from '../../../../lib/api';
import { useRouter } from 'next/navigation';
import { BillingInfo } from '../../../../components/interface/billing';


export default function BillingInfoList() {
  const [data, setData] = useState<BillingInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const router = useRouter();
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setErr('');
      try {
        const res = await fetchBillingInfos();
        setData(Array.isArray(res) ? res : []);
      } catch (e: any) {
        setErr(e.message);
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this billing record?")) return;

    try {
      await deleteBillingInfo(id);
      alert("Deleted successfully  ");

      setData((prev) => prev.filter((b) => b.id !== id));
    } catch (err: any) {
      alert(err.message || "Delete failed  ");
    }
  };


  return (
    <div className="p-6 max-w-full overflow-x-auto bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4 text-blue-800">Billing Info List</h2>

      {loading && <p className="text-gray-500">Loading...</p>}
      {err && <p className="text-red-600">{err}</p>}
      {!loading && data.length === 0 && <p>No records found.</p>}

      {data.length > 0 && (
        <table className="min-w-[1200px] border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              {/* Hotel */}
              <th className="border p-2">Hotel Name</th>
              <th className="border p-2">Hotel Address</th>
              <th className="border p-2">Hotel Mobile</th>
              <th className="border p-2">GSTIN</th>
              <th className="border p-2">HSN Code</th>

              {/* Invoice */}
              <th className="border p-2">Invoice #</th>
              <th className="border p-2">Invoice Date</th>
              <th className="border p-2">Payment Type</th>

              {/* Customer */}
              <th className="border p-2">Customer Name</th>
              <th className="border p-2">Contact</th>

              {/* Stay */}
              <th className="border p-2">Room No</th>
              <th className="border p-2">Room Type</th>
              <th className="border p-2">Check-in</th>
              <th className="border p-2">Check-out</th>

              {/* Services */}
              <th className="border p-2">Extra Services</th>

              {/* Amounts */}
              <th className="border p-2">Subtotal</th>
              <th className="border p-2">CGST</th>
              <th className="border p-2">SGST</th>
              <th className="border p-2">IGST</th>
              <th className="border p-2">Discount</th>
              <th className="border p-2">Paid</th>
              <th className="border p-2">Grand Total</th>
              <th className="border p-2">Amount in Words</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((bill) => (
              <tr key={bill.id} className="hover:bg-gray-50">
                {/* Hotel */}
                <td className="border p-2">{bill.hotelDetails.hotelName}</td>
                <td className="border p-2">{bill.hotelDetails.hotelAddress}</td>
                <td className="border p-2">{bill.hotelDetails.hotelMobileNo}</td>
                <td className="border p-2">{bill.hotelDetails.gstin}</td>
                <td className="border p-2">{bill.hotelDetails.hsnCode}</td>

                {/* Invoice */}
                <td className="border p-2">{bill.invoiceDetails.invoiceNumber}</td>
                <td className="border p-2">
                  {new Date(bill.invoiceDetails.invoiceDate).toLocaleDateString()}
                </td>
                <td className="border p-2">{bill.invoiceDetails.paymentType}</td>

                {/* Customer */}
                <td className="border p-2">{bill.customerDetails.customerName}</td>
                <td className="border p-2">{bill.customerDetails.contactNumber}</td>

                {/* Stay */}
                <td className="border p-2">{bill.stayDetails.roomNo}</td>
                <td className="border p-2">{bill.stayDetails.roomType}</td>
                <td className="border p-2">
                  {new Date(bill.stayDetails.checkinDate).toLocaleDateString()}
                </td>
                <td className="border p-2">
                  {new Date(bill.stayDetails.checkoutDate).toLocaleDateString()}
                </td>

                {/* Services */}
                <td className="border p-2">
                  {bill.extraServices.map((s, idx) => (
                    <div key={idx}>
                      {s.serviceName} ({s.hsncode}) {s.amount ? `- ₹${s.amount}` : ''}
                    </div>
                  ))}
                </td>

                {/* Amounts */}
                <td className="border p-2 text-right">₹{bill.amountDetails.subtotal}</td>
                <td className="border p-2 text-right">₹{bill.amountDetails.cgst}</td>
                <td className="border p-2 text-right">₹{bill.amountDetails.sgst}</td>
                <td className="border p-2 text-right">₹{bill.amountDetails.igst}</td>
                <td className="border p-2 text-right">{bill.amountDetails.discount}%</td>
                <td className="border p-2 text-right">₹{bill.amountDetails.paidAmount}</td>
                <td className="border p-2 font-bold text-right">₹{bill.amountDetails.grandTotal}</td>
                <td className="border p-2">{bill.amountDetails.amountInWords}</td>
                <td className="border p-2 text-center">
                  <button
                    onClick={() => {
                      localStorage.setItem("editBillingId", bill.id);  
                      router.push("/billing"); 
                    }}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(bill.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
