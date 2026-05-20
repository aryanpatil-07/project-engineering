const users = [
  { id: 1, email: 'account-a@example.com', name: 'Account A' },
  { id: 2, email: 'account-b@example.com', name: 'Account B' },
  { id: 3, email: 'friend@example.com', name: 'Friend' },
];

const events = [
  {
    id: 1,
    title: 'Team Planning Session',
    description: 'Planning for the upcoming product sprint.',
    location: 'Conference Room A',
    creatorId: 1,
    invitedEmails: ['account-b@example.com'],
    rsvpEmails: [],
    createdAt: '2026-05-01T10:00:00.000Z',
    updatedAt: '2026-05-01T10:00:00.000Z',
  },
  {
    id: 2,
    title: 'Private Launch Dinner',
    description: 'Invite-only dinner for launch participants.',
    location: 'Rooftop Lounge',
    creatorId: 1,
    invitedEmails: ['friend@example.com'],
    rsvpEmails: ['friend@example.com'],
    createdAt: '2026-05-02T09:30:00.000Z',
    updatedAt: '2026-05-02T09:30:00.000Z',
  },
  {
    id: 3,
    title: 'Open Community Meetup',
    description: 'A session open to invited collaborators.',
    location: 'Main Hall',
    creatorId: 2,
    invitedEmails: ['account-a@example.com', 'account-b@example.com'],
    rsvpEmails: ['account-b@example.com'],
    createdAt: '2026-05-03T14:15:00.000Z',
    updatedAt: '2026-05-03T14:15:00.000Z',
  },
];

module.exports = {
  users,
  events,
};
