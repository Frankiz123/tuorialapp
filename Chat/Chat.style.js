// CODE ADDED BY UDDIPAN
const ChatStyle = {
  container: {
    flex: 1
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    backgroundColor: "#0e0e0e",
    paddingVertical: 7
  },
  headerLeft: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    flex: 1
  },
  headerTitleText: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#fff"
  },

  msgFrom: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: "#f000",
    padding: 10
  },
  msgProfileImg: {
    width: 30,
    height: 30,
    borderRadius: 50
  },
  msgFromWrapper: {
    width: "70%",
    position: "relative",
    marginHorizontal: 7
  },
  msgFromWrapperMain: {
    backgroundColor: "#333939",
    borderRadius: 15,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 20,
    overflow: "hidden"
  },
  msgFromText: {
    color: "#fff",
    lineHeight: 20,
    letterSpacing: 0.3,
    fontSize: 14,
    padding: 10,
    paddingLeft: 15,
    paddingBottom: 20
  },
  msgFromBottom1View: {
    width: 20,
    height: 20,
    backgroundColor: "#000",
    transform: [{ rotate: "45deg" }],
    position: "absolute",
    bottom: -15,
    left: -1,
    borderRadius: 10
  },
  msgFromBottom2View: {
    width: "110%",
    height: 20,
    backgroundColor: "#000",
    position: "absolute",
    bottom: -15,
    left: 5,
    borderRadius: 10
  },
  msgFromImage: {
    width: "100%",
    height: 200
  },

  msgTo: {
    display: "flex",
    flexDirection: "row-reverse",
    alignItems: "flex-end",
    backgroundColor: "#f000",
    padding: 10
  },
  msgFromWrapperMainReversed: {
    backgroundColor: "#F1C411",
    borderRadius: 15,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 20,
    overflow: "hidden"
  },
  msgFromTextReversed: {
    color: "#222",
    lineHeight: 20,
    letterSpacing: 0.3,
    fontSize: 14,
    padding: 10,
    paddingLeft: 15,
    paddingBottom: 20
  },
  msgFromBottom1ViewReversed: {
    width: 20,
    height: 20,
    backgroundColor: "#000",
    transform: [{ rotate: "45deg" }],
    position: "absolute",
    bottom: -15,
    right: -1,
    borderRadius: 10
  },
  msgFromBottom2ViewReversed: {
    width: "110%",
    height: 20,
    backgroundColor: "#000",
    position: "absolute",
    bottom: -15,
    right: 5,
    borderRadius: 10
  },

  commentBox: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    backgroundColor: "#0e0e0e",
    paddingVertical: 15
  },
  commentBoxInput: {
    flex: 1,
    height: 35,
    padding: 0,
    fontWeight: "bold",
    color: "#fff",
    paddingHorizontal: 10
  },
  commentArea: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: "#333939",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30
  },
  commentBoxBtn: {
    width: 40,
    height: 30,
    backgroundColor: "#fff0",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },

  //
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0009"
  },
  modalView: {
    margin: 15,
    backgroundColor: "#333939",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#333939",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "85%",
    maxHeight: "90%"
  },
  button: {
    borderRadius: 20,
    padding: 7,
    paddingHorizontal: 10,
    elevation: 2,
    backgroundColor: "#000",
    width: "100%"
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  modalHeader: {
    fontSize: 22,
    marginBottom: 15,
    fontWeight: "bold",
    color: "#F1C411"
  },
  inputWrapper: {
    marginBottom: 15,
    marginTop: 10,
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "flex-start"
  },
  inputLable: {
    color: "#fff",
    fontSize: 12,
    marginBottom: 5
  },
  input: {
    width: "100%",
    padding: 0,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#fff",
    borderRadius: 7,
    elevation: 3,
    color: "#222"
  },
  inputArea: {
    width: "100%",
    height: 70,
    padding: 0,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#fff",
    borderRadius: 7,
    elevation: 3,
    color: "#222",
    textAlignVertical: "top"
  },
  AddinputWrapper: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 7
  },
  modalBtn: {
    width: "100%",
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#F1C411",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    elevation: 3
  },
  modalBtnText: {
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 0.3,
    paddingLeft: 10,
    color: "#fff"
  },
  //

  msgCustomPackage: {
    backgroundColor: "#DFBD69",
    width: "90%",
    marginVertical: 15,
    marginLeft: "5%",
    padding: 10,
    borderRadius: 10,
    elevation: 5
  },
  msgCustomPackageTop: {
    borderBottomWidth: 1,
    borderColor: "#0002",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexDirection: "row",
    paddingBottom: 10
  },
  msgCustomPackageName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222",
    letterSpacing: 0.5
  },
  msgExtraHeading: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#222",
    letterSpacing: 0.5
  },
  msgCustomPackageTier: {
    fontSize: 14,
    color: "#222",
    letterSpacing: 0.5,
    textTransform: "uppercase"
  },
  msgCustomePackagePrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222",
    letterSpacing: 0.5
  },
  msgCustomePackageText: {
    fontSize: 14,
    color: "#222",
    letterSpacing: 0.5,
    marginVertical: 2
  },
  msgCustomPackageMiddle: {
    borderBottomWidth: 1,
    borderColor: "#0002",
    paddingBottom: 10
  },
  msgCustomPackageBottom: {
    paddingVertical: 10,
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    flexDirection: "row"
  },
  msgCustomePackageBtn: {
    paddingHorizontal: 15,
    paddingVertical: 7,
    borderRadius: 5
  },

  msgCustomePackageBtnText: {
    fontSize: 14,
    color: "#2228",
    letterSpacing: 0.5
  }
};

export default ChatStyle;
