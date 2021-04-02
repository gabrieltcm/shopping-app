import React, { useState } from "react";

//Redux Devtool Extension
import { composeWithDevTools } from "redux-devtools-extension";

//App Loading
import AppLoading from "expo-app-loading"; // This will prolong the splash screen when the app starts and all our assets/components are loaded completely

//Imported Fonts
import * as Font from "expo-font";

//REDUX
import { createStore, combineReducers, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import ReduxThunk from "redux-thunk";

//Reducers
import productsReducer from "./store/reducers/products";
import cartReducer from "./store/reducers/cart";
import ordersReducer from "./store/reducers/orders";
import authReducer from "./store/reducers/auth";

//React Navigator
import NavigationContainer from "./navigation/NavigationContainer";

//Combined Reducers
const rootReducer = combineReducers({
  productsReducer: productsReducer,
  cartReducer: cartReducer,
  ordersReducer: ordersReducer,
  authReducer: authReducer,
});

//Redux Store
const store = createStore(
  rootReducer,
  applyMiddleware(ReduxThunk),
  composeWithDevTools()
);

//Fetch Custom Fonts
const fetchFonts = () => {
  return Font.loadAsync({
    "open-sans": require("./assets/fonts/OpenSans-Regular.ttf"),
    "open-sans-bold": require("./assets/fonts/OpenSans-Bold.ttf"),
  });
};

export default function App() {
  //States
  const [fontLoaded, setFontLoaded] = useState(false);

  //This make sure that the splash screen is open until our fonts are loaded
  if (!fontLoaded) {
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => setFontLoaded(true)}
        onError={(err) => console.log(err)}
      />
    );
  }

  return (
    <Provider store={store}>
      <NavigationContainer />
    </Provider>
  );
}
