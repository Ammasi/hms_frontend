'use client';
import { useEffect, useRef, useState } from 'react';
import { ClientAddData } from '../../interface/Client';
import { createHotelOwner, updateHotelOwner } from '../../../lib/api';
import axios from "axios";

type ClientAddProps = {
  setShowModal: (value: boolean) => void;
  editingData?: ClientAddData | null;
  onSaved?: () => void;
};

const ClientAdd = ({ setShowModal, editingData, onSaved }: ClientAddProps) => {
  const initialFormData = {
    companyName: '',
    clientName: '',
    clientEmail: '',
    clientMobileNo: '',
    gst: '',
    currency: 'INR',
    subscription: '',
    subscriptionStatus: 'Active',
    subscriptionStartDate: '',
    subscriptionEndDate: '',
    clientAddress: '',
    clientDocuments: [] as File[],
    status: 'active',
    noOfHotels: 0,
    subscriptionDuration: 'yearly',
    propertyCount: 0,
    isActive: true,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [planNames, setPlanNames] = useState<string[]>([]);
  const [existingUrls, setExistingUrls] = useState<string[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const MAX_IMAGES = 3;
  type SubscriptionModel = { planDefaultName: string };
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const openPicker = () => fileInputRef.current?.click();

  const formatDateForInput = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const handleFiles = (files: File[]) => {
    const remaining = MAX_IMAGES - (existingUrls.length + newFiles.length);
    if (remaining <= 0) return;
    const toAdd = files.slice(0, Math.max(0, remaining));
    setNewFiles((prev) => [...prev, ...toAdd]);
  };

  const removeExistingAt = (idx: number) =>
    setExistingUrls((prev) => prev.filter((_, i) => i !== idx));

  const removeNewAt = (idx: number) =>
    setNewFiles((prev) => {
      const f = prev[idx];
      const url = (f as any).__preview;
      if (url) URL.revokeObjectURL(url);
      return prev.filter((_, i) => i !== idx);
    });

  const previewItems = [
    ...existingUrls.map((url) => ({ kind: 'existing' as const, url })),
    ...newFiles.map((file) => ({
      kind: 'new' as const,
      file,
      url: (file as any).__preview || ((file as any).__preview = URL.createObjectURL(file)),
    })),
  ].slice(0, MAX_IMAGES);

  useEffect(() => {
    getPlans();
    if (editingData) {

      const transformedData = {
        companyName: editingData.companyName || '',
        clientName: editingData.clientName || '',
        clientEmail: editingData.clientEmail || '',
        clientMobileNo: editingData.clientMobileNo || '',
        gst: editingData.gst || '',
        currency: editingData.currency || 'INR',
        subscription: editingData.subscripton || editingData.subscription || '',
        subscriptionStatus: editingData.subscriptonStatus || editingData.subscriptionStatus || 'Active',
        subscriptionStartDate: formatDateForInput(editingData.subscriptionStartDate),
        subscriptionEndDate: formatDateForInput(editingData.subscriptonEndDate || editingData.subscriptionEndDate),
        clientAddress: editingData.clientAddress || '',
        status: editingData.status || 'active',
        noOfHotels: editingData.noOfHotels || 0,
        subscriptionDuration: editingData.subscriptonDuration || editingData.subscriptionDuration || 'yearly',
        propertyCount: editingData.propertyCount || 0,
        isActive: editingData.isActive !== undefined ? editingData.isActive : true,
        clientDocuments: [],
      };

      setFormData(transformedData);

      const urls = Array.isArray(editingData.clientDocuments)
        ? (editingData.clientDocuments as any[])
          .filter(Boolean)
          .map((v) => (typeof v === 'string' ? v : v?.path || v?.url || v?.image || ''))
          .filter((u: string) => !!u)
        : [];
      setExistingUrls(urls);
      setNewFiles([]);
    } else {
      setFormData(initialFormData);
      setExistingUrls([]);
      setNewFiles([]);
    }
  }, [editingData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, type, value, files } = e.target as HTMLInputElement;

    if (type === 'file' && files) {
      handleFiles(Array.from(files));
      e.currentTarget.value = '';
      return;
    }

    if (name === 'noOfHotels' || name === 'propertyCount') {
      setFormData((prev) => ({
        ...prev,
        [name]: parseInt(value) || 0,
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  async function urlToFile(url: string, suggestedName?: string): Promise<File | null> {
    try {
      const res = await fetch(url, { mode: 'cors' });
      if (!res.ok) return null;
      const blob = await res.blob();
      const nameFromUrl = (() => {
        try {
          const u = new URL(url);
          const last = u.pathname.split('/').pop() || 'file';
          return last.split('?')[0] || suggestedName || 'file';
        } catch {
          return suggestedName || 'file';
        }
      })();
      const mime = blob.type || 'application/octet-stream';
      return new File([blob], nameFromUrl, { type: mime });
    } catch {
      return null;
    }
  }
  async function getPlans() {

    const res = await axios.get<SubscriptionModel[]>(
      "http://192.168.1.4:8000/api/v1/subscription-model/"
    );

    const names: string[] = res.data
      .map((item) => item.planDefaultName?.trim())
      .filter((s): s is string => !!s && s.length > 0);
    const uniqueNames: string[] = Array.from(new Set<string>(names));
    setPlanNames(uniqueNames);
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const start = new Date(formData.subscriptionStartDate);
    const end = new Date(formData.subscriptionEndDate);
    if (isFinite(+start) && isFinite(+end) && end < start) {
      alert("End date must be on/after start date");
      setIsLoading(false);
      return;
    }

    try {
      const fd = new FormData();
      fd.append("companyName", formData.companyName || "");
      fd.append("clientName", formData.clientName || "");
      fd.append("clientEmail", formData.clientEmail || "");
      fd.append("clientMobileNo", formData.clientMobileNo || "");
      fd.append("gst", formData.gst || "");
      fd.append("currency", formData.currency || "");
      fd.append("subscription", formData.subscription || "");
      fd.append("subscriptionStatus", formData.subscriptionStatus || "");
      fd.append("subscriptionStartDate", formData.subscriptionStartDate || "");
      fd.append("subscriptionEndDate", formData.subscriptionEndDate || "");
      fd.append("clientAddress", formData.clientAddress || "");
      fd.append("status", formData.status || "");
      fd.append("noOfHotels", String(formData.noOfHotels ?? 0));
      fd.append("subscriptionDuration", formData.subscriptionDuration || "");
      fd.append("propertyCount", String(formData.propertyCount ?? 0));
      fd.append("isActive", String(!!formData.isActive));

      const uniqExisting = Array.from(new Set(existingUrls));
      const fileResults = await Promise.all(
        uniqExisting.map((u, i) => urlToFile(u, `existing_${i + 1}.jpg`))
      );
      const existingAsFiles = fileResults.filter((f): f is File => !!f);
      const failedUrls = uniqExisting.filter((_, i) => !fileResults[i]);

      const combined = [...existingAsFiles, ...newFiles];
      const filesToSend = combined.slice(0, MAX_IMAGES);
      filesToSend.forEach((file) => fd.append("image", file));

      if (editingData && failedUrls.length > 0) {
        failedUrls.forEach((u) => fd.append("existingImages[]", u));
      }

      if (editingData?.id) {
        await updateHotelOwner(String(editingData.id), fd);
        alert("Client updated successfully!");
      } else {
        await createHotelOwner(fd);
        alert("Client added successfully!");
      }
      onSaved?.();
      setShowModal(false);
    } catch (err: any) {
      alert(`Failed to save data. ${err?.message || "Please try again."}`);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-lg shadow-xl p-3">
        {/* Header */}
        <div className="relative mb-2">
          <h2 className="text-xl font-bold text-center text-blue-800">
            {editingData ? 'Edit Client Details' : 'Add New Client'}
          </h2>
          <button
            onClick={() => {
              setShowModal(false);
              onSaved?.();
            }}
            className="absolute top-0 right-0 text-gray-500 hover:text-red-600 transition-colors duration-200 text-3xl font-light"
            disabled={isLoading}
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Column 1 */}
          <div className="space-y-4">
            <div className="flex flex-col space-y-1">
              <label
                htmlFor="companyName"
                className="text-sm font-semibold text-gray-700"
              >
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                required
                placeholder="Enter company name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm 
               focus:outline-none  text-gray-900 placeholder-gray-400 transition-all"
              />
            </div>

            <div>
              <label
                htmlFor="companyName"
                className="text-sm font-semibold text-gray-700"
              >Email <span className="text-red-500">*</span></label>
              <input
                type="email"
                name="clientEmail"
                value={formData.clientEmail}
                onChange={handleChange}
                placeholder="Enter Eamil"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm 
               focus:outline-none  text-gray-900 placeholder-gray-400 transition-all"
                required
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700">GST Number </label>
              <input
                type="text"
                name="gst"
                value={formData.gst}
                onChange={handleChange}
                placeholder="Enter GST Number"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm 
               focus:outline-none  text-gray-900 placeholder-gray-400 transition-all"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700">
                Subscription <span className="text-red-500">*</span>
              </label>
              <select
                name="subscription"
                value={formData.subscription}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm 
             focus:outline-none text-gray-900 placeholder-gray-400 transition-all"
                required
              >
                <option value="">-- Select Plan --</option>
                {planNames.map((plan) => (
                  <option key={plan} value={plan}>
                    {plan}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700">Start Date <span className="text-red-500">*</span></label>
              <input
                type="date"
                name="subscriptionStartDate"
                value={formData.subscriptionStartDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm 
               focus:outline-none  text-gray-900 placeholder-gray-400 transition-all"
                required
              />
            </div>
          </div>

          {/* Column 2 */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-700">Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="clientName"
                value={formData.clientName}
                onChange={handleChange}
                placeholder="Enter Name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm 
               focus:outline-none  text-gray-900 placeholder-gray-400 transition-all"
                required
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700">Mobile Number <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="clientMobileNo"
                value={formData.clientMobileNo}
                onChange={handleChange}
                placeholder="Enter Mobile Number"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm 
               focus:outline-none  text-gray-900 placeholder-gray-400 transition-all"
                required
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700">Currency <span className="text-red-500">*</span></label>
              <select
                name="currency"
                value={formData.currency}
                onChange={handleChange}

                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm 
               focus:outline-none  text-gray-900 placeholder-gray-400 transition-all"
                required
              >
                <option value="INR">INR</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700">Subscription Status <span className="text-red-500">*</span></label>
              <select
                name="subscriptionStatus"
                value={formData.subscriptionStatus}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm 
               focus:outline-none  text-gray-900 placeholder-gray-400 transition-all"
                required
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Pending">Pending</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700">End Date <span className="text-red-500">*</span></label>
              <input
                type="date"
                name="subscriptionEndDate"
                value={formData.subscriptionEndDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm 
               focus:outline-none  text-gray-900 placeholder-gray-400 transition-all"
                required
              />
            </div>
          </div>

          {/* Column 3 */}
          <div>
            <div>
              <label htmlFor="clientAddress" className="text-sm font-semibold text-gray-700">
                Address <span className="text-red-500">*</span>
              </label>
              <input
                id="clientAddress"
                type="text"
                name="clientAddress"
                value={formData.clientAddress}
                onChange={handleChange}
                placeholder="Enter Address"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm 
               focus:outline-none  text-gray-900 placeholder-gray-400 transition-all"
                required
              />
            </div>
            <div>
              <label htmlFor="clientDocuments" className="block text-sm font-medium text-gray-700">
                Client Documents <span className="text-red-500">*</span>
              </label>
              <input
                id="clientDocuments"
                ref={fileInputRef}
                type="file"
                name="clientDocuments"
                multiple
                accept="image/*"
                onChange={handleChange}
                className="hidden"
              />
              <div className="flex items-center gap-2 mb-2">
                <button
                  type="button"
                  onClick={openPicker}
                  className="px-3 py-1.5  border border-gray-300 rounded-lg shadow-sm 
                   focus:outline-none  text-gray-900 placeholder-gray-400 transition-all"
                  disabled={existingUrls.length + newFiles.length >= MAX_IMAGES}
                >
                  Add +
                </button>
                <span className="text-xs text-gray-500">
                  {existingUrls.length + newFiles.length}/{MAX_IMAGES} images
                </span>
              </div>
              <div className="border border-gray-200 rounded-md p-2 bg-gray-50">
                <div className="grid grid-cols-3 gap-2">
                  {previewItems.map((item, i) => (
                    <div
                      key={i}
                      className="relative group border border-gray-200 rounded-md overflow-hidden h-20 w-20"
                    >
                      <img
                        src={item.url}
                        alt={item.kind === 'existing' ? `Client document ${i + 1}` : item.file.name}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (item.kind === 'existing') {
                            setExistingUrls((prev) => prev.filter((_, idx) => idx !== i));
                          } else {
                            const idx = newFiles.indexOf(item.file);
                            if (idx > -1) removeNewAt(idx);
                          }
                        }}
                        className="absolute top-1 right-1 hidden group-hover:block bg-white/90 border border-red-200 text-red-600 text-[10px] px-1.5 py-0.5 rounded"
                        aria-label="Remove image"
                        title="Remove"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  {Array.from({ length: Math.max(0, MAX_IMAGES - previewItems.length) }).map((_, k) => (
                    <button
                      key={`empty-${k}`}
                      type="button"
                      onClick={openPicker}
                      className="h-20 w-20 rounded-md border-2 border-dashed border-gray-300
                       flex items-center justify-center text-xs text-gray-500
                       hover:border-gray-400 hover:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      aria-label="Upload image"
                      title="Upload image"
                    >
                      + Upload
                    </button>
                  ))}
                </div>
              </div>
            </div>


            <div>
              <label className="text-sm font-semibold text-gray-700">
                Number of Hotels <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="noOfHotels"
                value={formData.noOfHotels}
                onChange={handleChange}
                placeholder="Enter Number Of Hotels"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-gray-900 placeholder-gray-400 transition-all"
                min="0"
                step="1"
                onWheel={(e) => (e.currentTarget as HTMLInputElement).blur()}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowUp' || e.key === 'ArrowDown') e.preventDefault();
                }}
                onInput={(e) => {
                  const target = e.target as HTMLInputElement;
                  target.value = target.value.replace(/^0+(?=\d)/, '');
                }}
                required
              />

            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700">
                Subscription Duration <span className="text-red-500">*</span>
              </label>
              <select
                name="subscriptionDuration"
                value={formData.subscriptionDuration}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none text-gray-900 placeholder-gray-400 transition-all"
                required
              >
                <option value="yearly">Yearly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>

          <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">

            <div>
              <label className="text-sm font-semibold text-gray-700">Property Count <span className="text-red-500">*</span></label>
              <input
                type="number"
                name="propertyCount"
                value={formData.propertyCount}
                onChange={handleChange}
                placeholder="Enter Property Count"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm 
               focus:outline-none  text-gray-900 placeholder-gray-400 transition-all"
                min="0"
                onWheel={(e) => (e.currentTarget as HTMLInputElement).blur()}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowUp' || e.key === 'ArrowDown') e.preventDefault();
                }}
                onInput={(e) => {
                  const target = e.target as HTMLInputElement;
                  target.value = target.value.replace(/^0+(?=\d)/, '');
                }}
                required
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-2">
                Active Status <span className="text-red-500">*</span>
              </label>

              <div
                className="w-full flex items-center gap-6 px-3 py-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="isActive"
                    value="true"
                    checked={formData.isActive === true}
                    onChange={() => setFormData((prev: any) => ({ ...prev, isActive: true }))}
                    className="text-blue-600 focus:ring-blue-500"
                    required
                  />
                  <span className="text-gray-700">Yes</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="isActive"
                    value="false"
                    checked={formData.isActive === false}
                    onChange={() => setFormData((prev: any) => ({ ...prev, isActive: false }))}
                    className="text-blue-600 focus:ring-blue-500"
                    required
                  />
                  <span className="text-gray-700">No</span>
                </label>
              </div>
            </div>


            <div className="flex items-end justify-center space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  onSaved?.();
                }}
                className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    Processing...
                  </span>
                ) : editingData ? 'Update' : 'Submit'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>

  );
};

export default ClientAdd;
