import { renderWithProviders } from '../../../lib/test/renderWithProviders';
import Pizzas from '../Pizzas';
import { screen, waitFor } from '@testing-library/react';
import { server } from '../../../lib/test/msw-server';
import { graphql } from 'msw';
import { createQueryResult, createTestPizza } from '../../../lib/test/helper/pizza';
import { GetPizzasResponse } from '../../../types/schema';
import { act } from 'react-dom/test-utils';
import userEvent from '@testing-library/user-event';

describe('Pizzas', () => {
  const renderPizzaList = () => {
    const view = renderWithProviders(<Pizzas />);

    return {
      ...view,
      $findPizzaItems: () => screen.findAllByTestId(/^pizza-item-/),
      $findPizzaLoadingItem: () => screen.findAllByTestId(/^pizza-loading/),
      $nextButton: () => screen.findByTestId(/^next-button-1/),
      $prevButton: () => screen.findByTestId(/^prev-button-1/),
    };
  };

  const mockPizzaQuery = (data: GetPizzasResponse) => {
    server.use(
      graphql.query('Pizzas', (_request, response, context) => {
        return response(
          context.data({
            loading: false,
            pizzas: data,
          })
        );
      }),
      graphql.query('Toppings', (_request, response, context) => {
        return response(
          context.data({
            loading: false,
            toppings: data.results.map((pizza) => pizza.toppings),
          })
        );
      })
    );
  };

  beforeEach(() => {
    const pizza1 = createTestPizza();
    const pizza2 = createTestPizza();
    const getQueryResponse = createQueryResult([pizza1, pizza2]);
    mockPizzaQuery(getQueryResponse);
  });

  test('should display a list of pizzas', async () => {
    const { $findPizzaItems } = renderPizzaList();
    await waitFor(() => expect($findPizzaItems()).resolves.toHaveLength(3));
  });

  test('pizza loading screen test', async () => {
    const { $findPizzaLoadingItem } = renderPizzaList();
    await waitFor(() => {
      expect($findPizzaLoadingItem()).resolves.toHaveLength(1);
      expect($findPizzaLoadingItem()).resolves.not.toBeNull();
    });
  });

  test('test whether next & previous button are visible', async () => {
    const { $nextButton, $prevButton } = renderPizzaList();

    expect(await $nextButton()).toBeVisible();
    expect(await $prevButton()).toBeVisible();
  });

  test('test whether pressing next calls a function', async () => {
    const { $nextButton } = renderPizzaList();
    let buttonClicked = false;
    const inp = await $nextButton();
    inp.addEventListener('click', function nextPages() {
      buttonClicked = true;
    });
    act(() => userEvent.click(inp));
    expect(buttonClicked).toBe(true);
  });
});
