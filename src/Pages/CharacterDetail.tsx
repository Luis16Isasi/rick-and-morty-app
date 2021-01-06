import { useRouter } from 'next/router'

import { useQuery, gql } from '@apollo/client'

import { APOLLO_STATE_PROP_NAME, initializeApollo } from '../../lib/apolloClient'

const CHARATER_QUERY = gql`
  query Character($id: ID!) {
    character(id: $id) {
      id
      name
      status
      species
      image
    }
  }
`;

const CharacterDetail = () => {
  const { query } = useRouter();

  const { data, loading, error } = useQuery(CHARATER_QUERY, {
    variables: {
      id: query.cid
    }
  });

  console.log({ data,loading,  error });

  if (loading) {
    return <p>loading...</p>
  }

  return (
    <h2>{data.character.name}</h2>
  )
}

export async function getStaticProps(){
  const apolloClient = initializeApollo();
  
  await apolloClient.query({
     query: CHARATER_QUERY, 
  })

  return {
    props:{
      [APOLLO_STATE_PROP_NAME]: apolloClient.cache.extract(),
    },
  }
}



export default CharacterDetail;