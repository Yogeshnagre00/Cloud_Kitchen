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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Radio,
  RadioGroup,
  FormControlLabel,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import bannerImage from "../../assets/banner_image.jpg";
import "./dashboard.css";

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSpec, setSelectedSpec] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await api.products.getAll();
        setProducts(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleProductClick = (product) => {
    if (product.specifications && product.specifications.length > 0) {
      setSelectedProduct(product);
      setSelectedSpec(null);
    } else {
      // If no specifications, add directly with product ID
      setQuantities(prev => ({
        ...prev,
        [product.id]: (prev[product.id] || 0) + 1
      }));
    }
  };

  const handleAddToCart = () => {
    if (!selectedProduct || !selectedSpec) return;
    
    // Format: "productId:specId" for items with specs
    const cartKey = `${selectedProduct.id}:${selectedSpec.id}`;
    setQuantities(prev => ({
      ...prev,
      [cartKey]: (prev[cartKey] || 0) + 1
    }));
    
    setSelectedProduct(null);
    setSelectedSpec(null);
  };

  const handleQuantityChange = (key, delta) => {
    setQuantities(prev => {
      const newQty = (prev[key] || 0) + delta;
      if (newQty <= 0) {
        const { [key]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [key]: newQty };
    });
  };

  // Calculate cart totals
  const { totalItems, totalPrice } = Object.entries(quantities).reduce(
    (acc, [key, qty]) => {
      const [productId, specId] = key.split(':');
      const product = products.find(p => p.id.toString() === productId);
      
      if (!product) return acc;
      
      let itemPrice = product.price;
      if (specId) {
        const spec = product.specifications?.find(s => s.id.toString() === specId);
        itemPrice = spec?.price || product.price;
      }
      
      return {
        totalItems: acc.totalItems + qty,
        totalPrice: acc.totalPrice + itemPrice * qty
      };
    },
    { totalItems: 0, totalPrice: 0 }
  );

  const handleViewCart = () => {
    navigate("/view-cart", {
      state: {
        cartItems: quantities,
        products
      }
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={4}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <>
      <Box className="dashboard-container">
        <Box className="header-banner" sx={{ mb: 6 }}>
          <img
            src={bannerImage}
            alt="Claud Kitchen Banner"
            style={{ width: "98vw", height: "40vh", objectFit: "cover" }}
          />
        </Box>

        <Grid container spacing={4} justifyContent="center" padding={2} paddingBottom={10}>
          {products.map((product) => {
            // Find all cart entries for this product (with or without specs)
            const productCartKeys = Object.keys(quantities).filter(
              key => key.startsWith(`${product.id}:`) || key === product.id.toString()
            );
            const productQty = productCartKeys.reduce(
              (sum, key) => sum + quantities[key], 0
            );

            return (
              <Grid key={product.id} item xs={12} sm={6} md={4} display="flex" justifyContent="center">
                <Card sx={{
                  width: "100%",
                  maxWidth: 320,
                  borderRadius: 3,
                  boxShadow: 3,
                  display: "flex",
                  flexDirection: "column",
                }}>
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
                    {productQty > 0 ? (
                      <>
                        <Button onClick={() => handleQuantityChange(
                          productCartKeys[0], -1
                        )}>-</Button>
                        <Typography>{productQty}</Typography>
                        <Button onClick={() => handleQuantityChange(
                          productCartKeys[0], 1
                        )}>+</Button>
                      </>
                    ) : (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleProductClick(product)}
                      >
                        ADD
                      </Button>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Box>

      {/* Specification Selection Dialog */}
      <Dialog
        open={Boolean(selectedProduct)}
        onClose={() => setSelectedProduct(null)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {selectedProduct?.name} - Select Option
        </DialogTitle>
        <DialogContent>
          <RadioGroup
            value={selectedSpec?.id || ""}
            onChange={(e) => {
              const spec = selectedProduct.specifications.find(
                s => s.id.toString() === e.target.value
              );
              setSelectedSpec(spec);
            }}
          >
            {/* Include base product as an option */}
            <FormControlLabel
              value="base"
              control={<Radio />}
              label={`Standard - ₹${selectedProduct?.price}`}
            />
            
            {selectedProduct?.specifications?.map((spec) => (
              <FormControlLabel
                key={spec.id}
                value={spec.id}
                control={<Radio />}
                label={`${spec.name} - ₹${spec.price}`}
              />
            ))}
          </RadioGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedProduct(null)}>Cancel</Button>
          <Button
            onClick={handleAddToCart}
            disabled={!selectedSpec && !selectedProduct}
            variant="contained"
            color="primary"
          >
            Add to Cart
          </Button>
        </DialogActions>
      </Dialog>

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
            {totalItems} item(s) | ₹{totalPrice.toFixed(2)}
          </Typography>
          <Button variant="contained" color="success" onClick={handleViewCart}>
            View Cart ({totalItems})
          </Button>
        </Box>
      )}
    </>
  );
};

export default Dashboard;