# similar

Detects similar strings
using the Simon White's approximate string 	matching method, 
that computes the Sørensen–Dice similarity coefficient
of sets of adjacent letter pairs (also called bigrams).

Based on "How to strike a match" by Simon White, originally at http://www.devarticles.com/c/a/Development-Cycles/How-to-Strike-a-Match
Nowadays the original document seems missed, but it can still be found in   http://www.catalysoft.com/articles/StrikeAMatch.html

Original Java implementation by Simon White. First refactored and translated to Pascal by palbcn. And then readapted to javascript also by palbcn.
       
    
## installation

    npm install similar    
    
## usage

    const computeSimilarity  = require('similar');  
    
    // computes similarity between two strings
    let similarity = computeSimilarity('Tàkë á sad song and mäke it bétter','take a bad song made better');    
    
    // or save the letter pairs of the string 
    let bigrams = computeSimilarity('Tàkë á sad song and mäke it bétter');
    
    // that can later be compared with different strings   
    similarity = computeSimilarity('take a sad song and make it better',bigrams);
    similarity = computeSimilarity('take a bad song made better',bigrams);
    
    // multiple string comparison can be simplified 
    let candidates = ['take a sad song and make it better','take a bad song made better'];
    let similarities = computeSimilarity(candidates,'Tàkë á sad song and mäke it bétter');
    
    // that might be used to find the closest match
    let maxVal = Math.max(...similarities);
    let closestMatch = candidates[similarities.indexOf(maxVal)];
    
