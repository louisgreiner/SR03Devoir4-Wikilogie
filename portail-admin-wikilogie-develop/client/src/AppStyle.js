import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles((theme) => ({
  listHeader: {
    padding: theme.spacing(0, 0, 2, 8)
  },
  btn: {
    backgroundColor: "#6A2CD8",
    "&:hover": {
      background: "#a15dff"
    },
    textTransform: "none",
    marginTop: 20,
    borderRadius: 32,
    position: "relative",
    right: theme.spacing(-5),
    padding: theme.spacing(1, 3)
  },
  customerList: {
    height: 350,
    width: 950,
    textAlign: "center"
  }
}));
export { useStyles };
