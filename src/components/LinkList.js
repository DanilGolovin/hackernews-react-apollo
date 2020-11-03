import React, {useMemo} from 'react';
import { useQuery } from '@apollo/react-hooks'

import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";

import Link from './Link';
import { LINKS_PER_PAGE } from '../constants'
import { FEED_QUERY, NEW_LINKS_SUBSCRIPTION, NEW_VOTES_SUBSCRIPTION } from "../queries";


const LinkList = (props) => {
    const _updateCacheAfterVote = (store, createVote, linkId) => {
        const isNewPage = props.location.pathname.includes('new')
        const page = parseInt(props.match.params.page, 10)

        const skip = isNewPage ? (page - 1) * LINKS_PER_PAGE : 0
        const first = isNewPage ? LINKS_PER_PAGE : 100
        const orderBy = isNewPage ? 'createdAt_DESC' : null
        const data = store.readQuery({
            query: FEED_QUERY,
            variables: { first, skip, orderBy }
        })

        const votedLink = data.feed.links.find(link => link.id === linkId)
        votedLink.votes = createVote.link.votes

        store.writeQuery({ query: FEED_QUERY, data })
    }

    const _subscribeToNewLinks = subscribeToMore => {
        subscribeToMore({
            document: NEW_LINKS_SUBSCRIPTION,
            updateQuery: (prev, { subscriptionData }) => {
                if (!subscriptionData.data && !subscriptionData.data.newLink) return prev
                const newLink = subscriptionData.data.newLink

                const exists = prev.feed.links.find(( id ) => id === newLink.id)
                if (exists) return prev;

                return Object.assign({}, prev, {
                    feed: {
                        links: [newLink, ...prev.feed.links],
                        count: prev.feed.links.length + 1,
                        __typename: prev.feed.__typename
                    }
                })
            }
        })
    }

    const _subscribeToNewVotes = subscribeToMore => {
        subscribeToMore({
            document: NEW_VOTES_SUBSCRIPTION
        })
    }

    function _getQueryVariables() {
        const isNewPage = props.location.pathname.includes('new')
        const page = parseInt(props.match.params.page, 10)

        const skip = isNewPage ? (page - 1) * LINKS_PER_PAGE : 0
        const first = isNewPage ? LINKS_PER_PAGE : 100
        const orderBy = isNewPage ? 'createdAt_DESC' : null
        return { first, skip, orderBy }
    }

    const _getLinksToRender = data => {
       // console.log('data: ', data)
        const isNewPage = props.location.pathname.includes('new')
        if (isNewPage) {
            return data.feed.links
        }
        const rankedLinks = data.feed.links.slice()
        rankedLinks.sort((l1, l2) => l2.votes.length - l1.votes.length)
       // console.log('rankedLinks', rankedLinks)
        return rankedLinks
    }

    const _nextPage = data => {
        const page = parseInt(props.match.params.page, 10)
        if (page <= data.feed.count / LINKS_PER_PAGE) {
            const nextPage = page + 1
            props.history.push(`/new/${nextPage}`)
        }
    }

    const _previousPage = () => {
        const page = parseInt(props.match.params.page, 10)
        if (page > 1) {
            const previousPage = page - 1
            props.history.push(`/new/${previousPage}`)
        }
    }

    const variables = useMemo(() => _getQueryVariables(), [_getQueryVariables ]);

    const { loading, error, data, subscribeToMore } = useQuery(FEED_QUERY,{variables})
   // console.log(data)
    let content, isNewPage, pageIndex;
    if (error) content = error;
    else if (loading) content = 'loading...';
    if (!loading) {
        const linksToRender = _getLinksToRender(data)
         isNewPage = props.location.pathname.includes('new')
         pageIndex = props.match.params.page
             ? (props.match.params.page - 1) * LINKS_PER_PAGE
             : 0

        content = linksToRender.map((link, index) => (
            <Link
                key={link.id}
                link={link}
                index={index + pageIndex}
                updateStoreAfterVote={_updateCacheAfterVote}
            />
            ))
        _subscribeToNewLinks(subscribeToMore)
        _subscribeToNewVotes(subscribeToMore)
    }

    return (
        <>
            {content}
            {isNewPage && (
                <Grid container>
                    <Box m={2}>
                        <Button variant="outlined" color="primary" onClick={_previousPage}>
                            Previous
                        </Button>
                    </Box>
                    <Box m={2}>
                        <Button variant="outlined" color="primary" onClick={() => _nextPage(data)}>
                            Next
                        </Button>
                    </Box>
                </Grid>
            )}
        </>
    )
}

export default LinkList;