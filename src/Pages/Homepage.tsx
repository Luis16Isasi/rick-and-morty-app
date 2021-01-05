import Link from 'next/link'

import { useQuery, gql } from '@apollo/client'
import styled from 'styled-components';

import { initializeApollo, APOLLO_STATE_PROP_NAME } from '../../lib/apolloClient'

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

const CardListContainer = styled.div `
  max-width: 1024px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 24px
`;

const CardWrapper = styled.div`
  /* width = (100% / n) - (marginRight * (n - 1)) / n */
  width: 100%;
  border: 1px solid #afacac;
  border-radius: 8px;
  display: flex;
  flex-flow: row nowrap;
  cursor: pointer;
  box-shadow: 0px 0px 0px black;
  &:hover {
    transition: box-shadow 0.2s ease-in-out;
    box-shadow: 4px 4px 12px rgba(0, 0, 0, 0.2)
  }
  p {
    margin-top: 4px;
    margin-bottom: 4px;
  }
`;

const Homepage = () => {
  const { data, loading, error } = useQuery(CHARACTERS_QUERY)
  console.log({ data, loading, error });

  return (
    <div>
      <div style={{ textAlign: "center" }}>
        <h1>Ricky and Morty Characters!!!</h1>
        <h4>Please select a character from the list</h4>
      </div>
      <CardListContainer>
        {data.characters.results.map(character => (
          <Link key={character.id} href={`/characters/${character.id}`}>
            <CardWrapper >
              <div style={{
                marginRight: 12,
                borderRadius: 8,
              }}>
                <img src={character.image} alt={character.name} style={{
                  width: '120px',
                  height: 'auto',
                  borderRadius: 8
                }} />
              </div>
              <div>
                <p>
                  Name: {character.name}
                </p>
                <p>
                  Origin: {character.origin.name}
                </p>
                <p>
                  Genger: {character.gender}
                </p>
                <p>
                Genger: {character.status}
                </p>
              </div>
            </CardWrapper>
          </Link>
        ))}
      </CardListContainer>
    </div>
  )
}

export async function getStaticProps() {
  const apolloClient = initializeApollo();

  await apolloClient.query({
    query: CHARACTERS_QUERY,
  })

  return {
    props: {
      [APOLLO_STATE_PROP_NAME]: apolloClient.cache.extract(),
    },
    // revalidate: 1,
  }
}

export default Homepage