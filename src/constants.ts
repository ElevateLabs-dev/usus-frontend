export const LOCALES = ["ar", "de", "en", "fr", "es"] as const;
export type LocaleOption = (typeof LOCALES)[number];

export const THEME_OPTIONS = {
  GREEN: "theme-green",
  PURPLE: "theme-purple",
  BLUE: "theme-blue",
  ORANGE: "theme-orange",
} as const;

export type ThemeVariant = (typeof THEME_OPTIONS)[keyof typeof THEME_OPTIONS];

export type ModeVariant = (typeof THEME_MODE_OPTIONS)[number];
export const THEME_MODE_OPTIONS = ["light", "dark", "system"] as const;

const storagePrefix = process.env.NEXT_PUBLIC_STORAGE_PREFIX || "";
export const COOKIE_KEYS = { locale: `${storagePrefix}-locale` };

export const LOCAL_STORAGE_KEYS = {
  themeColor: `${storagePrefix}-theme-color`,
  themeMode: `${storagePrefix}-theme-mode`,
  leftMenuType: `${storagePrefix}-left-menu-type`,
  contentType: `${storagePrefix}-content-type`,
};

export const LINKS = {
  figma:
    "https://www.figma.com/design/ZMvZsFJc498q1Y11FroNaW/gogo-design-7.3.0?node-id=1381-11546&t=ZgHIoeE8mt3tfiNR-1",
  purchase: "https://1.envato.market/nEyZa",
  purchase_extended: "https://1.envato.market/9L4krE",
  docs: "/docs/welcome/introduction",
  view: "/auth/sign-in",
  signup: "/auth/sign-in",
  login: "/auth/sign-up",
  components: "/ui",
} as const;
