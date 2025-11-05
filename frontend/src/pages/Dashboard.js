import React, { useState, useEffect } from 'react';
import api from '../utils/api';

function Dashboard() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({ title: '', startTime: '', endTime: ''});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      const res = await api.get('/api/events');
      setEvents(res.data);
    };
    fetchEvents();
  }, []);

  const addEvent = async () => {
    if (!form.title || !form.startTime || !form.endTime) return alert('Fill all fields');
    setLoading(true);
    try {
      const res = await api.post('/api/events', {...form, status: 'BUSY'});
      setEvents(prev => [...prev, res.data]);
      setForm({ title: '', startTime: '', endTime: ''});
    } catch (err) {
      alert('Failed to add event');
    } finally {
      setLoading(false);
    }
  };

  const toggleSwappable = async event => {
    const newStatus = event.status === 'SWAPPABLE' ? 'BUSY' : 'SWAPPABLE';
    const res = await api.put(`/api/events/${event._id}`, { status: newStatus });
    setEvents(prev => prev.map(e => e._id === event._id ? res.data : e));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Your Events</h1>
      
      <div className="space-y-3 mb-6">
        <input
          className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-600"
          placeholder="Event title"
          value={form.title}
          onChange={e => setForm({...form, title: e.target.value})}
        />
        <input
          type="datetime-local"
          className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-600"
          value={form.startTime}
          onChange={e => setForm({...form, startTime: e.target.value})}
        />
        <input
          type="datetime-local"
          className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-600"
          value={form.endTime}
          onChange={e => setForm({...form, endTime: e.target.value})}
        />
        <button
          disabled={loading}
          onClick={addEvent}
          className={`w-full py-2 rounded text-white font-bold ${
            loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
          } transition`}
        >
          {loading ? 'Adding...' : 'Add Event'}
        </button>
      </div>

      <ul className="space-y-4">
        {events.map(e => (
          <li key={e._id} className="flex justify-between items-center p-4 border rounded shadow hover:scale-105 transition-transform">
            <div>
              <h3 className="font-semibold">{e.title}</h3>
              <p className="text-sm text-gray-600">{new Date(e.startTime).toLocaleString()} - {new Date(e.endTime).toLocaleString()}</p>
              <span className={`inline-block mt-1 px-2 py-1 text-xs rounded ${e.status === 'SWAPPABLE' ? 'bg-green-200 text-green-900' : 'bg-gray-300 text-gray-700'}`}>
                {e.status}
              </span>
            </div>
            {(e.status === 'BUSY' || e.status === 'SWAPPABLE') && (
              <button
                onClick={() => toggleSwappable(e)}
                className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 transition"
              >
                {e.status === 'SWAPPABLE' ? 'Remove Swappable' : 'Make Swappable'}
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;


