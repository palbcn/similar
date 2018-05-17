/* Pere Albert, Barcelona. palbcn@yahoo.com */

/* REFERENCE:
"How to strike a match"; by Simon White
http://www.devarticles.com/c/a/Development-Cycles/How-to-Strike-a-Match

Original JAVA implementation by Simon White
refactored and translated to pascal
and then heavily adapted to javascript by Pere Albert

 */

(function simNS() {

	const pastrings = require('pastrings');

	/* return an array of adjacent letter pairs contained in the input string remove all non chars and transform all accented*/
	function createLetterPairs(str) {
		if (!str)
			return [];
		var pairs = [];
		var s = pastrings.removeNonWordChars(pastrings.replaceAccents(str)).toLowerCase();
		for (var i = 0, l = s.length - 1; i < l; i++) {
			pairs.push(s.slice(i, i + 2));
		}
		return pairs;
	}

	// Computes the distance between two character pairs
	//   iterates through the letter pairs to find the size of the intersection.
	//   Note that whenever a match is found, that character pair is removed from the
	//   second array list to prevent us from matching against the same character pair
	//  multiple times. (Otherwise, ‘GGGGG’ would score a perfect match against ‘GG’.)
	//
	function computeSimilarityPairsPrim(p, q) {
		var intersection = 0;
		var union = p.length + q.length;
		for (var i = 0, l = p.length; i < l; i++) {
			for (var j = 0, m = q.length; j < m; j++) {
				if (p[i] == q[j]) {
					intersection++;
					q.splice(j, 1); // remove from the second pairs array
					break;
				}
			}
		}
		return 2.0 * intersection / union;
	}

	// Computes the similarity between two character pairs
	//   creates a clone of the second pair to not destroy it
	function computeSimilarityBetweenPairs(p, q) {
		return computeSimilarityPairsPrim(p, q.slice(0));
	}

	// Computes the similarity between two strings,
	//  generates the character pairs from the words of each of the two input strings
	//  and returns their comparison
	function computeSimilarityBetweenStrings(s, t) {
		return computeSimilarityPairsPrim(createLetterPairs(s), createLetterPairs(t));
	}

	// Computes the similarity of a string against an already calculated letter pairs array.
	function computeSimilarityBetweenStringAndPairs(s, p) {
		return computeSimilarityBetweenPairs(createLetterPairs(s), p);
	}

	// compute similarity between each of the elements of a list of strings
	// against a single string and returns an array of distances.
	function computeSimilaritiesBetweenListAndString(l, s) {
		var r = [];
		var p = createLetterPairs(s); // need to create first pair just once
		for (var i = 0, n = l.length; i < n; i++) {
			r.push(computeSimilarityPairsPrim(p, createLetterPairs(l[i]))); // the letterpairs of the list are disposable
		}
		return r;
	}
    
  // compute similarity
	function computeSimilarity(a, b) {
		if (b) {  // when invoked with second parm, just select the correct primitive    
			if (pastrings.isArray(a) && pastrings.isArray(b))
				return computeSimilarityBetweenPairs(a, b);
			else if (pastrings.isString(a) && pastrings.isString(b))
				return computeSimilarityBetweenStrings(a, b);
			else if (pastrings.isString(a) && pastrings.isArray(b))
				return computeSimilarityBetweenStringAndPairs(a, b);
			else if (pastrings.isArray(a) && pastrings.isString(b))
				return computeSimilaritiesBetweenListAndString(a, b);
			else
				throw new Error('cannot compute similarities');

		} else { // when invoked with a single parameter, allow currying
			let p = createLetterPairs(a);
			return function (b) {
				return computeSimilarityBetweenStringAndPairs(b, p)
			};

		}
	}

	/* main */
	if (module.parent) {
		module.exports = computeSimilarity;
		/* ... deprecated
		exports.createLetterPairs = createLetterPairs;
		exports.betweenPairs = computeSimilarityBetweenPairs;
		exports.betweenStrings = computeSimilarityBetweenStrings;
		exports.betweenStringAndPairs = computeSimilarityBetweenStringAndPairs;
		exports.betweenListAndString = computeSimilaritiesBetweenListAndString;
     */

	} else {
		(function main() {
			console.log(computeSimilarity('asdfasd fasdf asfd', 'asdfasdfasffasfd'));
			console.log(computeSimilarity('asdfasd fasdf asfd', createLetterPairs('asdfasdfasffasfd')));
			console.log(computeSimilarity(['asdfasd fasdf asfd', 'asdf afsas dfasdf', 'asdfafdsa faf fasd'], 'asdfasdfasffasfd'));
			console.log(computeSimilarity('asdfasd fasdf asfd')('asdfasdfasffasfd'));
		})();
	}

})();
