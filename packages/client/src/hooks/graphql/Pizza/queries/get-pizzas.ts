import { gql } from '@apollo/client';

const GET_PIZZAS = gql`
  query Pizzas($queryInput: PizzasResponseInput!) {
    pizzas(input: $queryInput) {
      cursor
      hasNextPage
      totalCount
      results {
        name
        id
        toppings {
          name
          id
          priceCents
        }
        description
        imgSrc
        priceCents
      }
    }
  }
`;

export { GET_PIZZAS };
