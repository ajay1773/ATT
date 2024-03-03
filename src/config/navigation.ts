import { ENavIconNames } from "~/constants/enums";
import { TNavConfig } from "~/constants/types";

export const navigation: TNavConfig[] = [
  {
    iconName: ENavIconNames.Dashboard,
    label: "Dashboard",
    link: "/dashboard",
  },
  {
    iconName: ENavIconNames.Leaves,
    label: "Leaves",
    link: "/leaves",
  },
  {
    iconName: ENavIconNames.Employees,
    label: "Employees",
    link: "/employees",
  },
  {
    iconName: ENavIconNames.Settings,
    label: "Configurations",
    link: "/configurations",
  },
];
