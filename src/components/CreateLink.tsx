import React, { useState } from 'react';
import { LINKS_PER_PAGE } from '../constants'
import { TextField } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import { POST_MUTATION, FEED_QUERY } from "../queries";
import { useMutation } from 'react-apollo';
import { useHistory } from "react-router";

import { Link } from "../types/link";


type queryData = {
    feed: {
        count?: number | null,
        links: Link[],
    }
}

const INITIAL_STATE = {
    description: '',
    url: '',
}

const CreateLink = () => {
    let history = useHistory();

    const [linkState, setLinkState] = useState(INITIAL_STATE);

    const handleState = (type: keyof typeof INITIAL_STATE, value: string) => {
        setLinkState({...linkState, [type]: value})
    }

    const [addLink] = useMutation(POST_MUTATION, {
        update(store, { data: { post }}) {
            const first = LINKS_PER_PAGE
            const skip = 0
            const orderBy = 'createdAt_DESC'
            const data:queryData | null = store.readQuery({
                query: FEED_QUERY,
                variables: { first, skip, orderBy }
            })
            if (data) data.feed.links.unshift(post)
            store.writeQuery({
                query: FEED_QUERY,
                data,
                variables: { first, skip, orderBy }
            })
        },
        onCompleted() {
            history.push('/new/1')
        }
    });

    const onClick = () => addLink({variables: linkState});

    const handleInputChange = (type: keyof typeof INITIAL_STATE) => (e: React.ChangeEvent<HTMLInputElement>) => {
        handleState(type, e.target.value);
    }

    return (
        <Grid container justify="center" alignItems="center">
            <Box m={10}>
                <Box p={2}>
                    <TextField
                        value={linkState.description}
                        onChange={handleInputChange('description')}
                        type="text"
                        placeholder="Your name"
                    />
                </Box>
                <Box p={2}>
                    <TextField
                        value={linkState.url}
                        onChange={handleInputChange('url')}
                        type="text"
                        placeholder="The URL for the link"
                    />
                </Box>

                <Button type="button" color="primary" onClick={onClick}>
                    Submit
                </Button>
            </Box>
        </Grid>
    )

}

export default CreateLink;