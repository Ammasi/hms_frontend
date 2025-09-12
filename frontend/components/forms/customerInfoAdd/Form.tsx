// import { useState } from 'react';

// const HotelBookingForm = () => {
//     // Initial form state matching the JSON structure
//     const [formData, setFormData] = useState({
//         hotelDetails: {
//             clientId: '',
//             propertyId: '',
//             customerId: '',
//             hotelName: '',
//             hotelAddress: '',
//             hotelMobileNo: '',
//             gstin: '',
//             hsnCode: ''
//         },
//         bookingDetails: {
//             isReservation: false,
//             bookingId: '',
//             noOfDays: '',
//             noOfRooms: '',
//             graceTime: '',
//             checkInType: '',
//             checkInMode: '',
//             checkInUser: '',
//             roomStatus: '',
//             arrivalMode: '',
//             otaName: '',
//             bookingInstruction: '',
//             enableRoomSharing: false,
//             bookingThrough: '',
//             preferredRooms: '',
//             reservedBy: '',
//             reservedStatus: '',
//             reservationNo: ''
//         },
//         checkin: {
//             checkinDate: '',
//             checkoutDate: '',
//             arrivalDate: '',
//             depatureDate: ''
//         },
//         stayDetails: [{
//             roomNo: '',
//             bedType: '',
//             roomType: '',
//             roomFacility: [],
//             tariff: '',
//             applyTariff: 'No',
//             numberOfGuests: { adult: 1, child: 0, seniors: 0 },
//             noOfPax: 1,
//             isActive: true,
//             guests: [{
//                 guestName: [''],
//                 phoneNo: '',
//                 payPerRoom: ''
//             }]
//         }],
//         guestInfo: {
//             numberOfGuests: { adult: 0, child: 0, seniors: 0 },
//             noOfPax: 0,
//             childPax: 0,
//             extraPax: 0,
//             specialRequests: '',
//             complimentary: '',
//             vechileDetails: ''
//         },
//         paymentDetails: {
//             paymentType: '',
//             paymentBy: '',
//             allowCredit: '',
//             paidAmount: 0,
//             balanceAmount: 0,
//             discType: '',
//             discValue: '',
//             netRate: '',
//             allowChargesPosting: '',
//             enablePaxwise: false,
//             paxwiseBillAmount: ''
//         },
//         addressInfo: {
//             city: '',
//             pinCode: '',
//             state: '',
//             country: ''
//         },
//         gstInfo: {
//             gstNumber: '',
//             gstType: ''
//         },
//         personalInfo: {
//             dob: '',
//             age: '',
//             companyAnniversary: ''
//         },
//         businessInfo: {
//             segmentName: '',
//             bussinessSource: '',
//             customerComapny: '',
//             purposeOfVisit: '',
//             visitRemark: ''
//         },
//         invoiceOptions: {
//             printOption: false,
//             pdfSaveOption: false
//         },
//         extra: [{
//             serviceName: '',
//             hsncode: '',
//             amount: ''
//         }],
//         meta: {
//             rating: '',
//             isCancelled: false,
//             isActive: true,
//             createdAt: '',
//             updatedAt: ''
//         }
//     });

//     // Handle form field changes
//     const handleChange = (e, section, field, subField = null) => {
//         const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;

//         setFormData(prev => {
//             const newData = { ...prev };
//             if (subField !== null) {
//                 newData[section][field][subField] = value;
//             } else {
//                 newData[section][field] = value;
//             }
//             return newData;
//         });
//     };

//     // Handle array field changes
//     const handleArrayChange = (e, section, index, field, subField = null) => {
//         const value = e.target.value;

//         setFormData(prev => {
//             const newData = { ...prev };
//             if (subField !== null) {
//                 newData[section][index][field][subField] = value;
//             } else if (field) {
//                 newData[section][index][field] = value;
//             } else {
//                 newData[section][index] = value;
//             }
//             return newData;
//         });
//     };

