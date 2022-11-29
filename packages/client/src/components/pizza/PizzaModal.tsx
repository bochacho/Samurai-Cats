import React from 'react';
import usePizzaMutation from '../../hooks/pizza/use-pizza-mutations';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
  Backdrop,
  createStyles,
  Fade,
  makeStyles,
  MenuItem,
  Modal,
  Paper,
  Select,
  TextField,
  Theme,
  Button,
} from '@material-ui/core';
import { useQuery } from '@apollo/client';
import { GET_TOPPINGS } from '../../hooks/graphql/topping/queries/get-toppings';
import { Pizza, Topping } from '../../types/schema';

interface PizzaInputType {
  name: string;
  description: string;
  imgSrc: string;
  toppingIds: string[];
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
      width: 500,
    },
    image: {
      width: 450,
      height: 450,
      display: 'flex',
      objectFit: 'cover',
      marginLeft: 'auto',
      marginRight: 'auto',
      borderRadius: 10,
    },
    root: {
      '& .MuiTextField-root': {
        margin: theme.spacing(1),
        width: '25ch',
      },
    },
    buttonSpacing: {
      marginTop: 10,
      display: 'flex',
      marginLeft: 25,
      marginRight: 25,
      justifyContent: 'space-between',
    },
    space: {
      marginTop: 10,
      marginLeft: 'auto',
      marginRight: 'auto',
      display: 'flex',
      width: 450,
    },
  })
);

interface PizzaModalProps {
  selectedPizza?: Partial<Pizza>;
  setSelectedPizza: React.Dispatch<React.SetStateAction<any>>;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const PizzaModal = ({ selectedPizza, open, setOpen }: PizzaModalProps): JSX.Element => {
  const { onCreatePizza, onUpdatePizza, onDeletePizza } = usePizzaMutation();
  const classes = useStyles();

  const initialValues: PizzaInputType = {
    name: selectedPizza?.name ?? '',
    description: selectedPizza?.description ?? '',
    imgSrc: selectedPizza?.imgSrc ?? '',
    toppingIds: selectedPizza?.toppings?.map((topping) => topping.id) ?? [],
  };
  const validationSchema = yup.object({
    name: yup.string().required('Name is Required'),
    imgSrc: yup.string().required('Image Source is Required'),
    description: yup.string().required('description is Required'),
    toppingIds: yup
      .array()
      .required('Cats only make pizzas with toppings')
      .of(yup.string().required('There is no topping')),
  });

  const deleteButtonDisplayed = (): any => {
    if (selectedPizza) {
      return (
        <Button
          variant="text"
          type="button"
          onClick={(): void => {
            onDeletePizza(selectedPizza);
            setOpen(false);
          }}
        >
          Delete
        </Button>
      );
    }
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      selectedPizza ? onUpdatePizza({ ...values, id: selectedPizza.id }) : onCreatePizza(values);
      setOpen(false);
    },
  });
  const { loading, data } = useQuery(GET_TOPPINGS);
  if (loading) {
    return <div>Loading ...</div>;
  }
  const toppingList = data?.toppings;
  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      className={classes.modal}
      onClose={(): void => {
        setOpen(false);
        formik.resetForm();
      }}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <Paper className={classes.paper}>
          <img
            className={classes.image}
            src={
              selectedPizza?.imgSrc ??
              'https://img.freepik.com/premium-vector/cute-cat-chef-hold-knifes-cartoon-vector_507579-78.jpg?w=2000'
            }
            alt="Imagine there's a pizza here"
          />
          <h2 className={classes.space}>{selectedPizza ? 'Edit' : 'Add'} Pizza</h2>
          <form onSubmit={formik.handleSubmit} autoComplete="off">
            <TextField
              id="name-input"
              className={classes.space}
              fullWidth
              label="Name"
              placeholder="What do you wanna call me?"
              name="name"
              defaultValue={formik.values.name}
              onChange={formik.handleChange}
            />
            <TextField
              id="description-input"
              label="Description"
              className={classes.space}
              placeholder="Tell me more about me!"
              name="description"
              defaultValue={formik.values.description}
              onChange={formik.handleChange}
            />
            <TextField
              id="image-input"
              fullWidth
              className={classes.space}
              label="Image Source"
              placeholder="How do I look?"
              name="imgSrc"
              defaultValue={formik.values.imgSrc}
              onChange={formik.handleChange}
            />
            <h4 className={classes.space}>Toppings</h4>
            <Select
              id="toppings-input"
              className={classes.space}
              fullWidth
              label="Toppings"
              margin="dense"
              name="toppingIds"
              multiple
              defaultValue={formik.values.toppingIds}
              onChange={formik.handleChange}
            >
              {toppingList.map((topping: Topping) => (
                <MenuItem value={topping.id}>{topping.name}</MenuItem>
              ))}
            </Select>
            <div className={classes.buttonSpacing}>
              <Button variant="text" type="submit">
                <h1>Submit</h1>
              </Button>
              {deleteButtonDisplayed()}
            </div>
          </form>
        </Paper>
      </Fade>
    </Modal>
  );
};
export default PizzaModal;
