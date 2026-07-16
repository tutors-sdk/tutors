import { vi } from "vitest";

function createChain(terminal: Record<string, unknown> = { data: null, error: null }) {
  const chain: Record<string, any> = {};
  const methods = ["select", "insert", "upsert", "update", "delete", "eq", "neq", "in", "order", "limit", "range"];

  for (const method of methods) {
    chain[method] = vi.fn().mockReturnValue(chain);
  }

  chain.single = vi.fn().mockResolvedValue(terminal);
  chain.maybeSingle = vi.fn().mockResolvedValue(terminal);
  chain.then = vi.fn((resolve: (v: any) => any) => Promise.resolve(resolve(terminal)));

  return chain;
}

export function createMockSupabaseClient(defaults: Record<string, unknown> = { data: null, error: null }) {
  const chain = createChain(defaults);
  return {
    from: vi.fn().mockReturnValue(chain),
    rpc: vi.fn().mockResolvedValue({ data: null, error: null }),
    _chain: chain
  };
}
