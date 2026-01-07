// "use client";

// import { auth } from "@/lib/firebase";
// import { onAuthStateChanged } from "firebase/auth";
// import { createContext, useContext, useEffect, useState } from "react";

// const AuthContext = createContext();

// export default function AuthContextProvider({ children }) {
//   const [user, setUser] = useState(undefined);

//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, (user) => {
//       if (user) {
//         console.log('::::::::', user.uid)
//         setUser(user);
//       } else {
//         setUser(null);
//       }
//     });
//     return () => unsub();
//   }, []);

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         isLoading: user === undefined,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export const useAuth = () => useContext(AuthContext);

// "use client";

// import { auth } from "@/lib/firebase";
// import { User, onAuthStateChanged } from "firebase/auth";
// import {
//   createContext,
//   useContext,
//   useEffect,
//   useState,
//   ReactNode,
// } from "react";

// // Create context with default undefined value
// const AuthContext = createContext(undefined);

// // AuthContextProvider component
// export default function AuthContextProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
//       if (firebaseUser) {
//         console.log("User logged in:", firebaseUser.uid);
//         setUser(firebaseUser);
//       } else {
//         setUser(null);
//       }
//       setIsLoading(false); // Set loading to false once user state is determined
//     });

//     // Cleanup subscription
//     return () => unsubscribe();
//   }, []);

//   return (
//     <AuthContext.Provider value={{ user, isLoading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// // Hook for accessing authentication state
// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthContextProvider");
//   }
//   return context;
// };

'use client'

import { auth } from '@/lib/firebase'
import { User, onAuthStateChanged } from 'firebase/auth'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

// Create context with default undefined value
const AuthContext = createContext(undefined)

// AuthContextProvider component
export default function AuthContextProvider({ children }) {
	const [user, setUser] = useState(null)
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		// Subscribe to authentication state changes
		const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
			if (firebaseUser) {
				console.log('User logged in:', firebaseUser.uid)
				setUser(firebaseUser)
			} else {
				console.log('No user logged in')
				setUser(null)
			}
			setIsLoading(false) // Set loading to false once user state is determined
		})

		// Cleanup subscription to prevent memory leaks
		return () => unsubscribe()
	}, [])

	return <AuthContext.Provider value={{ user, isLoading }}>{children}</AuthContext.Provider>
}

// Hook for accessing authentication state
export const useAuth = () => {
	const context = useContext(AuthContext)
	if (!context) {
		throw new Error('useAuth must be used within an AuthContextProvider')
	}
	return context
}
