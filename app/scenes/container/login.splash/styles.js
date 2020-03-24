import { StyleSheet } from "react-native";

import { Global } from "../../../utils";

module.exports = StyleSheet.create({
  containerMain: {
    flex: 1,
    padding: 32,
    justifyContent: "center",
    backgroundColor: "white",
    alignContent: "center"
  },
  imageLivehealthLogo: {
    resizeMode: "contain",
    width: Global.screenWidth - 50,
    margin: 16,
    padding: 16,
    alignSelf: "center"
  }
});
