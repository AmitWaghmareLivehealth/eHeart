import { StyleSheet } from "react-native";
import { Global } from "../../../utils";

var imageWidth = Global.screenWidth * (3 / 4);
var imageHeight = imageWidth * (173 / 612);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    width: Global.screenWidth,
    height: Global.screenHeight,
    backgroundColor: "white"
  },
  webviewContainer: {
    flex: 0.5,
    flexShrink: 0.5,
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  buttonContainer: {
    flex: 0.5,
    flexGrow: 5,
    flexShrink: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    alignContent: "flex-end"
  },
  webview: {
    flex: 1,
    flexShrink: 1,
    flexGrow: 4,
    aspectRatio: 1,
    marginTop: 30
  },
  imageStyle: {
    flex: 1,
    flexGrow: 1,
    flexShrink: 1,
    resizeMode: "contain",
    width: Global.screenWidth - 50,
    margin: 44,
    marginBottom: 0,
    padding: 30
  },
  titleLable: {
    fontSize: 17,
    marginBottom: 8,
    marginTop: 16,
    color: "black"
  },
  descLabel: {
    fontSize: 13,
    marginLeft: 16,
    marginRight: 16,
    color: "#555555",
    textAlign: "center"
  }
});

export default styles;
