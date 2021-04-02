export const ADD_ORDER = "ADD_ORDER";
export const SET_ORDERS = "SET_ORDERS";

import Order from "../../models/order";

export const fetchOrders = () => {
  return async (dispatch, getState) => {
    const userId = getState().authReducer.userId;
    try {
      const response = await fetch(
        `https://rn-complete-guide-2310a-default-rtdb.firebaseio.com/orders/${userId}.json`
      );

      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

      const resData = await response.json();
      const laodedOrders = [];

      for (const key in resData) {
        laodedOrders.push(
          new Order(
            key,
            resData[key].cartItems,
            resData[key].totalAmount,
            new Date(resData[key].date)
          )
        );
      }
      dispatch({ type: SET_ORDERS, orders: laodedOrders });
    } catch (err) {
      throw err;
    }
  };
};

export const addOrder = (cartItems, totalAmount) => {
  return async (dispatch, getState) => {
    const token = getState().authReducer.token;
    const userId = getState().authReducer.userId;
    const date = new Date();
    const response = await fetch(
      `https://rn-complete-guide-2310a-default-rtdb.firebaseio.com/orders/${userId}.json?auth=${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cartItems,
          totalAmount,
          date: date.toISOString(),
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Something went wrong!");
    }

    const resData = await response.json();

    dispatch({
      type: ADD_ORDER,
      orderData: {
        id: resData.name,
        item: cartItems,
        amount: totalAmount,
        date: date,
      },
    });
  };
};
