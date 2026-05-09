import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await api.get('/events');
        setEvents(data.events || []);
      } catch (err) {
        setError(err.response?.data?.error || 'Unable to load events');
      }
    };

    fetchEvents();
  }, []);

  if (error) {
    return <div className="p-6 text-red-600">{error}</div>;
  }

  return (
    <div className="mx-auto max-w-5xl p-6">
      <h1 className="mb-6 text-3xl font-semibold text-slate-900">Your Events</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        {events.map((event) => (
          <article key={event.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm uppercase tracking-wide text-slate-500">
              {event.isCreator ? 'Created by you' : 'Invited'}
            </p>
            <h2 className="mt-2 text-xl font-semibold text-slate-900">{event.title}</h2>
            <p className="mt-2 text-slate-600">{event.description}</p>
            <Link
              className="mt-4 inline-flex rounded-lg bg-indigo-600 px-4 py-2 text-white transition hover:bg-indigo-700"
              to={`/events/${event.id}`}
            >
              View details
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}