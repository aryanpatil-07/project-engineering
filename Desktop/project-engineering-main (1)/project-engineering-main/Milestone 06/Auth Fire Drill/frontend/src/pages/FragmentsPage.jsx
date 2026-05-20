import { useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function FragmentsPage() {
  const { user } = useAuth();
  const [fragments, setFragments] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const load = async () => {
      const { data } = await api.get('/fragments');
      setFragments(data.fragments || []);
    };

    load();
  }, []);

  const permissions = useMemo(() => ({
    canCreate: ['Contributor', 'Curator', 'Admin'].includes(user?.role),
    canApprove: ['Curator', 'Admin'].includes(user?.role),
    canDelete: user?.role === 'Admin',
  }), [user?.role]);

  const createFragment = async () => {
    const { data } = await api.post('/fragments', {
      title: 'New fragment',
      body: 'Fresh story beat from the UI.',
    });
    setFragments((current) => [data.fragment, ...current]);
  };

  const approveFragment = async (id) => {
    const { data } = await api.post(`/fragments/${id}/approve`);
    setFragments((current) => current.map((fragment) => (fragment.id === id ? data.fragment : fragment)));
  };

  const editFragment = async (fragment) => {
    const nextTitle = window.prompt('Update title', fragment.title);
    const nextBody = window.prompt('Update body', fragment.body);

    if (!nextTitle || !nextBody) {
      return;
    }

    const { data } = await api.put(`/fragments/${fragment.id}`, {
      title: nextTitle,
      body: nextBody,
    });

    setFragments((current) => current.map((entry) => (entry.id === fragment.id ? data.fragment : entry)));
  };

  const deleteFragment = async (id) => {
    await api.delete(`/fragments/${id}`);
    setFragments((current) => current.filter((fragment) => fragment.id !== id));
  };

  return (
    <main>
      <h1>Fragments</h1>
      {message ? <p>{message}</p> : null}
      {permissions.canCreate ? <button onClick={createFragment}>Add fragment</button> : null}
      <ul>
        {fragments.map((fragment) => (
          <li key={fragment.id}>
            <h2>{fragment.title}</h2>
            <p>{fragment.body}</p>
            <small>Status: {fragment.status}</small>
            <div>
              {fragment.canEdit ? (
                <button onClick={() => editFragment(fragment)}>Edit</button>
              ) : null}
              {permissions.canApprove && fragment.status === 'pending' ? (
                <button onClick={() => approveFragment(fragment.id)}>Approve</button>
              ) : null}
              {permissions.canDelete ? (
                <button onClick={() => deleteFragment(fragment.id)}>Delete</button>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