//     const handleChange = (index: number, field: keyof IStayDetails, value: any) => {
//         const updated = [...stayDetails];
//         (updated[index] as any)[field] = value;
//         setStayDetails(updated);
//     };
//     const handleNumberOfGuestsChange = (
//         index: number,
//         type: "adult" | "child" | "seniors",
//         value: number
//     ) => {
//         const updated = [...stayDetails];
//         if (!updated[index].numberOfGuests) {
//             updated[index].numberOfGuests = { adult: 0, child: 0, seniors: 0 };
//         }
//         updated[index].numberOfGuests![type] = value;
//         setStayDetails(updated);
//     };
//     // Handle guest changes within a stay detail
//     const handleGuestChange = (
//         stayIndex: number,
//         guestIndex: number,
//         field: keyof IGuest,
//         value: any
//     ) => {
//         setFormData(prev => {
//             const updatedStayDetails = [...prev.stayDetails];
//             const updatedGuests = [...updatedStayDetails[stayIndex].guests];
//             updatedGuests[guestIndex] = { ...updatedGuests[guestIndex], [field]: value };
//             updatedStayDetails[stayIndex] = {
//                 ...updatedStayDetails[stayIndex],
//                 guests: updatedGuests
//             };
//             return { ...prev, stayDetails: updatedStayDetails };
//         });
//     };


//     const addGuest = (stayIndex: number) => {
//         setFormData(prev => {
//             const updatedStayDetails = [...prev.stayDetails];
//             updatedStayDetails[stayIndex] = {
//                 ...updatedStayDetails[stayIndex],
//                 guests: [
//                     ...updatedStayDetails[stayIndex].guests,
//                     { guestName: [''], phoneNo: '', payPerRoom: '' }
//                 ]
//             };
//             return { ...prev, stayDetails: updatedStayDetails };
//         });
//     };




//     const handleNumberOfGuestsChange = (
//         index: number,
//         type: "adult" | "child" | "seniors",
//         value: number
//     ) => {
//         const updated = [...stayDetails];
//         if (!updated[index].numberOfGuests) {
//             updated[index].numberOfGuests = { adult: 0, child: 0, seniors: 0 };
//         }
//         updated[index].numberOfGuests![type] = value;
//         setStayDetails(updated);
//     };


//     const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, section: string, field: string) => {
//         const value = e.target.type === 'checkbox'
//             ? (e.target as HTMLInputElement).checked
//             : e.target.value;

//         setFormData(prev => ({
//             ...prev,
//             [section]: {
//                 ...prev[section as keyof typeof prev],
//                 [field]: value
//             }
//         }));
//     };


//     const removeStayDetail = (index: number) => {
//         if (formData.stayDetails.length <= 1) return;
//         setFormData(prev => ({
//             ...prev,
//             stayDetails: prev.stayDetails.filter((_, i) => i !== index)
//         }));
//     };
//     const addStayDetail = () => {
//         setFormData(prev => ({
//             ...prev,
//             stayDetails: [
//                 ...prev.stayDetails,
//                 {
//                     roomNo: '',
//                     bedType: '',
//                     roomType: '',
//                     roomFacility: [],
//                     tariff: '',
//                     applyTariff: 'No',
//                     numberOfGuests: { adult: 1, child: 0, seniors: 0 },
//                     noOfPax: 1,
//                     isActive: true,
//                     guests: [{
//                         guestName: [''],
//                         phoneNo: '',
//                         payPerRoom: ''
//                     }]
//                 }
//             ]
//         }));
//     };


//     // Handle form submission
//     const handleSubmit = (e) => {
//         e.preventDefault();
//         console.log('Submitted data:', formData);

//     };

//     return (
//         <div className="container mx-auto p-4">
//             <h1 className="text-2xl font-bold mb-6">Hotel Booking Form</h1>

