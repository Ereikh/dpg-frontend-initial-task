export function getPostsFromLocalStorage<T>(key: string): T | null {
	if (typeof window !== 'undefined') {
		const data = localStorage.getItem(key);
		return data ? JSON.parse(data) : null;
	}
	return null;
}

export function savePostsToLocalStorage<T>(key: string, data: T): void {
	if (typeof window !== 'undefined') {
		localStorage.setItem(key, JSON.stringify(data));
	}
}
