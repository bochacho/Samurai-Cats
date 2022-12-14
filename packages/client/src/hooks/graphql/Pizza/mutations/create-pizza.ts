import { gql } from '@apollo/client';

export const CREATE_PIZZA = gql`
  mutation ($createPizzaInput: CreatePizzaInput!) {
    createPizza(input: $createPizzaInput) {
      name
      description
      imgSrc
      priceCents
      toppings {
        id
        name
        priceCents
      }
    }
  }
`;
