import { gql } from 'apollo-server';

const typeDefs = gql`
  type Pizza {
    id: ObjectID!
    name: String!
    description: String!
    toppings: [Topping!]!
    imgSrc: String!
    priceCents: Long!
  }

  type GetPizzasResponse {
    totalCount: Int!
    hasNextPage: Boolean!
    results: [Pizza!]!
    cursor: ObjectID
  }

  type Query {
    pizzas(input: PizzasResponseInput!): GetPizzasResponse!
  }

  type Mutation {
    createPizza(input: CreatePizzaInput!): Pizza!
    updatePizza(input: UpdatePizzaInput!): Pizza!
    deletePizza(input: DeletePizzaInput!): ObjectID!
  }

  input PizzaQueryArgs {
    id: ObjectID!
  }

  input PizzasResponseInput {
    limit: Int!
    cursor: ObjectID
  }

  input CreatePizzaInput {
    name: String!
    description: String!
    imgSrc: String!
    toppingIds: [ObjectID!]!
  }

  input UpdatePizzaInput {
    id: ObjectID!
    name: String
    description: String
    imgSrc: String
    toppingIds: [ObjectID!]
  }

  input DeletePizzaInput {
    id: ObjectID!
  }
`;

export { typeDefs };
