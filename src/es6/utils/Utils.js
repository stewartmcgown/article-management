/**
 * Safely access nested object properties
 *
 * @param {Array.<Object>} p path to desired object
 * @param {Object} o context object in which to search
 *
 * @returns the desired object or null if no such object is found.
 *
 * @author A. Sharif
 * @see https://medium.com/javascript-inside/safely-accessing-deeply-nested-values-in-javascript-99bf72a0855a
 */
const get = (p, o) => p.reduce((xs, x) => (xs && xs[x] ? xs[x] : null), o)

/**
 *
 * @param {Object} target object to update
 * @param {Object} source source of properties
 */
const assignExisting = (target, source) => {
	Object.keys(source)
		.filter(key => key in target)
		.forEach(key => {
			target[key] instanceof Object
				? assignExisting(target[key], source[key])
				: (target[key] = source[key])
		})
}

/**
 *
 * @param {String} dateString
 */
const parseDateString = dateString => {
	let d = dateString.split("-")
	if (d.length != 3) return dateString
	else return new Date(d[2], d[1], d[0])
}

/**
 * Convert an object to an array of key value pairs
 *
 * {
 *  title: "Hello",
 *  length: 100
 * }
 *
 * would map to:
 *
 * [
 *  {key: "title", value: "Hello"},
 *  {key: "length", value: 100}
 * ]
 *
 * @param {Object} o
 * @return {Array.<Object>}
 */
const objectToKeyValues = (o, h) =>
	Object.keys(o).map(k => {
		return {
			key: k,
			value: o[k]
		}
	})

/**
 * Recursively flatten an object and concatenate the names
 *
 * @param {Object} o
 * @param {String} [stem]
 */
const stemFlatten = (o, stem) => {
	let out = {}
	Object.keys(o).forEach(k => {
		if (o[k] instanceof Object) {
			Object.assign(out, stemFlatten(o[k], k))
		} else {
			out[`${stem ? `${stem}_` : ""}${k}`] = o[k]
		}
	})
	return out
}

/**
 * Clean up an object by removing null and undefined values
 * @param {Object} obj
 */
const removeEmpty = obj => {
	if (!obj) return {}
	let o
	try {
		o = JSON.parse(JSON.stringify(obj)) // Clone source oect.
	} catch (e) {
		return {}
	}

	Object.keys(o).forEach(key => {
		if (o[key] && typeof o[key] === "object") o[key] = removeEmpty(o[key])
		// Recurse.
		else if (o[key] === undefined || o[key] === null) delete o[key]
		// Delete undefined and null.
		else o[key] = o[key] // Copy value.
	})

	return o // Return new object.
}

const columnToLetter = column => {
	var temp,
		letter = ""
	while (column > 0) {
		temp = (column - 1) % 26
		letter = String.fromCharCode(temp + 65) + letter
		column = (column - temp - 1) / 26
	}
	return letter
}

/**
 * Are all the values on p present on o
 * @param {Object} o object to search
 * @param {Object} p object of search values
 * @param {Boolean} [c] are loose equality matches ok?
 * @return {Boolean} whether there are partial matches
 */
const partialMatch = (o, p, c) =>
		Object.keys(p).every(k =>
			p[k] && o[k]
				? p[k] instanceof Object
					? partialMatch(o[k], p[k], c)
					: c
					? o[k].toLowerCase().includes(p[k].toLowerCase())
					: p[k] === o[k]
				: false
)
	

/**
 *
 * @param {Array.<Object>} o An array of objects
 * @param {Object} p the properties to match
 * @param {Boolean} c if a partial match is enough
 * @return {Array.<Object>} matching objects
 */
const partialSearch = (o, p, c) => {
	o instanceof Array ? o : (o = Object.values(o))
	return o.filter(a => partialMatch(a, p, c))
}

const flatSearch = (o, p, c) =>
	o.filter(x =>
		c
			? JSON.stringify(Object.values(x))
					.toLowerCase()
					.includes(p.toLowerCase())
			: JSON.stringify(Object.values(x)) == p
	)

module.exports = {
	get,
	assignExisting,
	stemFlatten,
	objectToKeyValues,
	parseDateString,
	removeEmpty,
	columnToLetter,
	partialMatch,
	partialSearch,
	flatSearch
}
