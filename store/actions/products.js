//Product Model
import Product from "../../models/product";

export const DELETE_PRODUCT = "DELETE_PRODUCT";
export const CREATE_PRODUCT = "CREATE_PRODUCT";
export const UPDATE_PRODUCT = "UPDATE_PRODUCT";
export const SET_PRODUCTS = "SET_PRODUCTS";

export const fetchProducts = () => {
  return async (dispatch, getState) => {
    const userId = getState().authReducer.userId;
    try {
      const response = await fetch(
        "https://rn-complete-guide-2310a-default-rtdb.firebaseio.com/products.json"
      );

      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

      const resData = await response.json();
      const laodedProducts = [];

      for (const key in resData) {
        laodedProducts.push(
          new Product(
            key,
            resData[key].ownerId,
            resData[key].title,
            resData[key].imageUrl,
            resData[key].description,
            resData[key].price
          )
        );
      }
      dispatch({
        type: SET_PRODUCTS,
        products: laodedProducts,
        userProducts: laodedProducts.filter((prod) => prod.ownerId === userId),
      });
    } catch (err) {
      throw err;
    }
  };
};

export const deleteProduct = (productId) => {
  return async (dispatch, getState) => {
    const token = getState().authReducer.token;
    const response = await fetch(
      `https://rn-complete-guide-2310a-default-rtdb.firebaseio.com/products/${productId}.json?auth=${token}`,
      {
        method: "DELETE",
      }
    );
    if (!response.ok) {
      throw new Error("Something went wrong!");
    }
    dispatch({
      type: DELETE_PRODUCT,
      pid: productId,
    });
  };
};

export const createProduct = (title, description, imageUrl, price) => {
  return async (dispatch, getState) => {
    // async codes will break ur REDUX actions
    // But now with REDUX THUNK setup in App.js, that handles ASYNC CODES in REDUX
    const token = getState().authReducer.token;
    const userId = getState().authReducer.userId;
    const response = await fetch(
      `https://rn-complete-guide-2310a-default-rtdb.firebaseio.com/products.json?auth=${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title,
          description: description,
          imageUrl: imageUrl,
          price: price,
          ownerId: userId,
        }),
      }
    );
    const resData = await response.json();

    dispatch({
      type: CREATE_PRODUCT,
      productData: {
        //from the API
        //pass the data to reducer
        id: resData.name,
        title: title,
        description: description,
        imageUrl: imageUrl,
        price: price,
        ownerId: userId,
      },
    });
  };
};

export const updateProduct = (id, title, description, imageUrl) => {
  //getState gets us access to the the Redux store, thanks to Redux Thunk
  //For here in this case, we are accesing auth reducer >> initialState >> token
  return async (dispatch, getState) => {
    // console.log(getState());
    const token = getState().authReducer.token;
    const response = await fetch(
      `https://rn-complete-guide-2310a-default-rtdb.firebaseio.com/products/${id}.json?auth=${token}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          imageUrl,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Something went wrong!");
    }

    dispatch({
      type: UPDATE_PRODUCT,
      pid: id,
      productData: {
        title,
        description,
        imageUrl,
      },
    });
  };
};
