import React from "react";
import Spinner from "react-native-loading-spinner-overlay";

const MyLoader = ({ loading, color }) => {
  return <Spinner visible={loading} color={color} animation="fade" />;
};
export default MyLoader;
