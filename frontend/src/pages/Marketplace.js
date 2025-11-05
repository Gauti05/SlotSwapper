import React, { useEffect, useState } from 'react';
import api from '../utils/api';

function Marketplace() {
  const [slots, setSlots] = useState([]);
  const [mySlots, setMySlots] = useState([]);
  const [selectedTheirSlot, setSelectedTheirSlot] = useState(null);
  const [selectedMySlot, setSelectedMySlot] = useState(null);
  const [loadingRequest, setLoadingRequest] = useState(false);

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const res = await api.get('/api/swappable-slots');
        setSlots(res.data);
        const resMy = await api.get('/api/events/my-swappable');
        setMySlots(resMy.data);
      } catch (err) {
        console.error('Error fetching slots:', err);
      }
    };
    fetchSlots();
  }, []);

  const requestSwap = async () => {
    if (!selectedMySlot) {
      alert('Please select one of your swappable slots.');
      return;
    }
    setLoadingRequest(true);
    try {
      await api.post('/api/swap-request', {
        mySlotId: selectedMySlot._id,
        theirSlotId: selectedTheirSlot._id,
      });
      alert('Swap request sent successfully!');

      // Clear selections
      setSelectedTheirSlot(null);
      setSelectedMySlot(null);

  
      const res = await api.get('/api/swappable-slots');
      setSlots(res.data);
    } catch (err) {
      alert('Failed to send swap request.');
      console.error(err);
    } finally {
      setLoadingRequest(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6">Swappable Slots Marketplace</h1>
      {slots.length === 0 ? (
        <p className="text-center mt-10 text-gray-600">No swappable slots available in the marketplace currently.</p>
      ) : (
        <ul className="space-y-4">
          {slots.map((slot) => (
            <li
              key={slot._id}
              className="flex justify-between items-center p-4 border rounded shadow hover:scale-105 transition-transform cursor-pointer"
            >
              <div>
                <h3 className="font-semibold">{slot.title}</h3>
                <p className="text-sm text-gray-600">
                  {new Date(slot.startTime).toLocaleString()} - {new Date(slot.endTime).toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">Owner: {slot.user.name}</p>
              </div>
              <button
                onClick={() => {
                  setSelectedTheirSlot(slot);
                  setSelectedMySlot(null);
                }}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
              >
                Request Swap
              </button>
            </li>
          ))}
        </ul>
      )}

      {selectedTheirSlot && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded p-8 max-w-md w-full shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Select Your Slot to Offer</h2>
            {mySlots.length === 0 ? (
              <p className="text-center text-gray-600 mb-6">You have no swappable slots available to offer.</p>
            ) : (
              <select
                className="w-full p-3 border rounded mb-6 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                value={selectedMySlot?._id || ''}
                onChange={e => setSelectedMySlot(mySlots.find(s => s._id === e.target.value))}
              >
                <option value="">-- Select Your Slot --</option>
                {mySlots.map((slot) => (
                  <option key={slot._id} value={slot._id}>
                    {slot.title} ({new Date(slot.startTime).toLocaleString()})
                  </option>
                ))}
              </select>
            )}
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setSelectedTheirSlot(null)}
                disabled={loadingRequest}
                className="px-4 py-2 rounded border hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={requestSwap}
                disabled={!selectedMySlot || loadingRequest}
                className={`px-4 py-2 rounded text-white ${
                  selectedMySlot && !loadingRequest ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-400 cursor-not-allowed'
                } transition`}
              >
                {loadingRequest ? (
                  <svg className="animate-spin h-5 w-5 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    ></path>
                  </svg>
                ) : (
                  'Send Request'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Marketplace;
