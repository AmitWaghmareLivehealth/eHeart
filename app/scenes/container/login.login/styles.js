import { StyleSheet } from "react-native";
import { Global, Color } from "../../../utils";

import nameStyles from "../login.signup.name/styles";

export const imageWidth = Global.screenWidth * 0.75;
export const imageHeight = imageWidth * 0.18 * 2.5;
export const imageHeightSmall = imageWidth * 0.18 * 1;

const styles = StyleSheet.create({
  imageContainer: {
    flex: 0.6,
    flexGrow: 1.5,
    flexShrink: 0.5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    resizeMode: "contain",
    alignSelf: "center",
    margin: 36
  },
  textFieldContainer: {
    flexDirection: "row",
    marginTop: 28,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    alignSelf: "center",
    width: Global.screenWidth * 0.9
  },
  buttonContainer: {
    flex: 0,
    justifyContent: "flex-end",
    alignContent: "flex-end"
  },
  textChangeCountryCode: {
    textAlign: "right"
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white"
  },
  logo: {
    height: imageHeight,
    width: Global.screenWidth - 50,
    // aspectRatio: 3.59,
    resizeMode: "contain",
    marginBottom: 60,
    marginTop: -20
  }
});

styles.btnProceed = nameStyles.btnProceed;

export default styles;
