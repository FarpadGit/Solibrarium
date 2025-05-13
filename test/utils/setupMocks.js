import { vi } from "vitest";

window.ResizeObserver = vi.fn(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

vi.mock("next/navigation");

vi.mock("next/dynamic", async () => {
  const actual = await vi.importActual("next/dynamic");
  return {
    ...actual,
    default: vi.fn(),
  }
});

vi.mock("axios", () => ({
  default: {
    create: vi.fn().mockReturnThis(),
    request: vi.fn(),
  },
}));

vi.mock("@upstash/redis", () => ({
  Redis: class {
    get = vi.fn();
    set = vi.fn();
  },
}));

vi.mock("next-auth/react", async () => {
  const actual = await vi.importActual("next-auth/react");
  return {
    ...actual,
    useSession: vi.fn(() => ({ data: null, update: vi.fn(), status: "unauthenticated" })),
  }
});

vi.mock("@/contexts/AppContext", async () => {
  const actual = await vi.importActual("@/contexts/AppContext");
  return {
    ...actual,
    useAppContext: vi.fn(() => ({})),
  }
});

vi.mock("@/hooks/useMediaQuery", async () => {
  const actual = await vi.importActual("@/hooks/useMediaQuery");
  return {
    ...actual,
    default: () => actual.ScreenENUM.LG,
  }
});

vi.mock("@/hooks/useLocalStorage", () => ({
  useLocalStorage: vi.fn(() => [[], vi.fn()]),
}));

vi.mock("@/hooks/useDarkMode", () => ({
  default: vi.fn(() => [false, vi.fn()]),
}));