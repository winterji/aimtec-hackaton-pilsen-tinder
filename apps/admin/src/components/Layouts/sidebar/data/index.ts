import * as Icons from "../icons";

export const NAV_DATA = [
  {
    label: "MAIN MENU",
    items: [
      {
        title: "Dashboard",
        icon: Icons.HomeIcon,
        url: "/",
        items: [],
      },
      {
        title: "Profile",
        url: "/profile",
        icon: Icons.User,
        items: [],
      },
      {
        title: "Locations",
        url: "/locations",
        icon: Icons.LocationIcon,
        items: [],
      },
      {
        title: "Categories",
        url: "/categories",
        icon: Icons.CategoryIcon,
        items: [],
      },
    ],
  },
];
