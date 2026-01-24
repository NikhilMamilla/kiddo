# Profile & Real-time SOS Implementation Plan

## Goal
Implement a User Profile section for managing personal details and emergency contacts, and integrate Twilio for real-time SMS alerts during emergencies.

## User Review Required
**IMPORTANT**
- Twilio Credentials: The user must provide `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, and `TWILIO_PHONE_NUMBER` in the backend/.env file (or I will create a placeholder).

## Proposed Changes

### 1. Frontend: Profile Management

#### [MODIFY] src/config/firebase.ts
- Initialize and export `getStorage` for profile picture uploads

#### [NEW] src/pages/ProfilePage.tsx
**UI:**
- Avatar Upload (Click to upload)
- Editable Fields: Display Name, Phone Number
- Emergency Contacts Section: Add/Remove Logic (Name + Number)

**Logic:**
- Fetch users/{uid} from Firestore to populate fields
- Save changes back to Firestore
- Upload images to Firebase Storage avatars/{uid}

#### [MODIFY] src/App.tsx
- Add Route: /profile (Protected)

#### [MODIFY] src/pages/Dashboard.tsx
- Link the User Avatar in the sidebar/header to /profile

### 2. Backend: Twilio SOS Integration

#### [NEW] backend/requirements.txt (Update)
- Add twilio package

#### [MODIFY] backend/app.py
- Update `/analyze` and `/sos/trigger` to accept emergency_contacts in the request body

#### [MODIFY] backend/services/sos_service.py
- Import `twilio.rest.Client`
- Read credentials from Environment Variables
- Logic:
  - Iterate through provided emergency_contacts
  - Send SMS: "EMERGENCY ALERT: [User Name] has triggered a mental health SOS. Status: Critical. Please check on them immediately."

### 3. Integration

#### [MODIFY] src/services/analysisService.ts
- Update `analyzeMessage` and `triggerSOS` to include emergencyContacts (fetched from Firestore/Context) in the API payload

## Verification Plan

### Automated
- Verify Build (Frontend)
- Verify Backend startup

### Manual
- Profile: Upload an image, change name, add a contact. Reload page to verify persistence
- SOS: Trigger SOS from Dashboard. Verify backend logs "Sending Twilio SMS to [Number]..."