//             <form onSubmit={handleSubmit} className="space-y-8">
//                 {/* Hotel Details Section */}
//                 <div className="bg-white p-6 rounded-lg shadow">
//                     <h2 className="text-xl font-semibold mb-4">Hotel Details</h2>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div>
//                             <label className="block text-sm font-medium">client Id</label>
//                             <input
//                                 type="text"
//                                 value={formData.hotelDetails.clientId}
//                                 onChange={(e) => handleChange(e, 'hotelDetails', 'clientId')}
//                                 className="w-full p-2 border rounded"
//                             />
//                         </div>
//                         <div>
//                             <label className="block text-sm font-medium">property Id</label>
//                             <input
//                                 type="text"
//                                 value={formData.hotelDetails.propertyId}
//                                 onChange={(e) => handleChange(e, 'hotelDetails', 'propertyId')}
//                                 className="w-full p-2 border rounded"
//                             />
//                         </div>
//                         <div>
//                             <label className="block text-sm font-medium">Hotel Name</label>
//                             <input
//                                 type="text"
//                                 value={formData.hotelDetails.hotelName}
//                                 onChange={(e) => handleChange(e, 'hotelDetails', 'hotelName')}
//                                 className="w-full p-2 border rounded"
//                             />
//                         </div>
//                         <div>
//                             <label className="block text-sm font-medium">Hotel Address</label>
//                             <input
//                                 type="text"
//                                 value={formData.hotelDetails.hotelAddress}
//                                 onChange={(e) => handleChange(e, 'hotelDetails', 'hotelAddress')}
//                                 className="w-full p-2 border rounded"
//                             />
//                         </div>
//                         <div>
//                             <label className="block text-sm font-medium">hotel Mobile No</label>
//                             <input
//                                 type="text"
//                                 value={formData.hotelDetails.hotelMobileNo}
//                                 onChange={(e) => handleChange(e, 'hotelDetails', 'hotelMobileNo')}
//                                 className="w-full p-2 border rounded"
//                             />
//                         </div>
//                         <div>
//                             <label className="block text-sm font-medium">gstin</label>
//                             <input
//                                 type="text"
//                                 value={formData.hotelDetails.gstin}
//                                 onChange={(e) => handleChange(e, 'hotelDetails', 'gstin')}
//                                 className="w-full p-2 border rounded"
//                             />
//                         </div>
//                         <div>
//                             <label className="block text-sm font-medium">hsnCode</label>
//                             <input
//                                 type="text"
//                                 value={formData.hotelDetails.hsnCode}
//                                 onChange={(e) => handleChange(e, 'hotelDetails', 'hsnCode')}
//                                 className="w-full p-2 border rounded"
//                             />
//                         </div>

//                     </div>
//                 </div>

