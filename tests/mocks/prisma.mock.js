import { vi } from 'vitest';

export function createPrismaMock() {
  return {
    usuario: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      upsert: vi.fn()
    },
    lead: {
      create: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn()
    },
    empresa: {
      create: vi.fn(),
      findFirst: vi.fn(),
      findUnique: vi.fn()
    },
    contato: {
      create: vi.fn()
    },
    historico: {
      create: vi.fn(),
      findMany: vi.fn()
    },
    $transaction: vi.fn()
  };
}
