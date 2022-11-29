import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';
import { createTestPizza } from '../../../lib/test/helper/pizza';
import { renderWithProviders } from '../../../lib/test/renderWithProviders';
import PizzaItem, { PizzaItemProps } from '../PizzaItem';

describe('PizzaItem', () => {
  const renderPizzaItem = (props: PizzaItemProps) => {
    const view = renderWithProviders(<PizzaItem {...props} />);

    return {
      ...view,
      $getName: () => screen.getByTestId(/^pizza-name/),
      $getDescription: () => screen.getByTestId(/^pizza-description/),
      $getImgSrc: () => screen.getByTestId(/^pizza-imgSrc/),
      $getPrice: () => screen.getByTestId(/^pizza-price/),
      $selectPizza: () => screen.getByTestId(/^pizza-item/),
    };
  };

  const props = {
    selectPizza: jest.fn(),
    pizza: createTestPizza(),
  };

  test('should contain all the right components', async () => {
    const { $getName, $getDescription, $getPrice } = renderPizzaItem(props);
    expect($getName()).toHaveTextContent('This is not a Pizza');
    expect($getDescription()).toHaveTextContent('Waow! A Pizza!!');
    expect($getPrice()).toHaveTextContent('0');
  });

  test('should display all components of the pizzaItem', async () => {
    const { $getName, $getDescription, $getImgSrc, $getPrice } = renderPizzaItem(props);

    expect($getName()).toBeVisible();
    expect($getDescription()).toBeVisible();
    expect($getImgSrc()).toBeVisible();
    expect($getPrice()).toBeVisible();
  });

  test('should call selectPizza when the PizzaItem is clicked', async () => {
    const { $selectPizza } = renderPizzaItem(props);

    act(() => userEvent.click($selectPizza()));

    expect(props.selectPizza).toHaveBeenCalledTimes(1);
  });
});
