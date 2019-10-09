const computeSimilarity = require('./index');

describe("computes similarity between two strings", ()=>{
  test('same strings have max similarity', () => {
    expect(computeSimilarity('bob dylan like a rolling stone', 'bob dylan like a rolling stone'))
     .toBe(1);
  });

  test('similar strings have high similarity', () => {
    expect(computeSimilarity('bob dylan like a rolling stone', 'Bob Dylan - Like a Rolling Stone.mp3'))
     .toBeCloseTo(0.9,1);
  });
  
  test('very different strings have low similarity', () => {
    expect(computeSimilarity('bob dylan like a rolling stone', 'Immanuel Kant - Kritik der reinen Vernunft'))
     .toBeCloseTo(0.1,1);
  });
});

describe("applied to only one string prepares its character pairs",() => {
  let res = computeSimilarity('bob dylan like a rolling stone');
    
  test('returns an array', () => {
    expect(Array.isArray(res)).toBe(true);
  });
  
  test('returns character pairs', () => {
    expect(res).toContain('bo');
    expect(res).toContain('ne');
  });
});

describe("character pairs can be compared with different strings",() => {
  let res = computeSimilarity('bob dylan like a rolling stone');

  test('same strings have max similarity', () => {
    expect(computeSimilarity('bob dylan like a rolling stone',res))
     .toBe(1);
  });

  test('similar strings have high similarity', () => {
    expect(computeSimilarity('Bob Dylan - Like a Rolling Stone.mp3',res))
     .toBeCloseTo(0.9,1);
  });
  
  test('very different strings have low similarity', () => {
    expect(computeSimilarity('Immanuel Kant - Kritik der reinen Vernunft',res))
     .toBeCloseTo(0.1,1);
  }); 
});

describe("a list of strings can be compared with a single string",() => {
  let res = computeSimilarity(['bob dylan like a rolling stone', 'Bob Dylan - Like a Rolling Stone.mp3', 'Immanuel Kant - Kritik der reinen Vernunft'],'bob dylan like a rolling stone');

  
  test('returns an array', () => {
    expect(Array.isArray(res)).toBe(true);
  });
  
  test('returns corresponding similarities', () => {
    expect(res[0]).toBe(1);
    expect(res[1]).toBeCloseTo(0.9,1);
    expect(res[2]).toBeCloseTo(0.1,1);
  });
  
});

