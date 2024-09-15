// функции для работы с localStorage

export const loadStorage = (key) => {
	try {
		const serialized = localStorage.getItem(key);
		return serialized ? JSON.parse(serialized) : [];
	} catch (e) {
		return undefined;
	}
}

export const saveStorage = async (key, data) => {
	try {
		const serialized = JSON.stringify(data);
		localStorage.setItem(key, serialized);
		return true;
	} catch (e) {
		return false;
	}
}