# MEDCARE CONNECT
## Software Project Viva and Demonstration

**Section:** C  
**Date:** 29/09/2026  
**Time:** 2:00–4:00 PM  
**Room:** 1503  
**Presenter(s):** ______________________________

---

## Project Summary

MedCare Connect is a mobile-first healthcare appointment application. Patients can create an account, browse and search doctors by name or specialty, view consultation details, select an appointment date and available time, confirm the booking, and manage or cancel appointments.

**Problem addressed:** Patients need a simple way to discover doctors and keep their appointment details organized.

**Primary users:** Patients looking for a doctor or managing an appointment.

**Project flow:**

`Register / Sign in → Home → Search or Specialty → Doctor Details → Choose Date and Time → Confirmation → My Appointments`

## Suggested 5–7 Minute Demonstration

### 1. Introduce the project | 30 seconds

Say:

> “Good afternoon. We are presenting MedCare Connect, a healthcare appointment application. It helps patients find doctors, review their specialties and availability, book a consultation, and manage their appointments.”

### 2. Sign in or register | 45 seconds

- Open the app at the login screen.
- For a first-time demo, register with a demo name, email, and password of at least eight characters.
- Explain that passwords are hashed on the server and the signed-in session is restored when the app is reopened.

### 3. Home and doctor discovery | 1 minute

- Point out the greeting and doctor-search field.
- Search using a doctor name or specialty.
- Select one of the specialty shortcuts and show the filtered doctor results.
- Explain that the doctor information comes from the PostgreSQL database through the API.

### 4. Doctor details | 45 seconds

- Open a doctor profile.
- Show the specialty, experience, rating, availability, and consultation fee.
- Explain that the profile is loaded using that doctor’s ID.

### 5. Book an appointment | 1–2 minutes

- Tap **Book appointment**.
- Choose a future date and one of the available time slots.
- Confirm the booking.
- Point out the confirmation screen and appointment reference.

### 6. My appointments | 45 seconds

- Open **My appointments**.
- Show the saved doctor, date, time, fee, and status.
- If time permits, cancel the demo appointment and explain that cancellation changes its status and releases the time slot.

### 7. Close | 15 seconds

Say:

> “This demonstration covered the patient flow from account creation through appointment management. MedCare Connect uses Expo for the cross-platform app, Express for the API, and PostgreSQL for persistent data.”

## Presenter Preparation

- Start PostgreSQL and confirm the database contains the existing `doctors` table and doctor rows.
- Start the backend and confirm it reports that it is running on port `5001`.
- Start the Expo app and sign in with a prepared demo account, or be ready to register one.
- Keep one future doctor slot available for the live booking.
- Do not use a personal password or real patient information during the presentation.
- On an Android emulator, the app reaches the host API at `10.0.2.2:5001`. On web or an iOS simulator, the default is `localhost:5001`. A physical phone needs the laptop’s LAN IP in `EXPO_PUBLIC_API_URL`.

**Windows CMD startup:**

```cmd
cd /d "C:\path\to\MedCare\backend"
npm install
npm start
```

In a second CMD window:

```cmd
cd /d "C:\path\to\MedCare\MedCareMobile"
npm install
npm run web
```

The backend reads its database settings and JWT secret from `backend/.env`. The app creates the `app_users` and `appointments` tables at backend startup; the existing `doctors` table must already be present.

New registrations are always assigned the `patient` role. Accounts have a unique numeric ID and email in `app_users`; the role is also stored there. To promote an account, a trusted database operator can run `UPDATE app_users SET role = 'doctor' WHERE email = 'doctor@example.com';` (or use `admin` instead of `doctor`). Never accept doctor/admin roles from public registration. Roles identify account types, but doctor/admin dashboards and role-specific workflows are not implemented in this version.

## Architecture

| Layer | Technology | Responsibility |
|---|---|---|
| Mobile and web client | React Native, Expo SDK 56, Expo Router | Screens, navigation, input, date/time selection, and session-aware routing |
| API | Node.js, Express | Authentication, doctor search/details, booking, appointment listing, and cancellation |
| Database | PostgreSQL with `pg` | Doctor records, user accounts, and appointment records |
| Authentication | `bcryptjs`, JWT | Password hashing and bearer-token sessions |
| Session storage | Expo SecureStore on mobile; browser local storage on web | Persist the signed-in token on the client |

