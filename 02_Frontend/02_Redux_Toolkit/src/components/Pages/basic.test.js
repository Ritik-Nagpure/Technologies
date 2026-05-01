// sum.js
export const sum = (a, b) => a + b;

// sum.test.js
import { describe, it, expect } from 'vitest';

describe('sum function', () => {
  it('adds numbers', () => {
    expect(sum(2, 3)).toBe(5);
  });
});
