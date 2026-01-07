// "use client";

// import { db } from "@/lib/firebase";
// import { collection, doc, onSnapshot } from "firebase/firestore";
// import useSWRSubscription from "swr/subscription";

// export function useAdmins() {
//   const { data, error } = useSWRSubscription(["admins"], ([path], { next }) => {
//     const ref = collection(db, path);
//     const unsub = onSnapshot(
//       ref,
//       (snapshot) =>
//         next(
//           null,
//           snapshot.docs.length === 0
//             ? null
//             : snapshot.docs.map((snap) => snap.data())
//         ),
//       (err) => next(err, null)
//     );
//     return () => unsub();
//   });

//   return { data, error: error?.message, isLoading: data === undefined };
// }

// export function useAdmin({ email }) {
//   const { data, error } = useSWRSubscription(
//     ["admins", email],
//     ([path, email], { next }) => {
//       const ref = doc(db, `admins/${email}`);
//       const unsub = onSnapshot(
//         ref,
//         (snapshot) => next(null, snapshot.exists() ? snapshot.data() : null),
//         (err) => next(err, null)
//       );
//       return () => unsub();
//     }
//   );

//   return { data, error: error?.message, isLoading: data === undefined };
// }

// import useSWR from "swr";
// import { fetcher } from "@/lib/globalFetcherFunc"; // Assuming fetcher is exported from a lib folder

'use client'

import { fetcher } from '@/lib/globalFetcherFunc'
import useSWR from 'swr'

// fetching all admins
export function useAdmins() {
	const { data, error } = useSWR(
		['admins'],
		([path]) => fetcher(path), // Using the fetcher function
	)

	return { data, error: error?.message, isLoading: !data && !error }
}

//fetch on admin
export function useAdmin({ email }) {
	const { data, error } = useSWR(email ? `admins/${email}` : null, fetcher)

	return {
		data,
		error: error ? error.message : null,
		isLoading: !error && !data,
	}
}
