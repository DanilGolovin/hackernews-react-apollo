import React, { useState } from 'react'
import { withApollo } from 'react-apollo'

import TextField from "@material-ui/core/TextField";
import Card from "@material-ui/core/Card";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Button from "@material-ui/core/Button";

import Link from './Link'
import { FEED_SEARCH_QUERY } from "../queries";

const useStyles = makeStyles((theme) => ({
    root: {
        margin: theme.spacing(5, 0),
        display: 'flex',
        justifyContent: 'center',
    },
    between: {
        display: 'flex',
        justifyContent: 'space-between',
        width: 400,
    }
}));

const Search = (props) => {
    const classes = useStyles();
    const [links, setLinks] = useState([])
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
        >
            <Card variant="outlined" className={classes.root} >
                <Box p={4} className={classes.between}>
                    <TextField
                        type='text'
                        onChange={e => setFilter(e.target.value)}
                        label="Search"
                        variant="outlined"

                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => _executeSearch()}
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

export default withApollo(Search)