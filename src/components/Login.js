import React, { useState } from 'react'
import { useMutation } from '@apollo/react-hooks';
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { Paper, Grid, TextField, Button } from '@material-ui/core';

import { AUTH_TOKEN } from '../constants'
import { LOGIN_MUTATION, SIGNUP_MUTATION } from "../queries";

const Login = (props) => {
    const [login, setLogin] = useState(true)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')

    const _confirm = async data => {
        const { token } = login ? data.login : data.signup
        _saveUserData(token)
        props.history.push(`/`)
    }

    const _saveUserData = token => {
        localStorage.setItem(AUTH_TOKEN, token)
    }

    const [mutation] = useMutation(login ? LOGIN_MUTATION : SIGNUP_MUTATION, {
        onCompleted(data) {
            return _confirm(data)
        }
    })

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
                    <Grid container  alignItems="flex-end">

                        <Grid item container direction="column" >
                            {!login && (
                                <Box p={2}>
                                    <TextField
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        type="name"
                                        placeholder="Your name"
                                    />
                                </Box>
                            )}
                            <Box p={2}>
                                <TextField
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    type="email"
                                    placeholder="Your email address"
                                />
                            </Box>
                            <Box p={2}>
                                <TextField
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    type="password"
                                    placeholder="Password"
                                />
                            </Box>
                        </Grid>
                    </Grid>

                    <Grid container alignItems="center" direction="column">
                        <Box p={2} onClick={() => mutation({variables:{ email, password, name }})}>
                            {login ?  <Button variant="outlined" color="primary">Login</Button>
                                : <Button variant="outlined" color="primary">Create Account</Button>
                            }
                        </Box>

                        <Box
                            className="pointer button"
                            onClick={() => setLogin(!login)}
                        >
                            {login ?  <Typography variant="outlined" color="primary">need to create an account?</Typography>
                                : <Typography variant="outlined" color="primary">already have an account?</Typography>
                            }
                        </Box>
                    </Grid>
                </Box>
            </Paper>
        </Grid>
    )
}

export default Login
