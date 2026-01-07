export const admin = require('firebase-admin')

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEYS)
// if (!admin.apps.length) {
//   const serviceAccount = JSON.parse(
//     process.env.FIREBASE_SERVICE_ACCOUNT_KEYS.replace(/\\n/g, "\n") // Replace escaped newlines
//   );

if (admin.apps.length === 0) {
	admin.initializeApp({
		credential: admin.credential.cert(serviceAccount),
	})

	// // admin.initializeApp({
	// //   credential: admin.credential.cert(serviceAccount),
	// // });
}

export const adminDB = admin.firestore()
