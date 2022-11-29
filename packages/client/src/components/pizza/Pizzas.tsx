import React from 'react';
import { Grid, makeStyles, createStyles, Button } from '@material-ui/core';

import { useQuery } from '@apollo/client';
import { GET_PIZZAS } from '../../hooks/graphql/Pizza/queries/get-pizzas';
import { Pizza } from '../../types';
import CardItemSkeleton from '../common/CardItemSkeleton';
import PizzaItem from './PizzaItem';
import PageHeader from '../common/PageHeader';
import PizzaModal from './PizzaModal';

const useStyles = makeStyles(() =>
  createStyles({
    div: {
      padding: '2vw',
    },
    loadButton: {
      display: 'flex',
      fontSize: '1.1ew',
      borderRadius: 30,
    },
    sideBySide: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      gap: '3rem',
      paddingTop: '1.5rem',
    },
    sideBySideButToTheRight: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: '3rem',
      marginTop: 'auto',
      marginBottom: 'auto',
    },
    header: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
  })
);

const Pizzas: React.FC = () => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [selectedPizza, setSelectedPizza] = React.useState<Partial<Pizza>>();
  const [cursor, setCursor] = React.useState<string | null>(null);
  const [cursorArr, setCursorArr] = React.useState<(string | null)[]>([]);

  const limit = 5;

  const { loading, data, error } = useQuery(GET_PIZZAS, {
    variables: { queryInput: { cursor: cursor, limit: limit } },
  });
  if (loading) {
    return <CardItemSkeleton data-testid={'pizza-loading'}>Pizza-List-Loading...</CardItemSkeleton>;
  }
  if (error) {
    return <div>Error! {error.message}</div>;
  }

  const nextPages = (): void => {
    let tempArr = cursorArr;
    tempArr.push(cursor);
    setCursorArr(tempArr);
    setCursor(data?.pizzas.cursor);
  };

  const previousPages = (): void => {
    setCursor(cursorArr[cursorArr.length - 1]);
    let tempArr = cursorArr;
    tempArr.pop();
    setCursorArr(tempArr);
  };

  const selectPizza = (pizza?: Pizza): void => {
    setSelectedPizza(pizza);
    setOpen(true);
  };

  const renderPizzas = (pizzaList: Pizza[]): any => {
    return pizzaList.map((pizza: Pizza) => (
      <Grid key={`pizza-grid-${pizza.id}`} item xs={12} md={6} lg={4} xl={4}>
        <PizzaItem data-testid={`pizza-item-${pizza?.id}`} key={pizza.id} pizza={pizza} selectPizza={selectPizza} />
      </Grid>
    ));
  };

  const renderButtons = (className: any, id: number): any => {
    return (
      <div className={className}>
        <Button
          data-testid={`prev-button-${id}`}
          onClick={(): void => previousPages()}
          disabled={!cursorArr.length}
          className={classes.loadButton}
          variant="text"
        >
          Previous
        </Button>
        <Button
          data-testid={`next-button-${id}`}
          onClick={(): void => nextPages()}
          disabled={!hasNext}
          className={classes.loadButton}
          variant="text"
        >
          Next
        </Button>
      </div>
    );
  };

  var pizzaList = data?.pizzas.results;
  var hasNext = data?.pizzas.hasNextPage;

  return (
    <div className={classes.div}>
      <div className={classes.header}>
        <PageHeader pageHeader="Pizzas" />
        {renderButtons(classes.sideBySideButToTheRight, 0)}
      </div>
      <Grid key="pizza-grid" container spacing={6}>
        <Grid key="pizza-add-grid" item xs={12} md={6} lg={4} xl={4}>
          <PizzaItem key="add-pizza" selectPizza={selectPizza}>
            <img
              id="make-a-pizza"
              className="mkPizza"
              src="https://img.freepik.com/premium-vector/cute-cat-chef-hold-knifes-cartoon-vector_507579-78.jpg?w=2000"
              style={{ width: 300, height: 300, objectFit: 'cover' }}
            />
          </PizzaItem>
        </Grid>
        {renderPizzas(pizzaList)}
      </Grid>
      {renderButtons(classes.sideBySide, 1)}
      <PizzaModal selectedPizza={selectedPizza} setSelectedPizza={setSelectedPizza} open={open} setOpen={setOpen} />
    </div>
  );
};

export default Pizzas;
