import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Divider,
  CircularProgress,
} from "@mui/material";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/orders")
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((err) => console.error("Fetch orders error:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        All Orders
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : orders.length === 0 ? (
        <Typography variant="body1" color="textSecondary">
          No orders have been placed yet.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {orders.map((order) => (
            <Grid item xs={12} md={6} key={order.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{order.name}</Typography>
                  <Typography component="a" href={`mailto:${order.email}`} color="primary">
                    {order.email}
                  </Typography>
                  <Typography component="a" href={`tel:${order.mobile}`} color="textSecondary">
                    {order.mobile}
                  </Typography>
                  <Typography>{order.address}</Typography>

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="subtitle1">Items:</Typography>
                  {order.items.map((item, idx) => (
                    <Box key={idx} ml={2}>
                      <Typography>
                        {item.name} (x{item.quantity}) – ₹{item.price} each = ₹
                        {item.price * item.quantity}
                      </Typography>
                    </Box>
                  ))}

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="h6">Total: ₹{order.total_price}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    Ordered on: {new Date(order.created_at).toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default AdminOrders;