**API routes:**

- `POST /auth/register` — create an account and return a signed-in session.
- `POST /auth/login` — verify credentials and return a signed-in session.
- `GET /auth/me` — return the current account for a valid bearer token.
- `GET /doctors?search=...&specialization=...` — search/filter doctors.
- `GET /doctors/:id` — load a doctor profile.
- `GET /appointments` — list appointments belonging to the signed-in patient.
- `POST /appointments` — validate and create a booking.
- `DELETE /appointments/:id` — cancel a confirmed appointment owned by the patient.

The API defaults to port `5001` to avoid the older MedCare service on port `5000`.

## Likely Viva Questions

### 1. What problem does MedCare Connect solve?

It provides a single patient flow for finding a doctor, reviewing consultation information, booking a visit, and managing the resulting appointment.

### 2. Why did you use Expo and React Native?

They allow us to build a shared application for Android, iOS, and web while using React components and Expo’s development tooling.

### 3. How does navigation work?

Expo Router maps files under `src/app` to routes. The root Stack provides screen transitions, and protected routes prevent signed-out users from accessing the patient screens.

### 4. How does the app communicate with the backend?

The client sends HTTP requests to the Express API. JSON responses contain doctors, account/session information, or appointment data. Authenticated requests include a JWT bearer token.

### 5. How are passwords stored?

The backend hashes passwords with `bcryptjs` before saving them. Login compares the submitted password with the stored hash; the original password is not stored.

### 6. What is a JWT used for here?

After successful registration or login, the API signs a token containing the user identifier. The client sends that token on protected requests, and middleware verifies it before allowing access.

### 7. How is appointment data kept private?

Appointment list and cancellation routes require a valid token. Queries use the authenticated user ID, so a patient can only access or cancel their own appointment.

### 8. How do you identify account types?

Each account has a generated numeric ID, unique email, and a role (`patient`, `doctor`, or `admin`) in `app_users`. Public registration always creates a patient. The role is returned by authentication endpoints and shown in the signed-in app; privileged roles must be assigned by a trusted database operator. This version does not yet provide doctor/admin dashboards.

### 9. How do you prevent two patients from booking the same slot?

The database has a partial unique index for confirmed appointments on the doctor, date, and time. The API returns a conflict response if that slot has already been booked.

### 10. Where does the doctor information come from?

Doctor profiles are read from the existing PostgreSQL `doctors` table. Search supports a text query and a specialty filter.

### 11. How does the app handle invalid or unavailable input?

The client validates the date and requires a selected time. The API validates doctor ID, date, time, future availability, and doctor hours, and returns a clear error when a request cannot be accepted.

### 12. How is the session retained after closing the app?

The token is stored in Expo SecureStore on native platforms and browser local storage on web. On launch, the app validates the saved token using `/auth/me` before restoring the account.

### 13. What would you add next?

Possible extensions include doctor/admin accounts, appointment reminders, payment integration, email verification, richer availability management, and automated API/UI tests.

## Current Scope and Limitations

- Roles distinguish patient, doctor, and admin accounts, but this version is still patient-facing; there are no doctor/admin dashboards or role-specific workflows.
- Appointment slots are generated from each doctor’s availability in 30-minute increments. Production scheduling would also need explicit clinic calendars, holidays, and appointment durations.
- Appointment payments and external notification delivery are not included.
- The existing database must provide the `doctors` table; this project currently initializes only the account and appointment tables.

## Quick Troubleshooting

- **API cannot connect:** Confirm PostgreSQL is running, `backend/.env` credentials are correct, and `npm start` reports port `5001`.
- **No doctors appear:** Confirm the database contains the expected `doctors` table and rows.
- **Phone cannot reach API:** Set `EXPO_PUBLIC_API_URL` to the development computer’s LAN address and keep both devices on the same Wi-Fi network.
- **Signed out after pulling the project:** Register or sign in on that device; session storage is local to each browser/device.
- **Port 5001 is in use:** Set another `PORT` in `backend/.env`, update `EXPO_PUBLIC_API_URL` to the same port, and restart both processes.
