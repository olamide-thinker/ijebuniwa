import {
	collection,
	doc,
	getDocs,
	getDoc,
	query,
	where,
	limit,
	startAfter,
	orderBy,
} from 'firebase/firestore'
import { db } from './firebase'

// // General fetcher function
// export const fetcher = async (
//   path,
//   pageSize = 1000,
//   lastVisible = null,
//   orderByField = "timestampCreate",
//   orderByDirection = "desc",
//   filters = {}
// ) => {
//   const isCollection = !path.includes("/"); // Check if path is for a collection

//   if (isCollection) {
//     // Reference to the collection
//     let ref = collection(db, path);

//     // Build the base query with orderBy and limit
//     let q = query(ref, orderBy(orderByField, orderByDirection), limit(pageSize));
//     // let q = query(ref,  limit(pageSize));

//     // Apply filters dynamically
//     if (Object.keys(filters).length > 0) {
//       Object.entries(filters).forEach(([key, value]) => {
//         if ( value !== "" && value !== undefined && value !== null ) {
//           console.log("Applying filter:", key, value);

//           // Handle price range filters (minPrice and maxPrice)
//           if (key === "minPrice") {
//             console.log("first?????????? ", Number(value))
//             q = query(q, where("price", ">=", Number(value)));
//           } else if (key === "maxPrice") {
//             q = query(q, where("price", "<=", Number(value)));
//           } else {
//             // Apply other filters like category, etc.
//             q = query(q, where(key, "==", value));
//           }
//         }
//       });
//     }

//     // Apply pagination
//     if (lastVisible) {
//       q = query(q, startAfter(lastVisible));
//     }

//     // Fetch documents
//     const snapshot = await getDocs(q);
//     console.log('ooooooo', snapshot.docs.map((snap) => ({ id: snap.id, ...snap.data() })) || [],
//      snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null)

//     // Return data with last visible doc for pagination
//     return {
//       data: snapshot.docs.map((snap) => ({ id: snap.id, ...snap.data() })) || [],
//       lastVisible: snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null
//     };
//   } else {
//     // Fetch single document
//     const ref = doc(db, path);
//     const snapshot = await getDoc(ref);
//     return snapshot.exists() ? snapshot.data() : null;
//   }
// };

export const fetcher = async (
	path,
	pageSize = 1000,
	lastVisible = null,
	orderByField = 'timestampCreate',
	orderByDirection = 'desc',
	filters = {},
) => {
	if (!path || typeof path !== 'string') {
		throw new Error('Invalid path provided to fetcher. Ensure the path is a non-empty string.')
	}

	const isCollection = !path.includes('/') // Check if path is for a collection

	if (isCollection) {
		// Reference to the collection
		let ref = collection(db, path)

		// Build the base query with orderBy and limit
		let q = query(ref, orderBy(orderByField, orderByDirection), limit(pageSize))

		// Apply filters dynamically
		if (filters && typeof filters === 'object' && Object.keys(filters).length > 0) {
			Object.entries(filters).forEach(([key, value]) => {
				if (value !== '' && value !== undefined && value !== null) {
					console.log('Applying filter:', key, value)

					// Handle price range filters (minPrice and maxPrice)
					if (key === 'minPrice') {
						q = query(q, where('price', '>=', Number(value)))
					} else if (key === 'maxPrice') {
						q = query(q, where('price', '<=', Number(value)))
					} else {
						// Apply other filters like category, etc.
						q = query(q, where(key, '==', value))
					}
				}
			})
		}

		// Apply pagination
		if (lastVisible) {
			q = query(q, startAfter(lastVisible))
		}

		try {
			// Fetch documents
			const snapshot = await getDocs(q)
			return {
				data: snapshot.docs.map((snap) => ({ id: snap.id, ...snap.data() })) || [],
				lastVisible: snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null,
			}
		} catch (error) {
			console.error('Error fetching collection:', error)
			throw new Error('Failed to fetch collection data.')
		}
	} else {
		try {
			// Fetch single document
			const ref = doc(db, path)
			const snapshot = await getDoc(ref)
			return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null
		} catch (error) {
			console.error('Error fetching document:', error)
			throw new Error('Failed to fetch document data.')
		}
	}
}
