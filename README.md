# Personalized Wedding Invitation

A single-wedding site built with Next.js App Router, TypeScript, MongoDB, and Mongoose. Admin operations are available through protected API routes; guest links use random tokens while only their SHA-256 hashes are stored.

## Requirements

- Node.js 22.6 or newer
- npm
- MongoDB Community Server (local) or a MongoDB Atlas cluster

## Install and configure

```bash
npm install
cp .env.example .env.local
```

Set the following values in `.env.local`:

| Variable | Purpose |
| --- | --- |
| `MONGODB_URI` | MongoDB connection string |
| `SESSION_SECRET` | At least 32 random bytes, used to sign admin sessions |
| `NEXT_PUBLIC_APP_URL` | Public site origin used when generating invitation links |
| `ADMIN_NAME` | Name for the one-time initial admin setup |
| `ADMIN_EMAIL` | Email for the one-time initial admin setup |
| `ADMIN_PASSWORD` | Initial password; use at least 12 characters |

Generate a session secret with `openssl rand -base64 32`. Do not commit `.env.local` or share its contents.

### Local MongoDB

Install and start MongoDB Community Server, then use a local connection string such as:

```text
MONGODB_URI=mongodb://127.0.0.1:27017/wedding_invitation
```

### MongoDB Atlas

Create a cluster, a database user with a strong password, and allow connections from the application host in Atlas Network Access. Copy the application connection string from **Connect → Drivers**, replace the username/password/database placeholders, and URL-encode special characters in credentials. Do not use an unrestricted `0.0.0.0/0` rule in production.

## Initialize the admin account

The site has no public registration API. Set `ADMIN_NAME`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` in the environment, then run:

```bash
npm run admin:init
```

The script hashes the password with bcrypt, creates the unique email index, and uses a fixed singleton ID so only one admin can be inserted. The script refuses to run again after an admin exists. Remove the initialization-only `ADMIN_*` values from deployment secrets after setup.

## Run and validate

```bash
npm run dev
npm run test
npm run test:integration
npm run typecheck
npm run lint
npm run build
```

Visit `http://localhost:3000`. The home page works without an invitation link. An individual invitation is served at `/invite/<token>`.

The private admin dashboard is at `/admin`; sign in at `/admin/login` with the account created by `npm run admin:init`. Guests have no sign-up or sign-in page, and the admin sign-in is not linked from the public wedding site. The dashboard lets the admin create, edit, filter, revoke/reactivate, and delete guest invitations, and manage the public wedding details. A new guest's invitation URL is displayed only once when created, so copy and save it at that time.

`npm run test:integration` starts the production app against a temporary, uniquely named database within the configured MongoDB server, then cleans up only the test records it creates. Run it only against a local/development cluster; never point integration tests at production data.

## API

All responses use `{ "success": true, "data": ... }` on success and a generic error message on failure. Admin routes require the `wedding_admin_session` HTTP-only cookie created by login. Mutating requests also require a same-origin `Origin` header.

### Authentication

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/api/auth/login` | Sign in with email and password |
| `POST` | `/api/auth/logout` | Clear the admin session |
| `GET` | `/api/auth/me` | Return the current admin identity |

Login requests are limited to five attempts per 15-minute window by both normalized email and source IP. In production, configure the trusted reverse proxy to overwrite `X-Forwarded-For`; do not accept a client-supplied forwarding header as the source address.

### Guest management (admin)

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/api/admin/guests` | Create guest and return its invitation URL once |
| `GET` | `/api/admin/guests` | List guests; supports `search`, `guestType`, `invitationStatus`, `page`, `limit` |
| `GET` | `/api/admin/guests/:id` | Retrieve one guest |
| `PATCH` | `/api/admin/guests/:id` | Update guest details |
| `DELETE` | `/api/admin/guests/:id` | Delete guest |
| `POST` | `/api/admin/guests/:id/revoke` | Revoke the public invitation URL |
| `POST` | `/api/admin/guests/:id/reactivate` | Reactivate the existing URL |

Create a guest by sending a JSON body such as:

```json
{
  "guestType": "couple",
  "primaryGuestName": "Mahesh",
  "secondaryGuestName": "Amaya",
  "email": "mahesh@example.com"
}
```

The response contains the guest record and an `invitationUrl`. The plaintext token is not saved and cannot be retrieved again. Save or share the URL from that response; if it is lost, delete the guest and create a replacement. For an individual use `guestType: "individual"`; for a family use `guestType: "family"` and `primaryGuestName` for the greeting.

### Wedding and invitations

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/wedding` | Public wedding configuration for homepage display |
| `GET` | `/api/invitations/:token` | Resolve active invitation into public greeting and wedding details |
| `GET` | `/api/admin/wedding` | Retrieve wedding configuration (admin) |
| `POST` | `/api/admin/wedding` | Create the wedding configuration once (admin) |
| `PUT` | `/api/admin/wedding` | Create or replace the single configuration (admin) |

Wedding input fields: `groomName`, `brideName`, `weddingDate` (`YYYY-MM-DD`), `weddingTime`, `venueName`, `venueAddress`, `googleMapsUrl`, `dressCode`, and `weddingDescription`. Configure the single wedding with `POST`, then update it with `PUT`. `PUT` also creates it if it does not yet exist.

Invitation tokens are generated using a cryptographically secure random source. MongoDB stores only the SHA-256 token hash and a unique index prevents collisions. Revoked or unknown tokens return the same not-found response. The public invitation endpoint excludes IDs, contact details, token hashes, and admin data.

## Security notes

- Admin sessions are short-lived signed jose tokens in HTTP-only, `SameSite=Lax` cookies; `Secure` is enabled in production.
- Admin passwords are bcrypt-hashed. Admin and guest API serializers never return password or token hashes.
- `SESSION_SECRET` must be long, random, and private. Rotate it to invalidate all current sessions.
- Admin API operations require an authenticated session. There is intentionally no admin registration endpoint.
- Login throttle state is stored in MongoDB rather than process memory so it persists across app instances.
# wedding-invitation-
