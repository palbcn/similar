/*

	similar - detect similar strings
	using the Simon White's approximate string 	matching method, 
	that computes the Sørensen–Dice similarity coefficient
	of sets of adjacent letter pairs (also called bigrams)

  based on "How to strike a match" by Simon White
  http://www.devarticles.com/c/a/Development-Cycles/How-to-Strike-a-Match
  (the original document seems missed, found again in 
  http://www.catalysoft.com/articles/StrikeAMatch.html)

  Original Java implementation by Simon White
  first refactored and translated to Pascal by palbcn
  and then readapted to javascript by pal bcn

  PAL Barcelona. <palbcn@yahoo.com> 

*/

(function simNS() {
  
  const replaceDiacritics = require("replace-diacritics");
  
  /** 
     replace all non word consecutive chars 
     in a string with the provided replacement 
     
     @parm str the target string
     @parm replaclement the char or string to replace with
	   @return the result of replacing any non word char with the replacement 
     
     example: replaceNonWordChars("blah, bleh:    blih","_") returns "blah_bleh_blih"
     
  */
  function replaceNonWordChars(str,replaclement) {
    // regex"/" set of"[" non "^" wordchars"\w" "]" one or more consecutive"+" 
    //   in any occurence"g" 
    return str.replace(/[^\w]+/g,replaclement);
  } 

	/** 
  createLetterPairs - private primitive 
  remove all non chars, remove all accented chars 
  and transform all letters to lower case 
  and create an array of adjacent letter pairs (aka bigrams)
  
  @parm str input string	
  @return an array of adjacent lowercase non-accented letter pairs 
  
  for.example
  createLetterPairs("El otoño  vendrá,   con caracolas") returns 
  [ 'el','lo','ot','to','on','no','ov','ve','en','nd','dr','ra','ac','co',
    'on','nc','ca','ar','ra','ac','co','ol','la','as' ]  
  */
  function createLetterPairs(str) {
		if (!str) return [];
		let pairs = [];
		let s = replaceNonWordChars(replaceDiacritics(str),'').toLowerCase();
		for (let i = 0, l = s.length - 1; i < l; i++) {
			pairs.push(s.slice(i, i + 2));
		}
		return pairs;
	}

  /**
	computeSimilarityPairsPrim - private primitive
	 
	Computes the similarity between two lists of letter pairs
	it iterates through the letter pairs to find the size of the intersection.
	Note that whenever a match is found, that letter pair is removed from the
	  second list to prevent from matching against the same character pair
	  multiple times. (Otherwise, 'GGGGG' would score a perfect match against 'GG'.)
	
  @input p,q first and second list of letter pairs
  
  @return the similarity is calculated using the Sørensen–Dice coefficient
    equal twice the size of the intersection over the size of the union 
    (the sum of the individual cardinalities)
	
	this function the primitive called by all of the other `computeSimilarity*` 
  functions later in this module.	
  */
	function computeSimilarityPairsPrim(p, q) {
		let intersection = 0;
    let union = p.length + q.length;
		for (let i = 0, l = p.length; i < l; i++) {  //for each pair in p
			for (let j = 0, m = q.length; j < m; j++) { // compare with each pair in q
				if (p[i] == q[j]) {  // if match, 
					intersection++;    // increment interserction counter
					q.splice(j, 1);    // and remove it from the second pairs array
					break;   // stop searching this pair 
				}
			}
		}
		
		return 2.0 * intersection / union;  // best is 1 worst is 0
	}

	// Computes the similarity between two lists of letter pairs
	//   creates a clone of the second list to not destroy it
	function computeSimilarityBetweenPairs(p, q) {
		function clone(arr) {
			return arr.slice(0);
		}
		return computeSimilarityPairsPrim(p, clone(q));
	}

	// Computes the similarity between two strings,
	//  generates the list of letter pairs for each of the two input strings
	//  and returns their comparison
	function computeSimilarityBetweenStrings(s, t) {
		return computeSimilarityPairsPrim(createLetterPairs(s), createLetterPairs(t));
	}

	// Computes the similarity of a string against a list of letter pairs
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
    
    
  let isArray = x => Array.isArray(x);
	let isString = s => typeof(s) === 'string' || s instanceof String;
  
  // compute similarity
	function computeSimilarity(a, b) {
		if (b) {  // when invoked with second parm, just select the correct primitive    
			if (isArray(a) && isArray(b))
				return computeSimilarityBetweenPairs(a, b);
			else if (isString(a) && isString(b))
				return computeSimilarityBetweenStrings(a, b);
			else if (isString(a) && isArray(b))
				return computeSimilarityBetweenStringAndPairs(a, b);
			else if (isArray(a) && isString(b))
				return computeSimilaritiesBetweenListAndString(a, b);
			else
				throw new Error('cannot compute similarities');

		} else { // when invoked with a single parameter, return the letter pairs
			return createLetterPairs(a);
      
			/* previously we returned a function to allow currying ..
         but current method allows more flexibility and is more efficient in
         certaing cases as it permits storing arrays of pairs 
         
         here is the old currying code ...
          let p=createLetterPairs(a);
          return function (b) {
            return computeSimilarityBetweenStringAndPairs(b, p)
          }; */
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
			if (process.argv[3]) {
				console.log(computeSimilarity(process.argv[2],process.argv[3]));
	    } else {
			  console.log(computeSimilarity('bob dylan like a rolling stone', 'bob dylan like a rolling stone'));
			  console.log(computeSimilarity('bob dylan like a rolling stone', 'Bob Dylan - Like a Rolling Stone.mp3'));
			  console.log(computeSimilarity('Bob Dylan - Like a Rolling Stone.mp3'));
			  console.log(computeSimilarity('bob dylan like a rolling stone', computeSimilarity('Bob Dylan - Like a Rolling Stone.mp3')));
				console.log(computeSimilarity(['Bob Dylan - Like A Rolling Stone - Live 1999.mp3', 'Bob Dylan - Forever Young.mp3', 'The Rolling Stones - RubyTuesday.mp3'], 'bob dylan like a rolling stone'));
			}
		})();
	}

})();
