import React, { useState } from "react";

import {
  StyleSheet,
  FlatList,
  View,
  Text,
  Button,
  ActivityIndicator,
} from "react-native";

//Constant Colors
import Colors from "../../constants/Colors";

// Import; To Connect Redux to this Component
// Alternative to useSelect(mapStateToProps) & useDispatch is "CONNECT" (map)
// Get access from our redux store
import { useSelector, useDispatch } from "react-redux";
//Redux Actions
import * as cartActions from "../../store/actions/cart";
import * as ordersActions from "../../store/actions/orders";

//Components
import CartItem from "../../components/shop/CartItem";
import Card from "../../components/UI/Card";

const CartScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);

  const cartTotalAmount = useSelector((state) => state.cartReducer.totalAmount);
  const cartItems = useSelector((state) => {
    const transformedCartItems = [];
    for (const key in state.cartReducer.items) {
      transformedCartItems.push({
        productId: key,
        productTitle: state.cartReducer.items[key].productTitle,
        productPrice: state.cartReducer.items[key].productPrice,
        quantity: state.cartReducer.items[key].quantity,
        sum: state.cartReducer.items[key].sum,
      });
    }
    return transformedCartItems.sort((a, b) =>
      a.productId > b.productId ? 1 : -1
    );
  });

  //Redux Dispatch
  const dispatch = useDispatch();

  const sendOrderHandler = async () => {
    setIsLoading(true);
    await dispatch(ordersActions.addOrder(cartItems, cartTotalAmount));
    setIsLoading(false);
  };

  return (
    <View style={styles.screen}>
      <Card style={styles.summary}>
        <Text style={styles.summaryText}>
          Total:
          <Text style={styles.amount}>
            ${(Math.round(cartTotalAmount.toFixed(2)) * 100) / 100}
          </Text>
        </Text>
        {isLoading ? (
          <ActivityIndicator size="small" color={Colors.primary} />
        ) : (
          <Button
            color={Colors.accent}
            title="Order Now"
            disabled={cartItems.length === 0}
            onPress={sendOrderHandler}
          />
        )}
      </Card>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.productId}
        renderItem={(itemData) => (
          <CartItem
            quantity={itemData.item.quantity}
            title={itemData.item.productTitle}
            amount={itemData.item.sum}
            deletable
            onRemove={() => {
              dispatch(cartActions.removeFromCart(itemData.item.productId));
            }}
          />
        )}
      />
    </View>
  );
};

CartScreen.navigationOptions = {
  headerTitle: "Your Cart",
};

const styles = StyleSheet.create({
  screen: {
    margin: 20,
  },
  summary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    padding: 10,
  },
  summaryText: {
    fontFamily: "open-sans-bold",
    fontSize: 18,
  },
  amount: {
    color: Colors.primary,
  },
});

export default CartScreen;
