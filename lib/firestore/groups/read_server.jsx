import { db } from '@/lib/firebase'
import { collection, doc, getDoc, getDocs } from 'firebase/firestore'

export const getGroup = async ({ id }) => {
	const data = await getDoc(doc(db, `categories/${id}`))
	if (data.exists()) {
		return data.data()
	} else {
		return null
	}
}

export const getGroups = async () => {
	const list = await getDocs(collection(db, 'groups'))
	return list.docs.map((snap) => snap.data())
}
