import React, { FunctionComponent } from 'react';
import { Mutation } from 'react-apollo'

import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";

import { AUTH_TOKEN } from '../constants'
import { timeDifferenceForDate } from '../utils'
import { VOTE_MUTATION } from "../queries";
import type { Link as LinkType } from "../types/link";
import {useMutation} from "@apollo/client";


type LinkProps = {
    index: number,
    link: LinkType,
    updateStoreAfterVote?: any,
}

const Link: FunctionComponent<LinkProps> = ({ index, link, updateStoreAfterVote}) => {
    const authToken = localStorage.getItem(AUTH_TOKEN)

    const [voteMutation] = useMutation(VOTE_MUTATION, {
            update(store, { data: { vote } }) {
                updateStoreAfterVote(store, vote, link.id)
            },
        }
    )

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
                            {index + 1}.
                        </Box>
                        {authToken && (
                            <IconButton color="primary" size={"small"} onClick={() => voteMutation({variables: { linkId: link.id }})}>
                                ▲
                            </IconButton>
                        )}
                    </Grid>
                    <Grid item container direction="column">
                        <Box component="div" m={1}>
                            <Typography variant="h6">
                                {link.description} ({link.url})
                            </Typography>
                        </Box>

                        <Box component="div" m={1}>
                            <Typography variant="subtitle1">
                                {link.votes.length} votes | by{' '}
                                {link.postedBy
                                    ? link.postedBy.name
                                    : 'Unknown'}{' '}
                                {timeDifferenceForDate(link.createdAt)}
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>

            </Paper>
        </Box>
    )
}

export default Link;