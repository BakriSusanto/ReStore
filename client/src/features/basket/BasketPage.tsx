import { Add, Delete, Remove } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/store/configureStore';
import { currencyFormat } from '../../app/util/util';
import BasketSummary from './BasketSummary';
import { addBasketItemAsync, removeBasketItemAsync } from './basketSlice';

export default function BasketPage() {
  const dispatch = useAppDispatch();
  const { basket, status } = useAppSelector((state) => state.basket);

  if (!basket || basket.items.length === 0)
    return <Typography variant="h3">Your basket is empty</Typography>;

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="center">Quantity</TableCell>
              <TableCell align="right">SubTotal</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {basket.items.map((item) => (
              <TableRow
                key={item.productId}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  <Box display="flex" alignItems="center">
                    <img
                      src={item.pictureUrl}
                      alt={item.name}
                      style={{ height: 50, marginRight: 20 }}
                    />
                    <span>{item.name}</span>
                  </Box>
                </TableCell>
                <TableCell align="right">
                  {currencyFormat(item.price)}
                </TableCell>
                <TableCell align="center">
                  <LoadingButton
                    color="error"
                    onClick={() =>
                      dispatch(
                        removeBasketItemAsync({
                          productId: item.productId,
                          quantity: 1,
                          name: 'rem',
                        })
                      )
                    }
                    loading={status === 'pending' + item.productId + 'rem'}
                  >
                    <Remove />
                  </LoadingButton>
                  {item.quantity}
                  <LoadingButton
                    color="secondary"
                    onClick={() =>
                      dispatch(
                        addBasketItemAsync({ productId: item.productId })
                      )
                    }
                    loading={status === 'pending' + item.productId}
                  >
                    <Add />
                  </LoadingButton>
                </TableCell>
                <TableCell align="right">
                  ${((item.price / 100) * item.quantity).toFixed(2)}
                </TableCell>
                <TableCell align="right">
                  <LoadingButton
                    color="error"
                    onClick={() =>
                      dispatch(
                        removeBasketItemAsync({
                          productId: item.productId,
                          quantity: item.quantity,
                          name: 'del',
                        })
                      )
                    }
                    loading={status === 'pending' + item.productId + 'del'}
                  >
                    <Delete />
                  </LoadingButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Grid container>
        <Grid item xs={6} />
        <Grid item xs={6}>
          <BasketSummary />
          <Button
            component={Link}
            to="/checkout"
            size="large"
            variant="contained"
            fullWidth
          >
            Checkout
          </Button>
        </Grid>
      </Grid>
    </>
  );
}
