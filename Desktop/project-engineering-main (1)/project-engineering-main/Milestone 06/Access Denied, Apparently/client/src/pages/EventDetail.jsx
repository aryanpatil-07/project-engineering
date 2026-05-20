import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      setError('');
      const { data } = await api.get(`/events/${id}`);
      setEvent(data.event);
    } catch (err) {
      setEvent(null);
      setError(err.response?.data?.error || 'Unable to load this event');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const handleRsvp = async () => {
    try {
      const { data } = await api.post(`/events/${id}/rsvp`);
      setEvent(data.event);
    } catch (err) {
      setError(err.response?.data?.error || 'RSVP failed');
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/events/${id}`);
      navigate('/events');
    } catch (err) {
      setError(err.response?.data?.error || 'Delete failed');
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading event...</div>;
  }

  if (error && !event) {
    return (
      <div className="mx-auto max-w-3xl p-6">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  if (!event) {
    return null;
  }

  return (
    <div className="mx-auto max-w-3xl p-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4">
          <p className="text-sm uppercase tracking-wide text-slate-500">Event details</p>
          <h1 className="text-3xl font-semibold text-slate-900">{event.title}</h1>
          <p className="mt-2 text-slate-600">{event.description}</p>
        </div>

        <dl className="grid gap-3 rounded-xl bg-slate-50 p-4 text-sm text-slate-700 sm:grid-cols-2">
          <div>
            <dt className="font-medium text-slate-500">Location</dt>
            <dd>{event.location}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-500">Invitation status</dt>
            <dd>{event.isInvited ? 'Invited' : 'Not invited'}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-500">Your RSVP</dt>
            <dd>{event.hasRsvped ? 'Confirmed' : "Not yet RSVP'd"}</dd>
          </div>
          <div>
            <dt className="font-medium text-slate-500">Ownership</dt>
            <dd>{event.isCreator ? 'You created this event' : 'You are a guest'}</dd>
          </div>
        </dl>

        {error ? (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <div className="mt-6 flex flex-wrap gap-3">
          {event.isInvited && !event.hasRsvped ? (
            <button
              type="button"
              onClick={handleRsvp}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-white transition hover:bg-indigo-700"
            >
              RSVP
            </button>
          ) : null}

          {event.isCreator ? (
            <button
              type="button"
              onClick={handleDelete}
              className="rounded-lg bg-rose-600 px-4 py-2 text-white transition hover:bg-rose-700"
            >
              Delete
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