//                 {/* Booking Details Section */}
//                 <div className="bg-white p-6 rounded-lg shadow">
//                     <h2 className="text-xl font-semibold mb-4">Booking Details</h2>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div>
//                             <label className="block text-sm font-medium">Reservation</label>
//                             <select
//                                 name="isReservation"
//                                 value={formData.isReservation ? 'true' : 'false'}
//                                 onChange={(e) =>
//                                     setFormData(prev => ({
//                                         ...prev,
//                                         isReservation: e.target.value === 'true',
//                                     }))
//                                 }
//                                 className="w-full p-2 border border-gray-300 rounded"
//                                 required
//                             >
//                                 <option value="true">Yes</option>
//                                 <option value="false">No</option>
//                             </select>
//                         </div>
//                         <div>
//                             <label className="block text-sm font-medium">Booking ID</label>
//                             <input
//                                 type="text"
//                                 value={formData.bookingDetails.bookingId}
//                                 onChange={(e) => handleChange(e, 'bookingDetails', 'bookingId')}
//                                 className="w-full p-2 border rounded"
//                             />
//                         </div>
//                         <div>
//                             <label className="block text-sm font-medium">no Of Days</label>
//                             <input
//                                 type="text"
//                                 value={formData.bookingDetails.noOfDays}
//                                 onChange={(e) => handleChange(e, 'bookingDetails', 'noOfDays')}
//                                 className="w-full p-2 border rounded"
//                             />
//                         </div>
//                         <div>
//                             <label className="block text-sm font-medium">no Of Rooms</label>
//                             <input
//                                 type="text"
//                                 value={formData.bookingDetails.noOfRooms}
//                                 onChange={(e) => handleChange(e, 'bookingDetails', 'noOfRooms')}
//                                 className="w-full p-2 border rounded"
//                             />
//                         </div>
//                         <div>
//                             <label className="block text-sm font-medium">grace Time</label>
//                             <input
//                                 type="text"
//                                 value={formData.bookingDetails.graceTime}
//                                 onChange={(e) => handleChange(e, 'bookingDetails', 'graceTime')}
//                                 className="w-full p-2 border rounded"
//                             />
//                         </div>
//                         <div>
//                             <label className="block text-sm font-medium">check In Type</label>
//                             <input
//                                 type="text"
//                                 value={formData.bookingDetails.checkInType}
//                                 onChange={(e) => handleChange(e, 'bookingDetails', 'checkInType')}
//                                 className="w-full p-2 border rounded"
//                             />
//                         </div>
//                         <div>
//                             <label className="block text-sm font-medium">check In Mode</label>
//                             <input
//                                 type="text"
//                                 value={formData.bookingDetails.checkInMode}
//                                 onChange={(e) => handleChange(e, 'bookingDetails', 'checkInMode')}
//                                 className="w-full p-2 border rounded"
//                             />
//                         </div>
//                         <div>
//                             <label className="block text-sm font-medium">check In User</label>
//                             <input
//                                 type="text"
//                                 value={formData.bookingDetails.checkInUser}
//                                 onChange={(e) => handleChange(e, 'bookingDetails', 'checkInUser')}
//                                 className="w-full p-2 border rounded"
//                             />
//                         </div>
//                         <div>
//                             <label className="block text-sm font-medium">room Status</label>
//                             <input
//                                 type="text"
//                                 value={formData.bookingDetails.roomStatus}
//                                 onChange={(e) => handleChange(e, 'bookingDetails', 'roomStatus')}
//                                 className="w-full p-2 border rounded"
//                             />
//                         </div>
//                         <div>
//                             <label className="block text-sm font-medium">arrival Mode</label>
//                             <input
//                                 type="text"
//                                 value={formData.bookingDetails.arrivalMode}
//                                 onChange={(e) => handleChange(e, 'bookingDetails', 'arrivalMode')}
//                                 className="w-full p-2 border rounded"
//                             />
//                         </div>
//                         <div>
//                             <label className="block text-sm font-medium">ota Name</label>
//                             <input
//                                 type="text"
//                                 value={formData.bookingDetails.otaName}
//                                 onChange={(e) => handleChange(e, 'bookingDetails', 'otaName')}
//                                 className="w-full p-2 border rounded"
//                             />
//                         </div>
//                         <div>
//                             <label className="block text-sm font-medium">booking Instruction</label>
//                             <input
//                                 type="text"
//                                 value={formData.bookingDetails.bookingInstruction}
//                                 onChange={(e) => handleChange(e, 'bookingDetails', 'bookingInstruction')}
//                                 className="w-full p-2 border rounded"
//                             />
//                         </div>
//                         <div>
//                             <label className="block text-sm font-medium">enable RoomSharing</label>
//                             <select
//                                 name="enableRoomSharing"
//                                 value={formData.enableRoomSharing ? 'true' : 'false'}
//                                 onChange={(e) =>
//                                     setFormData(prev => ({
//                                         ...prev,
//                                         enableRoomSharing: e.target.value === 'true',
//                                     }))
//                                 }
//                                 className="w-full p-2 border border-gray-300 rounded"
//                                 required
//                             >
//                                 <option value="true">Yes</option>
//                                 <option value="false">No</option>
//                             </select>
//                         </div>
//                         <div>
//                             <label className="block text-sm font-medium">preferred Rooms</label>
//                             <input
//                                 type="text"
//                                 value={formData.bookingDetails.preferredRooms}
//                                 onChange={(e) => handleChange(e, 'bookingDetails', 'preferredRooms')}
//                                 className="w-full p-2 border rounded"
//                             />
//                         </div>
//                         <div>
//                             <label className="block text-sm font-medium">reserved By</label>
//                             <input
//                                 type="text"
//                                 value={formData.bookingDetails.reservedBy}
//                                 onChange={(e) => handleChange(e, 'bookingDetails', 'reservedBy')}
//                                 className="w-full p-2 border rounded"
//                             />
//                         </div>
//                         <div>
//                             <label className="block text-sm font-medium">reservedStatus</label>
//                             <input
//                                 type="text"
//                                 value={formData.bookingDetails.reservedStatus}
//                                 onChange={(e) => handleChange(e, 'bookingDetails', 'reservedStatus')}
//                                 className="w-full p-2 border rounded"
//                             />
//                         </div>
//                         <div>
//                             <label className="block text-sm font-medium">reservation No</label>
//                             <input
//                                 type="text"
//                                 value={formData.bookingDetails.reservationNo}
//                                 onChange={(e) => handleChange(e, 'bookingDetails', 'reservationNo')}
//                                 className="w-full p-2 border rounded"
//                             />
//                         </div>


