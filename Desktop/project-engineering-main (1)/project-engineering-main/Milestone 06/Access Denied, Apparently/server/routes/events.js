const express = require('express');
const auth = require('../middleware/auth');
const { events } = require('../data/store');

const router = express.Router();

function findEvent(eventId) {
  return events.find((event) => event.id === Number(eventId));
}

function getEventAccessFlags(event, user) {
  const isCreator = event.creatorId === user.id;
  const isInvited = event.invitedEmails.includes(user.email);
  const hasRsvped = event.rsvpEmails.includes(user.email);

  return {
    isCreator,
    isInvited,
    hasRsvped,
  };
}

function serializeEvent(event, user) {
  return {
    ...event,
    ...getEventAccessFlags(event, user),
  };
}

function canAccessEvent(event, user) {
  return event.creatorId === user.id || event.invitedEmails.includes(user.email);
}

router.get('/', auth, (req, res) => {
  const visibleEvents = events
    .filter((event) => canAccessEvent(event, req.user))
    .map((event) => serializeEvent(event, req.user));

  return res.json({ events: visibleEvents });
});

router.get('/:id', auth, (req, res) => {
  const event = findEvent(req.params.id);

  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }

  if (!canAccessEvent(event, req.user)) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  return res.json({ event: serializeEvent(event, req.user) });
});

router.post('/:id/rsvp', auth, (req, res) => {
  const event = findEvent(req.params.id);

  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }

  if (!event.invitedEmails.includes(req.user.email)) {
    return res.status(403).json({ error: 'You are not invited to this event' });
  }

  if (event.rsvpEmails.includes(req.user.email)) {
    return res.status(400).json({ error: 'You have already RSVPed to this event' });
  }

  event.rsvpEmails.push(req.user.email);
  event.updatedAt = new Date().toISOString();

  return res.status(200).json({ event: serializeEvent(event, req.user) });
});

router.delete('/:id', auth, (req, res) => {
  const eventIndex = events.findIndex((event) => event.id === Number(req.params.id));

  if (eventIndex === -1) {
    return res.status(404).json({ error: 'Event not found' });
  }

  const event = events[eventIndex];

  if (req.user.id !== event.creatorId) {
    return res.status(403).json({ error: 'Only the creator can delete this event' });
  }

  events.splice(eventIndex, 1);

  return res.status(200).json({ message: 'Event deleted successfully' });
});

module.exports = router;
