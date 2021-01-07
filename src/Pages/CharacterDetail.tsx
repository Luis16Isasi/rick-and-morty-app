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


const CHARACTERS_QUERY = gql`
  query Characters {
    characters {
      results {
        id
        name
        image
        status
        gender
        origin {
          id
          name
          type
        }
      }
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

export async function getStaticProps(context){
  console.log('context:', context);
  const apolloClient = initializeApollo();
  
  await apolloClient.query({
     query: CHARATER_QUERY,
     variables: { id: context.params.cid }
  })

  return {
    props:{
      [APOLLO_STATE_PROP_NAME]: apolloClient.cache.extract(),
    },
  }
}

export async function getStaticPaths(){
  const apolloClient = initializeApollo();

  const response = await apolloClient.query({
    query: CHARACTERS_QUERY,
  })
  
  return {
    paths: response.data.characters.results.map(character => ({ 
      params: { cid: character.id }
    })),
    fallback: false
  }
}



export default CharacterDetail;