//                     </div>
//                 </div>

//                 {/* checkin */}
//                 <div className="bg-white p-6 rounded-lg shadow">
//                     <h2 className="text-xl font-semibold mb-4">checkin</h2>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div>
//                             <label className="block text-sm font-medium">check in Date</label>
//                             <input
//                                 type="number"
//                                 value={formData.checkin.checkinDate}
//                                 onChange={(e) => handleChange(e, 'checkin', 'checkinDate')}
//                                 className="w-full p-2 border rounded"
//                             />
//                         </div>
//                         <div>
//                             <label className="block text-sm font-medium">check out Date</label>
//                             <input
//                                 type="number"
//                                 value={formData.checkin.checkoutDate}
//                                 onChange={(e) => handleChange(e, 'checkin', 'checkoutDate')}
//                                 className="w-full p-2 border rounded"
//                             />
//                         </div>

//                         <div>
//                             <label className="block text-sm font-medium">arrival Date</label>
//                             <input
//                                 type="number"
//                                 value={formData.checkin.arrivalDate}
//                                 onChange={(e) => handleChange(e, 'checkin', 'arrivalDate')}
//                                 className="w-full p-2 border rounded"
//                             />
//                         </div>
//                         <div>
//                             <label className="block text-sm font-medium">depature Date</label>
//                             <input
//                                 type="number"
//                                 value={formData.checkin.depatureDate}
//                                 onChange={(e) => handleChange(e, 'checkin', 'depatureDate')}
//                                 className="w-full p-2 border rounded"
//                             />
//                         </div>

//                     </div>
//                 </div>
//                 {/* stayDetails */}
//                 <div>
//                     <h2>Stay Details</h2>
//                     {formData.stayDetails.map((stay, index) => (
//                         <div key={index} style={{ border: "1px solid #ccc", padding: 10, marginBottom: 10 }}>
//                             <input
//                                 type="text"
//                                 placeholder="Room No"
//                                 value={stay.roomNo || ""}
//                                 onChange={(e) => handleChange(index, "roomNo", e.target.value)}
//                             />
//                             <input
//                                 type="text"
//                                 placeholder="Bed Type"
//                                 value={stay.bedType || ""}
//                                 onChange={(e) => handleChange(index, "bedType", e.target.value)}
//                             />
//                             <input
//                                 type="text"
//                                 placeholder="Room Type"
//                                 value={stay.roomType || ""}
//                                 onChange={(e) => handleChange(index, "roomType", e.target.value)}
//                             />
//                             <input
//                                 type="number"
//                                 placeholder="Adult Guests"
//                                 value={stay.numberOfGuests?.adult || 0}
//                                 onChange={(e) => handleNumberOfGuestsChange(index, "adult", Number(e.target.value))}
//                             />
//                             <input
//                                 type="number"
//                                 placeholder="Child Guests"
//                                 value={stay.numberOfGuests?.child || 0}
//                                 onChange={(e) => handleNumberOfGuestsChange(index, "child", Number(e.target.value))}
//                             />
//                             <input
//                                 type="number"
//                                 placeholder="Senior Guests"
//                                 value={stay.numberOfGuests?.seniors || 0}
//                                 onChange={(e) => handleNumberOfGuestsChange(index, "seniors", Number(e.target.value))}
//                             />

//                             <button type="button" onClick={() => removeStayDetail(index)}>Remove</button>
//                         </div>
//                     ))}
//                     <button type="button" onClick={addStayDetail}>Add Stay Detail</button>
//                 </div>

