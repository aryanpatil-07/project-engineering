# Role-Based Access Control Audit

## Role Gap Audit

Static audit of the codebase before the fix:

- `GET /api/expenses` succeeded for any authenticated user because only `protect` was applied.
- `PUT /api/expenses/:id/approve` succeeded for any authenticated user because only `protect` was applied.
- `PUT /api/expenses/:id/reject` succeeded for any authenticated user because only `protect` was applied.
- `DELETE /api/expenses/:id` succeeded for any authenticated user because only `protect` was applied.
- `GET /api/users` succeeded for any authenticated user because only `protect` was applied.
- `PUT /api/users/:id/role` succeeded for any authenticated user because only `protect` was applied.
- `PUT /api/expenses/:id` allowed any authenticated user to modify any expense because there was no ownership check.
- `DELETE /api/expenses/:id` also lacked an ownership or role gate inside the controller.

## Checkpoint 1

`models/User.js` already had `role` defined with `enum: ['user', 'manager', 'admin']` and `default: 'user'`.

`controllers/authController.js` generated JWTs with `{ userId, email }` only, so `role` was missing from the token payload.

Consequence: any middleware that relied on `req.user.role` from JWT data would see `undefined` and fail role checks.

## Checkpoint 2

No `requireRole` middleware existed anywhere in the codebase before the fix.

Only `protect` was present, so the app authenticated users but did not authorize roles.

## Checkpoint 3

| Route                           | Sensitive? | Currently Restricted? | Should Be Restricted To                |
| ------------------------------- | ---------: | --------------------: | -------------------------------------- |
| `GET /api/expenses`             |        Yes |                    No | `manager`, `admin`                     |
| `GET /api/expenses/mine`        |         No |    Authenticated only | `user`, `manager`, `admin`             |
| `POST /api/expenses`            |        Yes |                    No | `user`, `manager`, `admin`             |
| `PUT /api/expenses/:id`         |        Yes |                    No | Owner only for submitted expense edits |
| `PUT /api/expenses/:id/approve` |        Yes |                    No | `manager`, `admin`                     |
| `PUT /api/expenses/:id/reject`  |        Yes |                    No | `manager`, `admin`                     |
| `DELETE /api/expenses/:id`      |        Yes |                    No | `admin`                                |
| `GET /api/users`                |        Yes |                    No | `admin`                                |
| `PUT /api/users/:id/role`       |        Yes |                    No | `admin`                                |
| `GET /api/users/me`             |         No |    Authenticated only | `user`, `manager`, `admin`             |

## Checkpoint 4

`controllers/expenseController.js` updated and deleted expenses with no ownership verification.

That meant `User A` could edit or delete `User B`'s expense if they knew the expense ID.

## Root Cause Analysis

The root cause was authorization missing from the request path. Authentication existed (`protect`), but routes never checked role membership and the expense update/delete controllers never checked resource ownership. As a result, any logged-in user could reach sensitive controller logic and act on records they did not own.

## Access Model

| Action               | Endpoint                        | Allowed Roles              | Current State Before Fix           |
| -------------------- | ------------------------------- | -------------------------- | ---------------------------------- |
| Submit an expense    | `POST /api/expenses`            | `user`, `manager`, `admin` | Allowed for any authenticated user |
| View own expenses    | `GET /api/expenses/mine`        | `user`, `manager`, `admin` | Allowed                            |
| View ALL expenses    | `GET /api/expenses`             | `manager`, `admin`         | Allowed for any authenticated user |
| Approve an expense   | `PUT /api/expenses/:id/approve` | `manager`, `admin`         | Allowed for any authenticated user |
| Reject an expense    | `PUT /api/expenses/:id/reject`  | `manager`, `admin`         | Allowed for any authenticated user |
| Delete an expense    | `DELETE /api/expenses/:id`      | `admin` only               | Allowed for any authenticated user |
| View all users       | `GET /api/users`                | `admin` only               | Allowed for any authenticated user |
| Change a user's role | `PUT /api/users/:id/role`       | `admin` only               | Allowed for any authenticated user |
| View own profile     | `GET /api/users/me`             | `user`, `manager`, `admin` | Allowed                            |

## What I Fixed

### JWT payload now includes role

**Before**

```js
jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, {
  expiresIn: "7d",
});
```

**After**

```js
jwt.sign(
  { userId: user._id, email: user.email, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: "7d" },
);
```

### Added role middleware

**Before**

```js
router.get("/", protect, getAllUsers);
```

**After**

```js
router.get("/", protect, requireRole("admin"), getAllUsers);
```

### Added ownership checks for expense edits/deletes

**Before**

```js
const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, {
  new: true,
});
```

**After**

```js
const expense = await Expense.findById(req.params.id);
const isOwner = expense.submittedBy.toString() === req.user._id.toString();
const isPrivileged = req.user.role === "admin";

if (!isOwner && !isPrivileged) {
  return res
    .status(403)
    .json({ message: "You can only modify your own expenses." });
}
```

## Verification Results

Not run, per instruction.

| Scenario                                           | Token Used (Role) | Expected Status | Actual Status | Screenshot Filename                  |
| -------------------------------------------------- | ----------------- | --------------: | ------------: | ------------------------------------ |
| Regular user tries `PUT /api/expenses/:id/approve` | `user`            |             403 |       Not run | `screenshots/01-user-approve.png`    |
| Regular user tries `DELETE /api/expenses/:id`      | `user`            |             403 |       Not run | `screenshots/02-user-delete.png`     |
| Regular user tries `PUT /api/users/:id/role`       | `user`            |             403 |       Not run | `screenshots/03-user-role.png`       |
| Regular user tries to edit another user's expense  | `user`            |             403 |       Not run | `screenshots/04-user-edit.png`       |
| Manager approves an expense                        | `manager`         |             200 |       Not run | `screenshots/05-manager-approve.png` |
| Manager tries to change a user's role              | `manager`         |             403 |       Not run | `screenshots/06-manager-role.png`    |
| Admin deletes an expense                           | `admin`           |             200 |       Not run | `screenshots/07-admin-delete.png`    |
| Admin changes a user's role                        | `admin`           |             200 |       Not run | `screenshots/08-admin-role.png`      |
