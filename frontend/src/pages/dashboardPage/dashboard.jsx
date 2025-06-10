import  { useEffect, useState } from "react";
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
import bannerImage from "../../assets/banner_image.jpg";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";

// Main Dashboard component for displaying products and managing cart
const Dashboard = () => {
  const [products, setProducts] = useState([]); // Stores the list of products from API
  const [quantities, setQuantities] = useState({}); // Stores quantity of each product in cart
  const navigate = useNavigate(); // For navigation to cart page

  // Fetch products from backend API when component mounts
  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error("Error fetching products:", error));
      
  }, []); // Empty dependency array means this runs once on mount

  // Handle increasing quantity of a product in cart
  const increaseQuantity = (id) => {
    setQuantities((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  // Handle decreasing quantity of a product in cart
  const decreaseQuantity = (id) => {
    setQuantities((prev) => {
      const updated = { ...prev, [id]: Math.max((prev[id] || 0) - 1, 0) };
      if (updated[id] === 0) delete updated[id]; // Remove item if quantity reaches 0
      return updated;
    });
  };

  // Calculate total number of items in cart
  const totalItems = Object.values(quantities).reduce((a, b) => a + b, 0);
  
  // Calculate total price of all items in cart
  const totalPrice = products.reduce((acc, product) => {
    const qty = quantities[product.id] || 0;
    return acc + product.price * qty;
  }, 0);
  const handleViewCart = () => {
    navigate("/view-cart", {
      state: {
        cartItems: quantities,
        products: products,
      },
    });
  };
  return (
    <>
      <Box className="dashboard-container">
        <Box className="header-banner">
      <img
        src={bannerImage}
        alt="Claud Kitchen Banner"
        style={{
          width: "98vw",
          height: "40vh",
          objectFit: "cover",
          display: "block",
        }}
      />
    </Box>

        <Grid container spacing={4} className="product-grid">
          {products.map((product) => (
            <Grid key={product.id} item xs={12} sm={6} md={4}>
              <Card className="product-card">
                <CardMedia
                  component="img"
                  image={`http://localhost:5000${product.image}`}
                  alt={product.name}
                />
                <CardContent className="product-content">
                  <Typography className="product-name">
                    {product.name}
                  </Typography>
                  <Typography className="product-description">
                    {product.description}
                  </Typography>
                  <Typography className="product-price">
                    ₹{product.price}
                  </Typography>
                </CardContent>
                <CardActions className="quantity-controls">
                  {quantities[product.id] > 0 ? (
                    <>
                      <Button onClick={() => decreaseQuantity(product.id)}>
                        -
                      </Button>
                      <Typography>{quantities[product.id]}</Typography>
                      <Button onClick={() => increaseQuantity(product.id)}>
                        +
                      </Button>
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
        <Box className="checkout-bar">
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
