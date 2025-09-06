'use client';

import { useEffect, useState } from 'react';

type TaskSheetData = {
  id?: string | number;
  clientId: string;
  propertyId: string;
  taskType: string;
  taskMessage: string;
  roomNo: string;
  houseKeeper: string;
  taskGivenBy: string;
  taskCompletedBy: string;
  taskStatus: string;
  taskAssignDate: string;
  taskCompletionDate: string;
  deadline: string;
  priority: string;

};

type TaskSheetAddProps = {
  setShowModal: (value: boolean) => void;
  editingData?: TaskSheetData | null;
  onSaved?: () => void;
};

const TaskSheetAdd = ({ setShowModal, editingData, onSaved }: TaskSheetAddProps) => {
  const initialFormData = {
    clientId: '',
    propertyId: '',
    taskType: '',
    taskMessage: '',
    roomNo: '',
    houseKeeper: '',
    taskGivenBy: '',
    taskCompletedBy: '',
    taskStatus: '',
    taskAssignDate: '',
    taskCompletionDate: '',
    deadline: '',
    priority: '',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [isLoading, setIsLoading] = useState(false);

  // Format date for input fields
  const formatDateForInput = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  useEffect(() => {
    if (editingData) {
      const taskdata = {
        clientId: editingData.clientId || '',
        propertyId: editingData.propertyId || '',
        taskType: editingData.taskType || '',
        taskMessage: editingData.taskMessage || '',
        roomNo: editingData.roomNo || '',
        houseKeeper: editingData.houseKeeper || '',
        taskGivenBy: editingData.taskGivenBy || '',
        taskCompletedBy: editingData.taskCompletedBy || '',
        taskStatus: editingData.taskStatus || '',
 
        taskAssignDate: formatDateForInput(editingData.taskAssignDate),
        taskCompletionDate: formatDateForInput(editingData.taskCompletionDate),

        
        deadline: editingData.deadline || '',

        priority: editingData.priority || '',
      };
      setFormData(taskdata);
    } else {
      setFormData(initialFormData);
    }
  }, [editingData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'noOfHotels' || name === 'propertyCount' ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const url = editingData
      ? `http://192.168.1.4:8000/api/v1/task-sheet/update/${editingData.id}`
      : `http://192.168.1.4:8000/api/v1/task-sheet/create`;

    const method = editingData ? 'PUT' : 'POST';

    const trimmedData = {
      clientId: formData.clientId.trim(),
      propertyId: formData.propertyId.trim(),
      taskType: formData.taskType.trim(),
      taskMessage: formData.taskMessage.trim(),
      roomNo: formData.roomNo.trim(),
      houseKeeper: formData.houseKeeper.trim(),
      taskGivenBy: formData.taskGivenBy.trim(),
      taskCompletedBy: formData.taskCompletedBy.trim(),
      taskStatus: formData.taskStatus.trim(),
      taskAssignDate: new Date(formData.taskAssignDate).toISOString(),
      taskCompletionDate: new Date(formData.taskCompletionDate).toISOString(),
      deadline: formData.deadline.trim(),
      priority: formData.priority.trim(),
    };

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(trimmedData),
      });

      if (!response.ok) {
        const result = await response.json();
        console.error('Backend error:', result);
        throw new Error(result.message || 'HTTP error');
      }

      alert(editingData ? 'Task updated successfully!' : 'Task added successfully!');
      onSaved?.();
      setShowModal(false);
    } catch (error) {
      console.error('Error:', error);
      alert(`Failed to save data. ${error instanceof Error ? error.message : 'Please try again.'}`);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg shadow-lg p-6 my-10">

        <div className="relative mb-4">
          <h2 className="text-xl font-bold text-center text-blue-900">
            {editingData ? 'Edit Task' : 'Add Task'}
          </h2>
          <div className="absolute top-0 right-0">
            <button
              onClick={() => {
                setShowModal(false);
                onSaved?.();
              }}
              className="text-gray-900 hover:text-red-500 text-2xl font-bold"
              disabled={isLoading}
            >
              &times;
            </button>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div>
            <label className="block text-sm font-medium">clientId</label>
            <input
              type="text"
              name="clientId"
              value={formData.clientId}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>


          <div>
            <label className="block text-sm font-medium">CpropertyId</label>
            <input
              type="text"
              name="propertyId"
              value={formData.propertyId}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>


          <div>
            <label className="block text-sm font-medium">taskType</label>
            <input
              type="text"
              name="taskType"
              value={formData.taskType}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>


          <div>
            <label className="block text-sm font-medium">taskMessage</label>
            <input
              type="text"
              name="taskMessage"
              value={formData.taskMessage}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>


          <div>
            <label className="block text-sm font-medium">roomNo</label>
            <input
              type="text"
              name="roomNo"
              value={formData.roomNo}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>



          <div>
            <label className="block text-sm font-medium">houseKeeper</label>
            <input
              type="text"
              name="houseKeeper"
              value={formData.houseKeeper}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">taskGivenBy</label>
            <input
              type="text"
              name="taskGivenBy"
              value={formData.taskGivenBy}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">taskCompletedBy</label>
            <input
              type="text"
              name="taskCompletedBy"
              value={formData.taskCompletedBy}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">taskStatus</label>
            <input
              type="text"
              name="taskStatus"
              value={formData.taskStatus}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>


          <div>
            <label className="block text-sm font-medium">taskAssignDate</label>
            <input
              type="date"
              name="taskAssignDate"
              value={formData.taskAssignDate}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              min="0"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">taskCompletionDate</label>
            <input
              type="date"
              name="taskCompletionDate"
              value={formData.taskCompletionDate}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              min="0"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">deadline</label>
            <input
              type="text"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              min="0"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">priority</label>
            <input
              type="text"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
              min="0"
              required
            />
          </div>


          <div className="md:col-span-2 flex justify-end pt-4 space-x-3">
            <button
              type="button"
              onClick={() => {
                setShowModal(false);
                onSaved?.();
              }}
              className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : editingData ? 'Update' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskSheetAdd;