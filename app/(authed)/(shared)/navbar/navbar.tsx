'use client';
import * as React from 'react';
import { styled, alpha, createTheme, ThemeProvider } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { useRouter } from 'next/navigation';
import NotificationList from '../../profile/notificationList';
import ActionDialog from '../dialog/dialog';
import getManyDocs from '@/app/firebase/firestore/getManyDocs';
import { useAuthContext } from '@/app/context/AuthContext';
import { FeildQueryConstraint } from '@/app/firebase/firestore/constraints';
const theme = createTheme({
  palette: {
    primary: {
      light: '#757ce8',
      main: '#07074c',
      dark: '#002884',
      contrastText: '#fff',
    },
    secondary: {
      light: '#757ce8',
      main: '#757ce8',
      dark: '#757ce8',
      contrastText: '#000',
    },
  },
});

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));
type Props = {
  onMenuButtonClick(): void;
  isOpen: boolean;
};

export default function PrimarySearchAppBar(props: Props) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState<null | HTMLElement>(null);
  const [isNotificationDialogOpen, setIsNotificationDialogOpen] = React.useState<boolean>(false);
  const [unReadCount, setUnReadCount] = React.useState<number>(0);
  const { currentUser } = useAuthContext();

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const router = useRouter();

  const fetchUnReadCount = async () => {
    const constraints: FeildQueryConstraint = {
      feild: 'isRead',
      comparison: '==',
      value: false,
    };

    const { docsCount } = await getManyDocs(
      `users/${currentUser.id}/notifications`,
      [constraints],
      'And',
      { feild: 'id', method: 'desc' },
      1
    );

    setUnReadCount(docsCount);
  };

  fetchUnReadCount();

  const handleProfileClick = () => {
    handleMenuClose();
    router.push('/admin');
  };


  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };
  const handleKeyUp = (event) => {
    if (event.key === 'Enter') {
      router.push('/books?search=' + event.target.value);
      event.target.value = '';
    }
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  
  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    ></Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem
        onClick={() => {
          setIsNotificationDialogOpen(true);
        }}
      >
        <IconButton size="large" aria-label="show notifications" color="inherit">
          <Badge badgeContent={unReadCount} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
     
    </Menu>
  );

  return (
    <Box sx={{ position: 'fixed', flexGrow: 1 }}>
      <ActionDialog
        title={' '}
        content={<NotificationList />}
        isOpen={isNotificationDialogOpen}
        onClose={() => {
          setIsNotificationDialogOpen(false);
        }}
      />
      <ThemeProvider theme={theme}>
        <AppBar position="fixed" color="primary">
          <Toolbar>
            {
              <IconButton
                className="hover:bg-blue-900"
                onClick={props.onMenuButtonClick}
                size="large"
                edge="start"
                color="inherit"
                aria-label="open drawer"
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            }
            <Typography variant="h6" noWrap component="div" sx={{ display: { xs: 'none', sm: 'block' } }}>
              BookWoods
            </Typography>
            <Search theme={theme} className="flex justify-between">
              <div>
                <SearchIconWrapper theme={theme}>
                  <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                  theme={theme}
                  placeholder="Search books..."
                  inputProps={{ 'aria-label': 'search books' }}
                  onKeyUp={handleKeyUp}
                />
              </div>
              <div
                onClick={() => {
                  //////console.log('filter');
                  router.push('/books');
                }}
              >
                <FilterAltIcon className="mr-2 mt-2 cursor-pointer rounded-lg duration-200 hover:scale-90" />
              </div>
            </Search>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <IconButton
                onClick={() => {
                  setIsNotificationDialogOpen(true);
                }}
                size="large"
                aria-label="show 17 new notifications"
                color="inherit"
              >
                <Badge badgeContent={unReadCount} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Box>
            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit"
              >
                <MoreIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
      </ThemeProvider>

      {renderMobileMenu}
      {renderMenu}
    </Box>
  );
}
