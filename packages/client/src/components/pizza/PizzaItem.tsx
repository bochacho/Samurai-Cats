import CardItem from '../common/CardItem';
import { Pizza } from '../../types';
import toDollars from '../../lib/format-dollars';
import { makeStyles } from '@material-ui/core';

export interface PizzaItemProps {
  pizza?: Pizza;
  selectPizza: (pizza?: Pizza) => void;
}

const useStyles = makeStyles({
  title: {
    fontSize: '2em',
  },
  image: {
    objectFit: 'cover',
    borderRadius: 10,
    display: 'flex',
    overflow: 'hidden',
    marginLeft: 'auto',
    marginRight: 'auto',
    width: 450,
    height: 450,
  },
  price: {
    fontWeight: 500,
    fontSize: '1.5em',
  },
});

const PizzaItem: React.FC<PizzaItemProps> = ({ pizza, selectPizza }) => {
  const classes = useStyles();
  return (
    <CardItem data-testid={`pizza-item-${pizza?.id}`} onClick={(): void => selectPizza(pizza)}>
      <div>
        <img
          className={classes.image}
          data-testid={`pizza-imgSrc-${pizza?.id}`}
          src={
            pizza?.imgSrc ??
            'https://img.freepik.com/premium-vector/cute-cat-chef-hold-knifes-cartoon-vector_507579-78.jpg?w=2000'
          }
          alt="Imagine there's a pizza here"
          // style={{ width: 350, height: 350, objectFit: 'cover' }}
        />
        <p className={classes.title}>
          <b data-testid={`pizza-name-${pizza?.id}`}>{pizza?.name ?? 'Create your own Pizza'}</b>
        </p>
        <p data-testid={`pizza-description-${pizza?.id}`}>{pizza?.description ?? 'Lets get to it! Meow!'}</p>
        <p className={classes.price} data-testid={`pizza-price-${pizza?.id}`}>
          {pizza ? toDollars(pizza.priceCents) : undefined}
        </p>
      </div>
    </CardItem>
  );
};

export default PizzaItem;
