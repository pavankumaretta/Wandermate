import { describe, expect, it } from 'vitest';

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

describe('guide filtering helpers', () => {
  it('escapes regex input safely', () => {
    expect(escapeRegExp('New York.*')).toBe('New York\\.\\*');
  });
});
