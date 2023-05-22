import React from 'react';

import { CalendarIcon, HomeIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { LibraryBooks } from '@mui/icons-material';
import CategoryIcon from '@mui/icons-material/Category';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import RunningWithErrorsIcon from '@mui/icons-material/RunningWithErrors';
import SettingsIcon from '@mui/icons-material/Settings';

import { NavItem } from './sidebar';

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
    href: "/books",
    icon: <LibraryBooks className="w-6 h-6" />,
    forLabrarian:true,
    forUsers:true
  },
  {
    label: "My Requests",
    href: "/myrequests",
    icon: <RunningWithErrorsIcon className="w-6 h-6" />,
    forLabrarian:false,
    forUsers:true
  },
  {
    label: "Manage Users and Requests",
    href: "/users",
    icon: <ManageAccountsIcon className="w-6 h-6" />,
    forLabrarian:true,
    forUsers:false
  },
  {
    label: "Manage Categories",
    href: "/categories",
    icon: <CategoryIcon className="w-6 h-6" />,
    forLabrarian:true,
    forUsers:false
  },
  {
    label: "Library System Settings",
    href: "/settings",
    icon: <SettingsIcon className="w-6 h-6" />,
    forLabrarian:true,
    forUsers:false
  },
];
