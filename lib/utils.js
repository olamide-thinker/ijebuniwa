import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
	return twMerge(clsx(inputs))
}

/*
// /src/utils/debounce.ts

Debouncing and throttling are techniques to limit 
the frequency of function executions, especially 
useful when dealing with repeated events.

In this case, using a debounce function can help 
control rapid API requests.
*/

export function debounce(func, wait) {
	let timeout
	return function (...args) {
		clearTimeout(timeout)
		timeout = setTimeout(() => func(...args), wait)
	}
}
