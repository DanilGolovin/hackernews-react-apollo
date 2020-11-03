import React, {FunctionComponent, useMemo} from 'react';
import { useHistory, useLocation, useRouteMatch } from "react-router";
import { useQuery } from '@apollo/react-hooks'

import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";

import Link from './Link';
import { LINKS_PER_PAGE } from '../constants'
import { FEED_QUERY, NEW_LINKS_SUBSCRIPTION, NEW_VOTES_SUBSCRIPTION } from "../queries";

import type { Link as LinkType, Vote as VoteType } from "../types/link";


type queryData = {
    feed: {
        count?: number | null,
        links: LinkType[],
    }
}

type LinkListProps = {

}

const LinkList: FunctionComponent<LinkListProps> = () => {
    const history = useHistory();
    const match = useRouteMatch();
    const location = useLocation();
    console.log('match',  match.params)
    // cannot recognize match.params.page
    const MPP = '1'
    const _updateCacheAfterVote = (store: any, createVote: VoteType, linkId: string) => {
        const isNewPage = location.pathname.includes('new')
        const page = parseInt(MPP, 10)

        const skip = isNewPage ? (page - 1) * LINKS_PER_PAGE : 0
        const first = isNewPage ? LINKS_PER_PAGE : 100
        const orderBy = isNewPage ? 'createdAt_DESC' : null
        const data: queryData = store.readQuery({
            query: FEED_QUERY,
            variables: { first, skip, orderBy }
        })

        const votedLink = data.feed.links.find((link) => link.id === linkId)
        if (votedLink !== undefined) votedLink.votes = createVote.link.votes

        store.writeQuery({ query: FEED_QUERY, data })
    }

    const _subscribeToNewLinks = (subscribeToMore: any) => {
        subscribeToMore({
            document: NEW_LINKS_SUBSCRIPTION,
            updateQuery: (prev: any, { subscriptionData }: any) => {
                if (!subscriptionData.data) return prev

                const newLink = subscriptionData.data.newLink || {}
                if (newLink) {
                    const exists = prev.feed.links.find((id: string) => id === newLink.id)
                    if (exists) return prev;
                }



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

    const _subscribeToNewVotes = (subscribeToMore: any) => {
        subscribeToMore({
            document: NEW_VOTES_SUBSCRIPTION
        })
    }

    function _getQueryVariables() {
        const isNewPage = location.pathname.includes('new')
        const page = parseInt(MPP, 10)

        const skip = isNewPage ? (page - 1) * LINKS_PER_PAGE : 0
        const first = isNewPage ? LINKS_PER_PAGE : 100
        const orderBy = isNewPage ? 'createdAt_DESC' : null
        return { first, skip, orderBy }
    }

    const _getLinksToRender = (data: queryData) => {
       // console.log('data: ', data)
        const isNewPage = location.pathname.includes('new')
        if (isNewPage) {
            return data.feed.links
        }
        const rankedLinks = data.feed.links.slice()
        rankedLinks.sort((l1, l2) => l2.votes.length - l1.votes.length)
       // console.log('rankedLinks', rankedLinks)
        return rankedLinks
    }

    const _nextPage = (data: queryData) => {
        const page = parseInt(MPP)

        if (data.feed.count) {
            if (page <= (data.feed.count / LINKS_PER_PAGE)) {
                const nextPage = page + 1
                history.push(`/new/${nextPage}`)
            }
        }
    }

    const _previousPage = () => {
        const page = parseInt(MPP, 10)
        if (page > 1) {
            const previousPage = page - 1
            history.push(`/new/${previousPage}`)
        }
    }

    const variables = useMemo(() => _getQueryVariables(), [_getQueryVariables ]);

    const { loading, error, data, subscribeToMore } = useQuery(FEED_QUERY,{variables})

    let content, isNewPage, pageIndex: number, linksToRender;
    if (error) content = error;
    else if (loading) content = 'loading...';
    if (!loading) {
         linksToRender = _getLinksToRender(data)
         isNewPage = location.pathname.includes('new')
         pageIndex = MPP
             ? (+MPP - 1) * LINKS_PER_PAGE
             : 0

        content = linksToRender.map((link, index) => (
            <Link
                key={link?.id}
                link={link}
                index={index + pageIndex}
                updateStoreAfterVote={_updateCacheAfterVote}
            />
        ))
        _subscribeToNewLinks(subscribeToMore)
        _subscribeToNewVotes(subscribeToMore)
    }
    console.log('data', data)
    return (
        <>
            {content}
            <Grid container>
                <Box m={2}>
                    <Button variant="outlined" color="primary" onClick={_previousPage}>
                        Previous
                    </Button>
                </Box>
                <Box m={2}>
                    <Button variant="outlined" color="primary" disabled={!(isNewPage || isNewPage === undefined)} onClick={() => _nextPage(data)}>
                        Next
                    </Button>
                </Box>
            </Grid>
        </>
    )
}

export default LinkList;