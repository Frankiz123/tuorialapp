// CODE ADDED BY UDDIPAN
const MessagesStyle = {
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
    paddingVertical: 15
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

  searchWrapper: {
    padding: 10,
    paddingHorizontal: 15,
    width: "100%",
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: "#000",
    backgroundColor: "#000"
  },
  search: {
    backgroundColor: "#333939",
    borderRadius: 10,
    paddingLeft: 10,
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    height: 35
  },
  searchIcon: {
    marginRight: 5
  },
  searchInput: {
    flex: 1,
    height: 35,
    padding: 0,
    color: "#fff",
    paddingHorizontal: 10
  },

  item: {
    padding: 10,
    paddingHorizontal: 15,
    width: "100%",
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: "#111",
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row"
  },
  itemImageWrapper: {
    width: 50,
    height: 50,
    overflow: "hidden",
    marginRight: 15,
    position: "relative"
  },
  itemIamge: {
    width: "100%",
    height: "100%",
    borderRadius: 100
  },
  itemActive: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 50,
    backgroundColor: "#aaa",
    borderWidth: 2,
    borderColor: "#fff"
  },
  itemName: {
    flex: 1
  },
  itemNameText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff"
  },
  itemMsgText: {
    fontSize: 12,
    // fontWeight: "bold",
    color: "#aaa"
  },
  itemActiveMsgs: {
    paddingHorizontal: 5,
    paddingVertical: 2,
    backgroundColor: "#F1C411",
    borderRadius: 150,
    marginTop: 25,
    width: 30
  },
  itemActiveMsgsText: {
    color: "#fff",
    fontSize: 10,
    textAlign: "center"
  }
};

export default MessagesStyle;
// CODE ADDED BY UDDIPAN
