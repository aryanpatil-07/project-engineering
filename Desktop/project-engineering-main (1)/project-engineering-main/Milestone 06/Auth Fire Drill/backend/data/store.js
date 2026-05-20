const users = [
  { id: 1, email: 'reader@example.com', password: 'reader123', name: 'Riley Reader', role: 'Reader' },
  { id: 2, email: 'contributor@example.com', password: 'contrib123', name: 'Casey Contributor', role: 'Contributor' },
  { id: 3, email: 'curator@example.com', password: 'curate123', name: 'Quinn Curator', role: 'Curator' },
  { id: 4, email: 'admin@example.com', password: 'admin123', name: 'Avery Admin', role: 'Admin' },
];

const fragments = [
  {
    id: 1,
    title: 'The first spark',
    body: 'A story begins with a whisper from the archive.',
    authorId: 2,
    authorRole: 'Contributor',
    status: 'pending',
    createdAt: '2026-05-02T08:00:00.000Z',
    updatedAt: '2026-05-02T08:00:00.000Z',
  },
  {
    id: 2,
    title: 'The hidden corridor',
    body: 'The second fragment was approved after a long wait.',
    authorId: 2,
    authorRole: 'Contributor',
    status: 'approved',
    createdAt: '2026-05-02T09:15:00.000Z',
    updatedAt: '2026-05-02T10:10:00.000Z',
  },
  {
    id: 3,
    title: 'Curator note',
    body: 'A private editorial note for the narrative team.',
    authorId: 3,
    authorRole: 'Curator',
    status: 'approved',
    createdAt: '2026-05-03T11:45:00.000Z',
    updatedAt: '2026-05-03T11:45:00.000Z',
  },
];

const storyThreads = [
  {
    id: 1,
    title: 'Opening arc',
    fragmentIds: [1, 2, 3],
  },
];

module.exports = { users, fragments, storyThreads };
