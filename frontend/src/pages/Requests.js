import React, { useEffect, useState } from 'react';
import api from '../utils/api';

function Requests() {
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  const [loadingResponseId, setLoadingResponseId] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await api.get('/api/swap-requests');
        setIncoming(res.data.incoming);
        setOutgoing(res.data.outgoing);
      } catch (err) {
        console.error('Error fetching swap requests:', err);
      }
    };
    fetchRequests();
  }, []);

  const respond = async (id, accept) => {
    setLoadingResponseId(id);
    try {
      await api.post(`/api/swap-response/${id}`, { accept });
      const res = await api.get('/api/swap-requests');
      setIncoming(res.data.incoming);
      setOutgoing(res.data.outgoing);
    } catch (err) {
      alert('Failed to respond to request.');
      console.error(err);
    } finally {
      setLoadingResponseId(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6">Swap Requests</h1>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Incoming Requests</h2>
        {incoming.length === 0 ? (
          <p className="text-gray-600">No incoming requests.</p>
        ) : (
          <ul className="space-y-4">
            {incoming.map(req => (
              <li key={req._id} className="border rounded p-4 flex justify-between items-center shadow hover:bg-gray-50 transition">
                <div>
                  <p><strong>Offer:</strong> {req.mySlot.title} ({new Date(req.mySlot.startTime).toLocaleString()})</p>
                  <p><strong>Your Slot:</strong> {req.theirSlot.title} ({new Date(req.theirSlot.startTime).toLocaleString()})</p>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => respond(req._id, true)}
                    disabled={loadingResponseId === req._id}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition disabled:opacity-50"
                  >
                    {loadingResponseId === req._id ? 'Processing...' : 'Accept'}
                  </button>
                  <button
                    onClick={() => respond(req._id, false)}
                    disabled={loadingResponseId === req._id}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition disabled:opacity-50"
                  >
                    {loadingResponseId === req._id ? 'Processing...' : 'Reject'}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Outgoing Requests</h2>
        {outgoing.length === 0 ? (
          <p className="text-gray-600">No outgoing requests.</p>
        ) : (
          <ul className="space-y-4">
            {outgoing.map(req => (
              <li key={req._id} className="border rounded p-4 shadow hover:bg-gray-50 transition">
                <p><strong>Your Offer:</strong> {req.mySlot.title} ({new Date(req.mySlot.startTime).toLocaleString()})</p>
                <p><strong>Requested:</strong> {req.theirSlot.title} ({new Date(req.theirSlot.startTime).toLocaleString()})</p>
                <p className="italic text-sm text-gray-600">Status: {req.status}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default Requests;

