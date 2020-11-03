import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import Header from "./Header";
import LinkList from "./LinkList";
import CreateLink from "./CreateLink";
import Login from "./Login";
import Search from "./Search";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    grow: {
        flexGrow: 1,
    },
    pageContent: {
        backgroundColor: theme.palette.secondary.main,
        height: '-webkit-fill-available',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
    },
    pageWrapper: {
        maxWidth: theme.containerWidth.maxWidth,
        width: '-webkit-fill-available',
        height: '-webkit-fill-available',
    }
}));

const App = () => {
    const classes = useStyles();
    return (
        <div className={classes.pageContent}>
          <Header />
            <div className={classes.pageWrapper}>
                <Switch>
                  <Route exact path='/' render={() => <Redirect to='/new/1' />} />
                  <Route exact path="/create" component={CreateLink} />
                  <Route exact path="/login" component={Login} />
                  <Route exact path='/search' component={Search} />
                  <Route exact path='/top' component={LinkList} />
                  <Route exact path='/new/:page' component={LinkList} />
                </Switch>
            </div>
        </div>
    )
}

export default App;