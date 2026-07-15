import { MenuItem } from "@/types";

export const leftMenuItems: MenuItem[] = [
  {
    id: "home",
    icon: "NiHome",
    label: "menu-home",
    description: "menu-home-description",
    color: "text-primary",
    href: "/home",
    children: [
      {
        id: "home-sub",
        icon: "NiChartPie",
        label: "menu-home-sub",
        href: "/home/sub",
        description: "menu-home-sub-description",
      },
    ],
  },
  {
    id: "scenerio",
    icon: "NiDocumentFull",
    label: "menu-scenerio",
    color: "text-primary",
    href: "/learning",
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
