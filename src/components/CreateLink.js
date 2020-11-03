import React, { useState } from 'react'
import { LINKS_PER_PAGE } from '../constants'
import {TextField} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import {POST_MUTATION, FEED_QUERY} from "../queries";
import { useMutation } from '@apollo/react-hooks';


const CreateLink = (props) => {
    const [description, setDescription] = useState('')
    const [url, setUrl] = useState('')
    const [addLink] = useMutation(POST_MUTATION, {
        update(store, { data: { post } }) {
            const first = LINKS_PER_PAGE
            const skip = 0
            const orderBy = 'createdAt_DESC'
            const data = store.readQuery({
                query: FEED_QUERY,
                variables: { first, skip, orderBy }
            })
            data.feed.links.unshift(post)
            store.writeQuery({
                query: FEED_QUERY,
                data,
                variables: { first, skip, orderBy }
            })
        },
        onCompleted() {
            props.history.push('/new/1')
        }
    })

    return (
        <Grid container justify="center" alignItems="center">
            <Box m={10}>
                <Box p={2}>
                    <TextField
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        type="text"
                        placeholder="Your name"
                    />
                </Box>
                <Box p={2}>
                    <TextField
                        value={url}
                        onChange={e => setUrl(e.target.value)}
                        type="text"
                        placeholder="The URL for the link"
                    />
                </Box>

                <Button
                    color="primary"
                    onClick={ () => addLink({variables: { description, url }})
                    }
                >
                    Submit
                </Button>
            </Box>
        </Grid>
    )

}

export default CreateLink

// import React, {Component, useState} from 'react'
// import { Mutation } from 'react-apollo'
// import { LINKS_PER_PAGE } from '../constants'
// import {TextField} from "@material-ui/core";
// import Box from "@material-ui/core/Box";
// import Button from "@material-ui/core/Button";
// import Grid from "@material-ui/core/Grid";
// import {POST_MUTATION, FEED_QUERY} from "../queries";
//
//
// const CreateLink = (props) => {
//     const [description, setDescription] = useState('')
//     const [url, setUrl] = useState('')
//
//     return (
//         <Grid container justify="center" alignItems="center">
//             <Box m={10}>
//                 <Box p={2}>
//                     <TextField
//                         value={description}
//                         onChange={e => setDescription(e.target.value)}
//                         type="text"
//                         placeholder="Your name"
//                     />
//                 </Box>
//                 <Box p={2}>
//                     <TextField
//                         value={url}
//                         onChange={e => setUrl(e.target.value)}
//                         type="text"
//                         placeholder="The URL for the link"
//                     />
//                 </Box>
//                 <Mutation
//                     mutation={POST_MUTATION}
//                     variables={{ description, url }}
//                     onCompleted={() => props.history.push('/new/1')}
//                     update={(store, { data: { post } }) => {
//                         const first = LINKS_PER_PAGE
//                         const skip = 0
//                         const orderBy = 'createdAt_DESC'
//                         const data = store.readQuery({
//                             query: FEED_QUERY,
//                             variables: { first, skip, orderBy }
//                         })
//                         data.feed.links.unshift(post)
//                         store.writeQuery({
//                             query: FEED_QUERY,
//                             data,
//                             variables: { first, skip, orderBy }
//                         })
//                     }}
//                 >
//                     {postMutation => <Button color="primary"  onClick={postMutation}>Submit</Button>}
//                 </Mutation>
//             </Box>
//         </Grid>
//     )
//
// }
//
// export default CreateLink