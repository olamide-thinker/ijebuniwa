// import { db } from "@/lib/firebase";
// import {
//   average,
//   collection,
//   count,
//   getAggregateFromServer,
// } from "firebase/firestore";

// export const getProductReviewCounts = async ({ productId }) => {
//   const ref = collection(db, `products/${productId}/reviews`);
//   const data = await getAggregateFromServer(ref, {
//     totalReviews: count(),
//     averageRating: average("rating"),
//   });
//   return data.data();
// };

import { db } from '@/lib/firebase'
import { collection, getDocs } from 'firebase/firestore'

// A utility function to calculate average
const calculateAverage = (ratings) => {
	if (ratings.length === 0) return 0
	const sum = ratings.reduce((acc, rating) => acc + rating, 0)
	return sum / ratings.length
}

export const getProductReviewCounts = async ({ productId }) => {
	const reviewsRef = collection(db, `products/${productId}/reviews`)

	// Fetch all reviews once (this will avoid constant server-side aggregate calls)
	const reviewSnapshot = await getDocs(reviewsRef)

	const totalReviews = reviewSnapshot.size // Firestore automatically counts the docs
	const ratings = reviewSnapshot.docs.map((doc) => doc.data().rating || 0) // Collect ratings from each document

	// Calculate the average rating manually
	const averageRating = calculateAverage(ratings)

	return {
		totalReviews,
		averageRating,
	}
}
