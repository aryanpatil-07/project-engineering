# Access Denied, Apparently — Investigation Notes

## Suspicious behavior found before fixing anything

- `GET /api/events` appears to return every event instead of limiting the list to events created by the current user or events the current user was invited to.
- `GET /api/events/:id` appears to disclose full event details even when the requester is not invited.
- `POST /api/events/:id/rsvp` appears to allow RSVP requests from users who were not invited.
- `POST /api/events/:id/rsvp` also appears to allow duplicate RSVPs from the same user.
- `DELETE /api/events/:id` appears to allow non-creators to delete events.
- `client/src/pages/EventDetail.jsx` appears to render RSVP and Delete buttons based only on login state instead of actual permissions.

## Scope for the fix

- Return only authorized events from the event list.
- Block private event detail views for uninvited users.
- Enforce invitation and duplicate checks before RSVP.
- Enforce ownership before deletion.
- Hide action buttons in the UI unless the user has permission.

## Fixes applied

- `server/routes/events.js` now filters the event list, blocks uninvited detail access, checks invitation and RSVP duplicates, and enforces creator-only deletion.
- `server/routes/events.js` now includes `isInvited`, `isCreator`, and `hasRsvped` flags in event payloads so the frontend can make permission-aware decisions.
- `client/src/pages/EventDetail.jsx` now renders RSVP and Delete actions only when the response flags allow it.
- `client/src/pages/Events.jsx` shows only events the current user is allowed to see.
