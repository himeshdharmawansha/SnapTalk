## Instant Chat (Expo SDK 53)

### Features
- Username + UUID on first launch (no login)
- Create room → show QR; scan → request join → creator auto-accepts
- Real-time chat with Firestore
- Local notifications when receiving a message

### Requirements
- Node 18+
- Expo CLI (`npm i -g expo` optional)

### Setup
1. Install deps:
   - `npm install`
   - `npx expo install expo-notifications expo-barcode-scanner expo-sqlite`
   - `npm install firebase react-native-qrcode-svg uuid react-native-get-random-values @react-native-async-storage/async-storage @react-navigation/native @react-navigation/native-stack`
   - `npx expo install react-native-screens react-native-safe-area-context` (required by navigation)
2. Configure Firebase in `src/services/firebase.js` (see `README.firebase.md`).
3. Start the app: `npm run android` (or `npm run web` for quick checks).

### Flow
1. On first launch, enter a username.
2. Tap Create Room to display QR. Friend taps Scan & Join to scan.
3. Creator auto-accepts and both enter the chat.

### Notes
- For grading, you can enable manual accept by extending `PendingRequestsScreen` and replacing auto-accept in `CreateRoomScreen`.


