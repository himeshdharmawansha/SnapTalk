## Firebase Setup (Firestore)

1. Create a Firebase project at `https://console.firebase.google.com`.
2. Add a Web app, copy the config, and paste it into `src/services/firebase.js`.
3. Enable Firestore (native mode).
4. Suggested Security Rules for demo/testing:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /rooms/{roomId} {
      allow read, write: if true; // For demo only. Lock down for production.
      match /messages/{messageId} {
        allow read, write: if true;
      }
    }
  }
}
```

Replace with stricter rules as needed, e.g. restricting updates to inviter/invitee IDs once set.



