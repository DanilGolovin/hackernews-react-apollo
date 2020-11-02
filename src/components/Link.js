import React from 'react';
import { Mutation } from 'react-apollo'
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";

import { AUTH_TOKEN } from '../constants'
import { timeDifferenceForDate } from '../utils'
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import {VOTE_MUTATION} from "../queries";

const useStyles = makeStyles((theme) => ({
    linkWrapper:{
        padding: theme.spacing(1, 2, 1, 1),
        margin: '10px 0px',

    },
}));

const Link = (props) => {
    const theme = useTheme();
    const authToken = localStorage.getItem(AUTH_TOKEN)
    return (
        <Box m={1}>
            <Paper variant="outlined" >

                <Grid
                    container
                    direction="row"
                    justify="flex-start"
                    alignItems="center"
                    wrap="nowrap"
                >
                    <Grid >
                        <Box component="span" m={1}>
                            {props.index + 1}.
                        </Box>
                        {authToken && (
                            <Mutation
                                mutation={VOTE_MUTATION}
                                variables={{ linkId: props.link.id }}
                                update={(store, { data: { vote } }) =>
                                    props.updateStoreAfterVote(store, vote, props.link.id)
                                }
                            >
                                {voteMutation => (
                                    <IconButton color="primary" size={"small"}>
                                        ▲
                                    </IconButton>
                                )}
                            </Mutation>
                        )}
                    </Grid>
                    <Grid item container direction="column">
                        <Box component="div" m={1}>
                            <Typography variant="h6">
                                {props.link.description} ({props.link.url})
                            </Typography>
                        </Box>

                        <Box component="div" m={1}>
                            <Typography variant="subtitle1">
                                {props.link.votes.length} votes | by{' '}
                                {props.link.postedBy
                                    ? props.link.postedBy.name
                                    : 'Unknown'}{' '}
                                {timeDifferenceForDate(props.link.createdAt)}
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>

            </Paper>
        </Box>
    )
}

export default Link;