//                 <div className="bg-white p-6 rounded-lg shadow">
//                     <h2 className="text-xl font-semibold mb-4">checkin</h2>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div>
//                             <label className="block text-sm font-medium">check in Date</label>
//                             <input
//                                 type="number"
//                                 value={formData.checkin.checkinDate}
//                                 onChange={(e) => handleChange(e, 'checkin', 'checkinDate')}
//                                 className="w-full p-2 border rounded"
//                             />
//                         </div>


//                     </div>
//                 </div>

//                 {/* Guest Information Section */}
//                 <div className="bg-white p-6 rounded-lg shadow">
//                     <h2 className="text-xl font-semibold mb-4">Guest Information</h2>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div>
//                             <label className="block text-sm font-medium">Number of Adults</label>
//                             <input
//                                 type="number"
//                                 value={formData.guestInfo.numberOfGuests.adult}
//                                 onChange={(e) => handleChange(e, 'guestInfo', 'numberOfGuests', 'adult')}
//                                 className="w-full p-2 border rounded"
//                             />
//                         </div>
//                         <div>
//                             <label className="block text-sm font-medium">Number of Children</label>
//                             <input
//                                 type="number"
//                                 value={formData.guestInfo.numberOfGuests.child}
//                                 onChange={(e) => handleChange(e, 'guestInfo', 'numberOfGuests', 'child')}
//                                 className="w-full p-2 border rounded"
//                             />
//                         </div>
//                         {/* Add more guest info fields as needed */}
//                     </div>
//                 </div>

//                 {/* Payment Details Section */}
//                 <div className="bg-white p-6 rounded-lg shadow">
//                     <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div>
//                             <label className="block text-sm font-medium">Payment Type</label>
//                             <select
//                                 value={formData.paymentDetails.paymentType}
//                                 onChange={(e) => handleChange(e, 'paymentDetails', 'paymentType')}
//                                 className="w-full p-2 border rounded"
//                             >
//                                 <option value="">Select</option>
//                                 <option value="Cash">Cash</option>
//                                 <option value="Card">Card</option>
//                                 <option value="UPI">UPI</option>
//                             </select>
//                         </div>
//                         <div>
//                             <label className="block text-sm font-medium">Paid Amount</label>
//                             <input
//                                 type="number"
//                                 value={formData.paymentDetails.paidAmount}
//                                 onChange={(e) => handleChange(e, 'paymentDetails', 'paidAmount')}
//                                 className="w-full p-2 border rounded"
//                             />
//                         </div>
//                         {/* Add more payment details fields as needed */}
//                     </div>
//                 </div>

//                 {/* Extra Services Section */}
//                 <div className="bg-white p-6 rounded-lg shadow">
//                     <h2 className="text-xl font-semibold mb-4">Extra Services</h2>
//                     {formData.extra.map((service, index) => (
//                         <div key={index} className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
//                             <div>
//                                 <label className="block text-sm font-medium">Service Name</label>
//                                 <input
//                                     type="text"
//                                     value={service.serviceName}
//                                     onChange={(e) => handleArrayChange(e, 'extra', index, 'serviceName')}
//                                     className="w-full p-2 border rounded"
//                                 />
//                             </div>
//                             <div>
//                                 <label className="block text-sm font-medium">HSN Code</label>
//                                 <input
//                                     type="text"
//                                     value={service.hsncode}
//                                     onChange={(e) => handleArrayChange(e, 'extra', index, 'hsncode')}
//                                     className="w-full p-2 border rounded"
//                                 />
//                             </div>
//                             <div>
//                                 <label className="block text-sm font-medium">Amount</label>
//                                 <input
//                                     type="text"
//                                     value={service.amount}
//                                     onChange={(e) => handleArrayChange(e, 'extra', index, 'amount')}
//                                     className="w-full p-2 border rounded"
//                                 />
//                             </div>
//                         </div>
//                     ))}
//                 </div>

//                 <div className="flex justify-end">
//                     <button
//                         type="submit"
//                         className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
//                     >
//                         Submit Booking
//                     </button>
//                 </div>
//             </form>
//         </div>
//     );
// };

// export default HotelBookingForm;