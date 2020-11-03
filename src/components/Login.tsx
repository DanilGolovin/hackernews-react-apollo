import React, { useState } from 'react'
import { useHistory } from "react-router";

import { useMutation } from '@apollo/react-hooks';

import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { Paper, Grid, Button } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';

import { AUTH_TOKEN } from '../constants'
import { LOGIN_MUTATION, SIGNUP_MUTATION } from "../queries";


const INITIAL_STATE = {
    email: '',
    password: '',
    name: '',
}

type data = {
    login: {
        token: string
    },
    signup:  {
        token: string
    },
}

const Login = () => {
    const history = useHistory();

    const [login, setLogin] = useState(true)
    const [loginState, setLoginState] = useState(INITIAL_STATE)

    const _confirm = async (data: data) => {
        const { token } = login ? data.login : data.signup
        _saveUserData(token)
        history.push(`/`)
    }

    const _saveUserData = (token: string) => {
        localStorage.setItem(AUTH_TOKEN, token)
    }

    const [mutation] = useMutation(login ? LOGIN_MUTATION : SIGNUP_MUTATION, {
        onCompleted(data) {
            return _confirm(data)
        }
    })

    const handleState = (type: keyof typeof INITIAL_STATE, value: string) => {
        setLoginState({...loginState, [type]: value})
    }

    const handleInputChange = (type: keyof typeof INITIAL_STATE) => (e: React.ChangeEvent<HTMLInputElement>) => {
        handleState(type, e.target.value);
    }

    const onLoginClick = () => {
        setLogin(!login)
    }


    return (
        <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
        >
            <Paper>
                <Box p={4}>
                    <Typography variant="h6">{login ? 'Login' : 'Sign Up'}</Typography>
                    <Grid container alignItems="flex-end">

                        <Grid item container direction="column" >
                            {!login && (
                                <Box p={2}>
                                    <TextField
                                        value={loginState.name}
                                        onChange={handleInputChange('name')}
                                        type="name"
                                        placeholder="Your name"
                                    />
                                </Box>
                            )}
                            <Box p={2}>
                                <TextField
                                    value={loginState.email}
                                    onChange={handleInputChange('email')}
                                    type="email"
                                    placeholder="Your email address"
                                />
                            </Box>
                            <Box p={2}>
                                <TextField
                                    value={loginState.password}
                                    onChange={handleInputChange('password')}
                                    type="password"
                                    placeholder="Password"
                                />
                            </Box>
                        </Grid>
                    </Grid>

                    <Grid container alignItems="center" direction="column">
                        <Box p={2} onClick={() => mutation({variables:{ ...loginState }})}>
                            {login ?  <Button variant="outlined" color="primary">Login</Button>
                                : <Button variant="outlined" color="primary">Create Account</Button>
                            }
                        </Box>

                        <Box
                            className="pointer button"
                            onClick={onLoginClick}
                        >
                            {login ?  <Typography  color="primary">need to create an account?</Typography>
                                : <Typography  color="primary">already have an account?</Typography>
                            }
                        </Box>
                    </Grid>
                </Box>
            </Paper>
        </Grid>
    )
}


// @ts-ignore
export default Login;