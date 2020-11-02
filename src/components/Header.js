import React from 'react'
import { withRouter } from 'react-router'
import { AppBar, Toolbar, Typography, IconButton, Button, MenuItem, Menu } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import MoreIcon from '@material-ui/icons/MoreVert';


import { AUTH_TOKEN } from "../constants";
import TabLink from "./TabLink";

const useStyles = makeStyles((theme) => ({
    width: {
        width: '-webkit-fill-available',
    },
    grow: {
        flexGrow: '1',
    },
    menuWrapper:{
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    menu: {
        maxWidth: theme.containerWidth.maxWidth,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {

    },
    sectionDesktop: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'flex',
        },
    },
    sectionMobile: {
        display: 'flex',
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
}));


const Header = ({history}) => {
    const authToken = localStorage.getItem(AUTH_TOKEN)

    const classes = useStyles();
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMobileMenuOpen = (event) => {
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
        <div className={classes.width}>
            <AppBar position="static" className={classes.menuWrapper}>
                <div className={classes.menu + ' ' + classes.width}>
                    <Toolbar>
                        <Typography className={classes.title} variant="h6" noWrap>
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
        </div>
    )

}

/* <AppBar position="static">
            <Toolbar>
                <Typography variant="h6">
                    Hacker News
                </Typography>
                <TabLink label={"new"} path={"/"} />
                <TabLink label={"top"} path={"/top"} />
                <TabLink label={"search"} path={"/search"} />
                {authToken && (
                    <TabLink label={"submit"} path={"/create"} />
                )}
                {authToken ? (
                    <Button
                        className="ml1 pointer black"
                        onClick={() => {
                            localStorage.removeItem(AUTH_TOKEN)
                            this.props.history.push(`/`)
                        }}
                    >
                        logout
                    </Button>
                ) : (
                    <TabLink label={"login"} path={"/login"} />
                )}
            </Toolbar>
        </AppBar>*/

export default withRouter(Header)