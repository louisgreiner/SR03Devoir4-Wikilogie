import React from 'react';
import { Button, Grid } from "@material-ui/core";
import { DataGrid } from '@material-ui/data-grid';
import axios from 'axios';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import Dialog from "@material-ui/core/Dialog";
import { withStyles } from '@material-ui/core/styles';
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import FormLabel from '@material-ui/core/FormLabel';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import './table.css';

const styles = theme => ({
  root: {
    backgroundColor: "#bbbbbb",
    color: "#ffffff"
  },
  listHeader: {
    padding: theme.spacing(0, 0, 2, 8)
  },
  btn: {
    backgroundColor: "primary",
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
});

class Follows extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: [],
      selected: [],
      users: [],

      openAdd : false,
      newLogin : "",
      newFollowing : "",

      openDelete : false,
      deleteLogin: "",
      deleteFollowing: "",

      openDeleteAll : false
    };
  }

  // Charge le contenu des tables dans le state une première fois au chargement de la page
  componentDidMount() {
    axios("http://localhost:3001/operations?tableName=follows")
      .then(res => res.data)
      .then(data => {
        for(var i = 0; i < data.length; i++){
          data[i].id = i;
        }
        this.setState({
          isLoaded: true,
          items: data,
        });
      },
      (error) => {
        this.setState({
          isLoaded: true,
          error
        });
      });
      axios("http://localhost:3001/operations?tableName=users")
      .then(res => res.data)
      .then(data => {
        this.setState({
          users : data,
        });
      });
  }

  // Rafraichit les données de notre tableau après chaque action (insert, update, delete)
  async refreshRows() {
    await axios("http://localhost:3001/operations?tableName=follows")
    .then(res => res.data)
    .then(data => {
      for(var i = 0; i < data.length; i++){
        data[i].id = i;
      }
      this.setState({
        items: data,
      });
    });
  }

  // Ouverture d'un formulaire d'ajout pop-up
  handleClickOpenAdd() {
    this.setState({
      openAdd: true,
    });
  };

  // Ferme le formulaire d'ajout pop-up
  handleCloseAdd() {
    this.setState({
      openAdd: false,
    });
  };

  // Envoie la requête d'ajout au serveur et actualise les données de la page
  handleSubmitAdd() {
    const requestOptionsInsert = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Methods':'GET, POST, PUT, OPTIONS' 
      },
      tableName: "follows", 
      columnNames: "",
      values: ["'" + this.state.newLogin + "'", "'" + this.state.newFollowing + "'"]
    };

    (async () => {
      await Promise.all([
        axios.post("http://localhost:3001/operations",requestOptionsInsert)
        .then(this.showToast("~ Insert ~ </br>=> Login = "+this.state.newLogin+
                            ", Following = "+this.state.newFollowing+" <="
        ))      
      ]);
      this.refreshRows()
    })();

    this.setState({
      newLogin : "",
      newFollowing : "",
    });
  };

  // Ouverture d'un formulaire de suppression pop-up
  handleClickOpenDelete() {
    this.setState({
      openDelete: true,
    });
  };

  // Ferme le formulaire de suppression pop-up
  handleCloseDelete() {
    this.setState({
      openDelete: false,
    });
  };

  // Envoie la requête de suppression au serveur et actualise les données de la page
  handleSubmitDelete() {
    const requestOptionsDelete = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      data: {
        tableName: "follows f", 
        whereConditions: "f.login='"+this.state.deleteLogin+"' AND f.following='"+this.state.deleteFollowing+"'"
      }
    };

    (async () => {
      await Promise.all([
        axios.delete("http://localhost:3001/operations",requestOptionsDelete)
        .then(this.showToast("~ Delete ~ </br>Login = "+this.state.deleteLogin+
                            ", Following = "+this.state.deleteFollowing+" <="
        ))
      ]);
      this.refreshRows();
    })();
  };

  // Ouverture d'un formulaire de suppression pop-up
  handleClickOpenDeleteAll() {
    this.setState({
      openDeleteAll: true,
    });
  };

  // Ferme le formulaire de suppression pop-up
  handleCloseDeleteAll() {
    this.setState({
      openDeleteAll: false,
    });
  };

  // Supprime toutes les lignes sélectionnées
  handleSubmitDeleteAll(){
    var request = "";
    for(var i = 0; i < this.state.selected.length - 1; i++){
      request += "(f.login='" + this.state.items[this.state.selected[i]].login + "' AND f.following='" + this.state.items[this.state.selected[i]].following + "') OR ";
    }
    request += "(f.login='" + this.state.items[this.state.selected[this.state.selected.length - 1]].login + "' AND f.following='" + this.state.items[this.state.selected[this.state.selected.length - 1]].following + "')";

    const requestOptionsDelete = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      data: {
        tableName: 'follows f', 
        whereConditions: request
      }
    };

    (async () => {
      await Promise.all([
        axios.delete("http://localhost:3001/operations",requestOptionsDelete)
        .then(this.showToast("~ Delete all ~ </br>Follows = "+this.state.selected+ "<="
        ))
      ])
      this.refreshRows();
    })();

    this.setState({ // remet à zéro la liste des éléments selectionnés
      selected: [],
      openDeleteAll: false
    });

      // numéro des balises à changer si ajout balises dans le front
      // document.getElementsByTagName('span')[7].setAttribute("class","MuiButtonBase-root MuiIconButton-root PrivateSwitchBase-root-4 MuiCheckbox-root MuiCheckbox-colorPrimary MuiDataGrid-checkboxInput MuiIconButton-colorPrimary");
      // document.getElementsByTagName('input')[0].setAttribute("data-indeterminate","false");
      // document.getElementsByTagName('path')[1].setAttribute("d","M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z");
  }

  // Display le bouton Supprimer tous les champs sélectionnés si au moins un champ est sélectionné
  displayDeleteAll = () => {
    if(this.state.selected.length === 0){
        return true;
    }
    else{
        return false;
    }
  }

  // met à jour la liste des lignes sélectionnées
  handleRowSelection = (params) => {
    this.setState({
      selected: params.selectionModel
    });
  }

  showToast(text){
    document.getElementById("toast").classList.add("show");
    document.getElementById("toast").innerHTML=text;
    setTimeout(function(){
      document.getElementById("toast").classList.remove("show");
    },5000);
  }
  
  render() {
    const { error, isLoaded, items } = this.state;
    const { classes } = this.props;

    if (error) {
      return <div>Erreur : {error.message}</div>;
    } else if (!isLoaded) {
      return <div><CircularProgress />Chargement…</div>;
    } else {
      return (
        <div className="center-div">
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width"
          />

          {/* Bouton ajout */}
          <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
            className={classes.listHeader}
          >
            <Grid item md={8}></Grid>
            <Grid item md={4}>
              <Button
                className={classes.btn}
                onClick = {(e) => {e.preventDefault(); this.handleClickOpenAdd()}}
                variant="contained"
                color="primary"
                type="submit"
                startIcon={<GroupAddIcon/>} // TODO changer icone
              >
                Nouveau follow
              </Button>
              <Dialog
                disableBackdropClick
                open={this.state.openAdd}
                onClose = {(e) => {e.preventDefault(); this.handleCloseAdd()}}
                aria-labelledby="form-dialog-title"
              >
                <DialogTitle id="form-dialog-title">Ajout follow</DialogTitle>
                <form noValidate onSubmit={(e) => {e.preventDefault(); this.handleSubmitAdd()}}>
                  <DialogContent>

                    <InputLabel style={{width: "90%"}}>Login</InputLabel>
                    <Select
                      id="demo-simple-select"
                      value={this.state.newLogin}
                      onChange={(event) => {
                        event.preventDefault();
                        this.setState({
                          newLogin : event.target.value,
                        })
                      }}
                      style={{width: "90%"}}
                    >
                      {this.state.users.map((user) =>
                        <MenuItem value={user.login}>{user.login}</MenuItem>
                      )}
                    </Select>

                    <InputLabel style={{width: "90%"}}>Following</InputLabel>
                    <Select
                      id="demo-simple-select"
                      value={this.state.newFollowing}
                      onChange={(event) => {
                        event.preventDefault();
                        this.setState({
                          newFollowing : event.target.value,
                        })
                      }}
                      style={{width: "90%"}}
                    >
                      {this.state.users.map((user) =>
                        <MenuItem value={user.login}>{user.login}</MenuItem>
                      )}
                    </Select>

                  </DialogContent>
                  <DialogActions>
                    <Button onClick={(e) => {e.preventDefault(); this.handleCloseAdd()}} color="primary">
                      Annuler
                    </Button>
                    <Button onClick={(e) => {e.preventDefault(); this.handleSubmitAdd(); this.handleCloseAdd()}} color="primary" type="submit">
                      Ajouter
                    </Button>
                  </DialogActions>
                </form>
              </Dialog>
            </Grid>
          </Grid>

          {/* Bouton supprimer */}
          <Dialog
            disableBackdropClick
            open={this.state.openDelete}
            onClose = {(e) => {e.preventDefault(); this.handleClosedDelete()}}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title">Suppression following</DialogTitle>
            <form noValidate onSubmit={(e) => {e.preventDefault(); this.handleSubmitDelete()}}>
              <DialogContent>
                <FormLabel fullwidth="true" component="legend">
                  Êtes-vous sûr de vouloir supprimer le following ({this.state.deleteLogin}, {this.state.deleteFollowing}) ? Cette opération est irréversible... 
                </FormLabel>
              </DialogContent>
              <DialogActions>
                <Button onClick={(e) => {e.preventDefault(); this.handleCloseDelete()}} color="primary">
                  Annuler
                </Button>
                <Button onClick={(e) => {e.preventDefault(); this.handleSubmitDelete(); this.handleCloseDelete()}} color="primary" type="submit">
                  Confirmer
                </Button>
              </DialogActions>
            </form>
          </Dialog>

          {/* Bouton supprimer toute la sélection */}
          <Grid
            container
            direction="row"
            justify="center"
            alignItems="center"
            className={classes.listHeader}
          >
            <Grid item md={8}></Grid>
            <Grid item md={4}>
              <Button
                className={classes.btn}
                onClick = {(e) => {e.preventDefault(); this.handleClickOpenDeleteAll()}}
                variant="contained"
                color="primary"
                type="submit"
                startIcon={<DeleteForeverIcon />}
                disabled={this.state.selected.length===0 }

              >
                Supprimer toute la sélection
              </Button>
              <Dialog
                disableBackdropClick
                open={this.state.openDeleteAll}
                onClose = {(e) => {e.preventDefault(); this.handleCloseDeleteAll()}}
                aria-labelledby="form-dialog-title"
              >
                <DialogTitle id="form-dialog-title">Suppression des champs sélectionnés</DialogTitle>
                <form noValidate onSubmit={(e) => {e.preventDefault(); this.handleSubmitDeleteAll()}}>
                  <DialogContent>
                    <FormLabel fullwidth="true" component="legend">
                      Êtes-vous sûr de vouloir supprimer les followings - {this.state.selected.map((item) => "("+this.state.items[item].login+ ", "+ this.state.items[item].following + ") - ")} ? Cette opération est irréversible... 
                    </FormLabel>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={(e) => {e.preventDefault(); this.handleCloseDeleteAll()}} color="primary">
                      Annuler
                    </Button>
                    <Button onClick={(e) => {e.preventDefault(); this.handleSubmitDeleteAll(); this.handleCloseDeleteAll()}} color="primary" type="submit">
                      Confirmer
                    </Button>
                  </DialogActions>
                </form>
              </Dialog>
            </Grid>
          </Grid>

          {/* Affichage à cette balise d'un feedback pour l'admin après chaque action (insert, update, delete) */}
          <div id="toast"></div> 

          {/* Affichage tableau */}
          <div style={{ height: 500, width: '100%' }}>
            <DataGrid 
              rows={items} 
              columns= {
                [
                  { field: 'login', headerName: 'Login', width: 250,
                  renderHeader: (params) => (
                    <div style={{fontWeight:'800'}}>Login</div>
                  )},
                  { field: 'following', headerName: 'Utilisateur suivi', width: 400,
                  renderHeader: (params) => (
                    <div style={{fontWeight:'800'}}>Utilisateur suivi</div>
                  )},
                  { field: 'actions', headerName:'Actions', width: 200, renderCell: (params) => (
                    <strong>
                      {/* Bouton supprimer la ligne */}
                      <IconButton
                        variant="contained"
                        color="primary"
                        size="small"
                        style={{ marginLeft: 16 }}
                        onClick={() => { 
                          this.setState({
                            deleteLogin : params.row.login,
                            deleteFollowing : params.row.following
                          });
                          this.handleClickOpenDelete();
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </strong>
                  )}
                ]
              }
              autoHeight
              sortModel={[{ field: 'login', sort: 'asc' }]}
              checkboxSelection
              onSelectionModelChange={(params) => this.handleRowSelection(params)}
              disableSelectionOnClick
              selectionModel={this.state.selected}
            />
          </div>

        </div>        
      );
    }
  }
}

export default withStyles(styles)(Follows);
