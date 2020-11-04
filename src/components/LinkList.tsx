import React, { FC } from 'react';
import {useHistory, useLocation, useParams} from "react-router";
import { useQuery } from 'react-apollo'
import { DataProxy } from 'apollo-cache'

import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";

import Link from './Link';
import { LINKS_PER_PAGE } from '../constants'
import { FEED_QUERY, NEW_LINKS_SUBSCRIPTION, NEW_VOTES_SUBSCRIPTION } from "../queries";

import { SubscribeToMoreOptions } from  'apollo-client'

import type { Link as LinkType, Vote as VoteType } from "../types/link";

type queryData = {
    feed: {
        __typename: any;
        count?: number | null,
        links: LinkType[],
    }
}

type LinkListProps = {}

type subscribeToMoreType = (options: SubscribeToMoreOptions) => () => void;


type Params = {
    page: string,
}
const LinkList: FC<LinkListProps> = () => {
    const history = useHistory();
    const params = useParams<Params>();
    const location = useLocation();

    const _updateCacheAfterVote = (store: DataProxy, createVote: VoteType, linkId: string) => {
        const isNewPage = location.pathname.includes('new')
        const page = parseInt(params.page, 10)

        const skip = isNewPage ? (page - 1) * LINKS_PER_PAGE : 0
        const first = isNewPage ? LINKS_PER_PAGE : 100
        const orderBy = isNewPage ? 'createdAt_DESC' : null
        const data: queryData | null = store.readQuery({
            query: FEED_QUERY,
            variables: { first, skip, orderBy }
        })

        if (data) {
            const votedLink = data.feed.links.find((link) => link.id === linkId)
            if (votedLink !== undefined) votedLink.votes = createVote.link.votes

            store.writeQuery({query: FEED_QUERY, data})
        }
    }

    const _subscribeToNewLinks = (subscribeToMore: subscribeToMoreType) => {
        subscribeToMore({
            document: NEW_LINKS_SUBSCRIPTION,
            updateQuery: (prev: queryData, { subscriptionData }: any) => {
                if (!subscriptionData.data) return prev

                const newLink = subscriptionData.data.newLink || {}
                if (newLink) {
                    const exists = prev.feed.links.find((id) => id === newLink.id)
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

    const _subscribeToNewVotes = (subscribeToMore: subscribeToMoreType) => {
        subscribeToMore({
            document: NEW_VOTES_SUBSCRIPTION
        })
    }

    function _getQueryVariables() {
        const isNewPage = location.pathname.includes('new')

        const page = parseInt(params.page, 10)

        const skip = isNewPage ? (page - 1) * LINKS_PER_PAGE : 0
        const first = isNewPage ? LINKS_PER_PAGE : 100
        const orderBy = isNewPage ? 'createdAt_DESC' : null
        return { first, skip, orderBy }
    }

    const _getLinksToRender = (data: queryData) => {
        const isNewPage = location.pathname.includes('new')
        if (isNewPage) {
            return data.feed.links
        }
        const rankedLinks = data.feed.links.slice()
        rankedLinks.sort((l1, l2) => l2.votes.length - l1.votes.length)
        return rankedLinks
    }

    const _nextPage = (data: queryData) => {
        const page = parseInt(params.page)

        if (data.feed.count) {
            if (page <= (data.feed.count / LINKS_PER_PAGE)) {
                const nextPage = page + 1
                history.push(`/new/${nextPage}`)
            }
        }
    }

    const _previousPage = () => {
        const page = parseInt(params.page, 10)
        if (page > 1) {
            const previousPage = page - 1
            history.push(`/new/${previousPage}`)
        }
    }

    const variables = _getQueryVariables();

    const { loading, error, data, subscribeToMore } = useQuery(FEED_QUERY,{ variables })

    let content, isNewPage, pageIndex: number, linksToRender;
    if (error) content = error;
    else if (loading) content = 'loading...';
    if (!loading) {

        linksToRender = _getLinksToRender(data)

         isNewPage = location.pathname.includes('new')
         pageIndex = params.page
             ? (+params.page - 1) * LINKS_PER_PAGE
             : 0

        content = linksToRender.map((link: LinkType, index: number) => (
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