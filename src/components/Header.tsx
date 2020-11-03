import React from 'react'
import { useHistory } from 'react-router'

import { AppBar, Toolbar, Typography, IconButton, Button, MenuItem, Menu, makeStyles, Theme } from '@material-ui/core'
import MoreIcon from '@material-ui/icons/MoreVert';

import { AUTH_TOKEN } from "../constants";
import TabLink from "./TabLink";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles(({ spacing, breakpoints }: Theme) => ({
    width: {
        width: '-webkit-fill-available',
    },
    grow: {
        flexGrow: 1,
    },
    menuWrapper:{
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    menu: {
        maxWidth: '1500px',
    },
    menuButton: {
        marginRight: spacing(2),
    },
    sectionDesktop: {
        display: 'none',
        [breakpoints.up('md')]: {
            display: 'flex',
        },
    },
    sectionMobile: {
        display: 'flex',
        [breakpoints.up('md')]: {
            display: 'none',
        },
    },
}));


const Header = () => {
    const history = useHistory();
    const authToken = localStorage.getItem(AUTH_TOKEN)

    const classes = useStyles()

    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMobileMenuOpen = (event: any) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const mobileMenuId = 'primary-search-account-menu-mobile';
    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >

            <MenuItem>
                <TabLink label={"new"} path={"/"} />
            </MenuItem>
            <MenuItem>
                <TabLink label={"top"} path={"/top"} />
            </MenuItem>
            <MenuItem>
                <TabLink label={"search"} path={"/search"} />
            </MenuItem>
            {authToken && (
                <MenuItem>
                    <TabLink label={"create"} path={"/create"} />
                </MenuItem>
            )}
        </Menu>
    );

    return (
        <Grid className={classes.width}>
            <AppBar position="static" className={classes.menuWrapper}>
                <div className={classes.menu + ' ' + classes.width}>
                    <Toolbar>
                        <Typography variant="h6" noWrap>
                            Hacker News
                        </Typography>
                        <div className={classes.sectionDesktop}>
                            <TabLink label={"new"} path={"/"} />
                            <TabLink label={"top"} path={"/top"} />
                            <TabLink label={"search"} path={"/search"} />
                            {authToken && (
                                <MenuItem>
                                    <TabLink label={"create"} path={"/create"} />
                                </MenuItem>
                            )}
                        </div>
                        <div className={classes.grow} />
                        {authToken ? (
                            <Button
                                className="ml1 pointer black"
                                onClick={() => {
                                    localStorage.removeItem(AUTH_TOKEN)
                                    history.push(`/`)
                                }}
                            >
                                logout
                            </Button>
                        ) : (
                            <TabLink label={"login"} path={"/login"} />
                        )}
                        <div className={classes.sectionMobile}>
                            <IconButton
                                aria-label="show more"
                                aria-controls={mobileMenuId}
                                aria-haspopup="true"
                                onClick={handleMobileMenuOpen}
                                color="inherit"
                            >
                                <MoreIcon />
                            </IconButton>
                        </div>
                    </Toolbar>

                </div>
            </AppBar>
            {renderMobileMenu}
        </Grid>
    )

}

export default Header