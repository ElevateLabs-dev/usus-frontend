import { MenuItem } from "@/types";

export const leftMenuItems: MenuItem[] = [
  {
    id: "home",
    icon: "NiHome",
    label: "menu-home",
    description: "menu-home-description",
    color: "text-primary",
    href: "/home",
  },
  {
    id: "scenarios",
    icon: "NiDocumentFull",
    label: "menu-scenarios",
    color: "text-primary",
    href: "/scenarios",
  },
  {
    id: "external-link",
    icon: "NiArrowUpRightSquare",
    label: "menu-external-link",
    color: "text-primary",
    href: "https://elevatelabs.dev",
    isExternalLink: true,
  },
];

export const leftMenuBottomItems: MenuItem[] = [
  { id: "settings", label: "menu-settings", href: "/settings", icon: "NiSettings" },
];
