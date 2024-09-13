function sortByFrequency(array) {
	var frequency = {};

	array.forEach(function (value) { frequency[value] = 0; });

	var uniques = array.filter(function (value) {
		return ++frequency[value] == 1;
	});

	return uniques.sort(function (a, b) {
		return frequency[b] - frequency[a];
	});
}

export const parseTags = (items) => {
	return sortByFrequency(items.filter(o => o.tags).map(o => [...o.tags]).flat(1));
};

export const parseTokens = (items) => {
	return sortByFrequency(items.filter(o => o.tokens).map(o => o.tokens.map(t => t.token)).flat(1));
};

export const parseChains = (items) => {
	return sortByFrequency(items.filter(o => o.chain).map(o => [...o.chain]).flat(1));
};
