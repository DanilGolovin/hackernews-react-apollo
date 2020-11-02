import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom'
import { setContext } from 'apollo-link-context'
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { split } from 'apollo-link'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'

import { AUTH_TOKEN } from './constants'
import './styles/index.css';
import App from './components/App';
import {createMuiTheme} from "@material-ui/core";
import { ThemeProvider } from '@material-ui/styles';


const wsLink = new WebSocketLink({
    uri: `ws://localhost:4000`,
    options: {
        reconnect: true,
        connectionParams: {
            authToken: localStorage.getItem(AUTH_TOKEN),
        }
    }
})



const httpLink = createHttpLink({
    uri: 'http://localhost:4000'
});


const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem(AUTH_TOKEN)
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : ''
        }
    }
})


const link = split(
    ({ query }) => {
        const { kind, operation } = getMainDefinition(query)
        return kind === 'OperationDefinition' && operation === 'subscription'
    },
    wsLink,
    authLink.concat(httpLink)
)

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
})
// Material UI styles provider

const theme = createMuiTheme({
    palette: {
        primary: {
            main: 'rgb(255,102,0)',
        },

        secondary: {
            main: 'rgb(246,246,239)',
        },
    },
    containerWidth: {
        maxWidth: '1500px',
    },
    flexRowCenter: {
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    spacing: 10,
});

ReactDOM.render(
    <BrowserRouter>
        <ApolloProvider client={client}>
            <ThemeProvider theme={theme}>
                <App />
            </ThemeProvider>
        </ApolloProvider>
    </BrowserRouter>,
    document.getElementById('root')
);