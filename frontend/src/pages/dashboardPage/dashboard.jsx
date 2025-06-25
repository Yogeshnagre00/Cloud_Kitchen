import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
} from "@mui/material";
import "./dashboard.css";
import { useNavigate } from "react-router-dom";
import bannerImage from "../../assets/banner_image.jpg";
import api from "../../services/api";

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    api.products
      .getAll()
      .then((data) => {
        setProducts(data);
        setError(null);
      })
      .catch((err) => {
        console.error("Failed to fetch products:", err);
        setError("Failed to load products. Please try again later.");
      })
      .finally(() => setLoading(false));
  }, []);

  const increaseQuantity = (id) =>
    setQuantities((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  const decreaseQuantity = (id) =>
    setQuantities((prev) => {
      const newQuantity = Math.max((prev[id] || 0) - 1, 0);
      const newQuantities = { ...prev, [id]: newQuantity };
      if (newQuantity === 0) delete newQuantities[id];
      return newQuantities;
    });

  const totalItems = Object.values(quantities).reduce((sum, qty) => sum + qty, 0);
  const totalPrice = products.reduce(
    (sum, product) => sum + product.price * (quantities[product.id] || 0),
    0
  );

  const handleViewCart = () => {
    navigate("/view-cart", { state: { cartItems: quantities, products } });
  };

  if (loading) return <Typography>Loading products...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <>
      <Box className="dashboard-container">
        <Box className="header-banner" sx={{ mb: 6 }}>
          <img
            src={bannerImage}
            alt="Claud Kitchen Banner"
            style={{ width: "98vw", height: "40vh", objectFit: "cover", display: "block" }}
          />
        </Box>

        <Grid
          container
          spacing={4}
          justifyContent="center"
          sx={{ paddingX: 2, paddingBottom: 10 }}
        >
          {products.map((product) => (
            <Grid
              key={product.id}
              item
              xs={12}
              sm={6}
              md={4}
              display="flex"
              justifyContent="center"
            >
              <Card
                sx={{
                  width: "100%",
                  maxWidth: 320,
                  borderRadius: 3,
                  boxShadow: 3,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CardMedia
                  component="img"
                  image={`${import.meta.env.VITE_IMAGE_BASE_URL}${product.image}`}
                  alt={product.name}
                  sx={{ height: 180, objectFit: "cover" }}
                />

                <CardContent sx={{ flexGrow: 1, textAlign: "center" }}>
                  <Typography variant="h6" fontWeight={600} mb={1}>
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    {product.description}
                  </Typography>
                  <Typography variant="h6" color="success.main" mb={1}>
                    ₹{product.price}
                  </Typography>
                </CardContent>

                <CardActions sx={{ justifyContent: "center", paddingBottom: 2 }}>
                  {quantities[product.id] > 0 ? (
                    <>
                      <Button onClick={() => decreaseQuantity(product.id)}>-</Button>
                      <Typography>{quantities[product.id]}</Typography>
                      <Button onClick={() => increaseQuantity(product.id)}>+</Button>
                    </>
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => increaseQuantity(product.id)}
                    >
                      ADD
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {totalItems > 0 && (
        <Box
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            background: "#fff",
            borderTop: "1px solid #ccc",
            padding: "12px 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <Typography>
            {totalItems} item(s) | ₹{totalPrice}
          </Typography>
          <Button variant="contained" color="success" onClick={handleViewCart}>
            View Cart
          </Button>
        </Box>
      )}
    </>
  );
};

export default Dashboard;
