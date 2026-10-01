# IUSMed Connect

IUSMed Connect is an Expo app for finding doctors, booking visits, and managing appointments. The Express API uses PostgreSQL for doctors, accounts, and bookings.

## Start the API

1. Configure `backend/.env` with the PostgreSQL settings shown in `backend/.env.example`.
2. From the repository root, install and start the API:

   ```bash
   cd backend
   npm install
   npm start
   ```

The API creates the `app_users` and `appointments` tables on startup. The existing `doctors` table must already be present.

## Start the app

```bash
cd MedCareMobile
npm install
npm start
```

Run `npm run web` to start the browser version. Android emulators connect to the API using `10.0.2.2`; iOS simulators and web use `localhost` by default. The API defaults to port `5001` so it can run alongside an older MedCare server on `5000`. For a physical phone, copy `.env.example` to `.env` and set `EXPO_PUBLIC_API_URL` to the computer's LAN address, for example `http://192.168.1.10:5001`. Keep the phone and computer on the same network, then restart Expo.

## Account and booking flow

Register with a name, email, and password of at least eight characters. Doctor availability and fees come from the PostgreSQL `doctors` table. Appointments are stored for the signed-in account, unique confirmed doctor/time slots are enforced by the API, and confirmed appointments can be cancelled from My appointments.

Use a unique, long `JWT_SECRET` in `backend/.env` before deploying outside local development.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
