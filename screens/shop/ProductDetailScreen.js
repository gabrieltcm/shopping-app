import React from "react";

import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  Button,
} from "react-native";

//Constant Color
import Colors from "../../constants/Colors";

// Import; To Connect Redux to this Component
// Alternative to useSelect is "CONNECT"
import { useSelector, useDispatch } from "react-redux";
//Redux Actions
import * as cartActions from "../../store/actions/cart";

const ProductDetailScreen = (props) => {
  const productId = props.navigation.getParam("productId");
  //Initialize; To connect Redux to this Component
  // .productsReducer is the name u set in rootReducer(App.js)
  // .availableProducts is the name u set in initialState(reducers/products.js)
  // .availableProducts returns us all available products, but we only want a product if the user clicks on that particular product,
  // hence we use find() which returns true if the condition is met
  const selectedProduct = useSelector((state) =>
    state.productsReducer.availableProducts.find(
      (prod) => prod.id === productId
    )
  );

  const dispatch = useDispatch();

  return (
    <ScrollView>
      <Image style={styles.image} source={{ uri: selectedProduct.imageUrl }} />
      <View style={styles.button}>
        <Button
          color={Colors.primary}
          title="Add to Cart"
          onPress={() => {
            dispatch(cartActions.addToCart(selectedProduct));
          }}
        />
      </View>
      <Text style={styles.price}>${selectedProduct.price.toFixed(2)}</Text>
      <Text style={styles.descriptionHeader}>Description:</Text>
      <Text style={styles.description}>{selectedProduct.description}</Text>
    </ScrollView>
  );
};

ProductDetailScreen.navigationOptions = (navData) => {
  return {
    //Setting header title, "productTitle" identifier is the name set in ProductsOverviewScreen.js
    headerTitle: navData.navigation.getParam("productTitle"),
  };
};

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 300,
  },
  button: {
    marginVertical: 10,
    alignItems: "center",
  },
  price: {
    fontSize: 20,
    color: "#888",
    textAlign: "center",
    marginVertical: 15,
    fontFamily: "open-sans-bold",
  },
  descriptionHeader: {
    fontSize: 18,
    fontFamily: "open-sans-bold",
    marginHorizontal: 20,
    marginVertical: 10,
  },
  description: {
    fontFamily: "open-sans",
    fontSize: 15,
    textAlign: "center",
    marginTop: 15,
    marginHorizontal: 20,
  },
});

export default ProductDetailScreen;
