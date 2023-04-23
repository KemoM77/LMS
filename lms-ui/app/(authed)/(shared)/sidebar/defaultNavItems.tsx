import React from "react";
import {
  CalendarIcon,
  HomeIcon,
  UserGroupIcon
} from "@heroicons/react/24/outline";
import { NavItem } from "./sidebar";
import { LibraryBooks } from "@mui/icons-material";
import RunningWithErrorsIcon from '@mui/icons-material/RunningWithErrors';
import SettingsIcon from '@mui/icons-material/Settings';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';

export const defaultNavItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <HomeIcon className="w-6 h-6" />,
    forLabrarian: true,
    forUsers:true
  },
  {
    label: "Books",
    href: "#",
    icon: <LibraryBooks className="w-6 h-6" />,
    forLabrarian:true,
    forUsers:true
  },
  {
    label: "My Requests",
    href: "#",
    icon: <RunningWithErrorsIcon className="w-6 h-6" />,
    forLabrarian:false,
    forUsers:true
  },
  {
    label: "Manage Requests",
    href: "#",
    icon: <RunningWithErrorsIcon className="w-6 h-6" />,
    forLabrarian:true,
    forUsers:false
  },
  {
    label: "Manage Users",
    href: "/users",
    icon: <ManageAccountsIcon className="w-6 h-6" />,
    forLabrarian:true,
    forUsers:false
  },
  {
    label: "Library System Settings",
    href: "#",
    icon: <SettingsIcon className="w-6 h-6" />,
    forLabrarian:true,
    forUsers:false
  },
];