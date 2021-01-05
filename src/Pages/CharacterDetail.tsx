import { useRouter } from 'next/router'

import { useQuery, gql } from '@apollo/client'


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

  console.log({ data, error });

  if (loading) {
    return <p>loading...</p>
  }

  return (
    <h2>{data.character.name}</h2>
  )
}

export default CharacterDetail;