import { useMemo} from 'react';
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'
// import { concatPagination } from '@apollo/client/utilities'
import merge from 'deepmerge'
import isEqual from 'lodash/isEqual'

export const APOLLO_STATE_PROP_NAME = '__APOLLO_STATE__'

let apolloClient;

function createApolloClient() {
  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: new HttpLink({
      uri: 'https://rickandmortyapi.com/graphql',
      credentials: 'same-origin',
    }),
    cache: new InMemoryCache()
  })
}

export function initializeApollo(initialState = {}) {
  const _apolloClient = apolloClient ?? createApolloClient();

  if (initialState) {
    const existsCcahe = _apolloClient.extract();

    // merge the existing cache into data passed from getStaticProps/getServerSideProps
    const data = merge(initialState, existsCcahe, {
      arrayMerge: (destination, source) => [
        ...source,
        ...destination.filter(d => source.every(s => !isEqual(d, s)))
      ]
    })

    _apolloClient.cache.restore(data)
  }

  if (typeof window === 'undefined') {
    return _apolloClient
  }

  if (!apolloClient) apolloClient = _apolloClient
  return _apolloClient
}

export function addApolloState(client, pageProps) {
  if (pageProps?.props) {
    pageProps.props[APOLLO_STATE_PROP_NAME] = client.cache.extract()
  }
}

export function useApollo(pageProps) {
  const state = pageProps[APOLLO_STATE_PROP_NAME]
  const client = useMemo(() => initializeApollo(state), [state])
  return client;
}