import React, { useState } from 'react'
import { withApollo, WithApolloClient } from 'react-apollo'

import TextField from "@material-ui/core/TextField";
import Card from "@material-ui/core/Card";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Button from "@material-ui/core/Button";

import Link from './Link'
import { FEED_SEARCH_QUERY } from "../queries";
import type { Link as LinkType } from "../types/link";

const useStyles = makeStyles((theme) => ({
    root: {
        margin: theme.spacing(5, 0),
        display: 'flex',
        justifyContent: 'center',
    },
    between: {
        display: 'flex',
        justifyContent: 'space-between',
        maxWidth: theme.spacing(40),
        width: theme.spacing(35),
    },
    cardWrapper: {
        padding: theme.spacing(2, 0),
    }
}));

const Search: React.FC<WithApolloClient<{}>> = (props) => {

    const classes = useStyles();
    const [links, setLinks] = useState<LinkType[]>([])
    const [filter, setFilter] = useState('')

    const _executeSearch = async () => {
        const result = await props.client.query({
            query: FEED_SEARCH_QUERY,
            variables: { filter },
        })
        setLinks(result.data.feed.links)
    }
    return (
        <Grid
            container
            direction="column"
            className={classes.cardWrapper}
        >
            <Card variant="outlined" className={classes.root} >
                <Box p={2} className={classes.between}>
                    <TextField
                        type='text'
                        onChange={e => setFilter(e.target.value)}
                        label="Search"
                        variant="outlined"

                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={_executeSearch}
                    >
                        OK
                    </Button>
                </Box>
            </Card>
            {
                links.map((link, index) => (
                        <Link key={link.id} link={link} index={index} />
                    )
                )
            }
        </Grid>
    )
}

export default withApollo(Search);