import React from 'react';
import { Button, Grid } from "@material-ui/core";
import { DataGrid } from '@material-ui/data-grid';
import axios from 'axios';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import { withStyles } from '@material-ui/core/styles';
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import MailIcon from '@material-ui/icons/Mail';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import FormLabel from '@material-ui/core/FormLabel';
import './table.css';

const styles = theme => ({
  root: {
    backgroundColor: "#bbbbbb",
    color: "#ffffff"
  },
  btn: {
    backgroundColor: "primary",
    "&:hover": {
      color:"#ffffff"
    },
    textTransform: "none",
    marginTop: 20,
    borderRadius: 32,
    position: "relative",
    right: theme.spacing(-5),
    padding: theme.spacing(1, 3)
  },
});

class Users extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: [],
      selected: [],

      openAdd : false,
      newLogin : "",
      newPassword : "",
      newEmail : "",
      newScore : 0,
      newEmailConfirmed : false,
      newIsAdmin : false,

      openEdit : false,
      isEdited : false,
      editID : 0,
      editEmail : "",
      editScore : 0,
      editEmailConfirmed : "no",
      emailEdited : false,
      editIsAdmin : "no",
      tempEditEmailConfirmed : "",

      openDelete : false,
      deleteID: 0,

      openDeleteAll : false
    };
  }

  // Charge le contenu des tables dans le state une première fois au chargement de la page
  componentDidMount() {
    axios("http://localhost:3001/operations?tableName=users")
      .then(res => res.data)
      .then(data => {
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
      })
  }

  // Rafraichit les données de notre tableau après chaque action (insert, update, delete)
  async refreshRows() {
    await axios("http://localhost:3001/operations?tableName=users")
    .then(res => res.data)
    .then(data => {
      this.setState({
        items: data,
      });
    });
  }
  
  validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
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
      tableName: 'users', 
      columnNames: ['login','password','email','score','email_confirmed','is_admin'],
      values: ["'" + this.state.newLogin + "'", "'" + this.state.newPassword + "'", "'" + this.state.newEmail + "'","'" + this.state.newScore + "'",0,0]
    };

    (async () => {
      await Promise.all([
        axios.post("http://localhost:3001/operations",requestOptionsInsert)
        .then(this.showToast("~ Insert ~ </br>=> Login = "+this.state.newLogin+
                            ", Email = "+this.state.newEmail+ " <="
        ))      
      ]);
      this.refreshRows()
    })();

    this.setState({
      newLogin : "",
      newPassword : "",
      newEmail : "",
      newScore : 0,
      newEmailConfirmed : false,
      newIsAdmin : false
    });
  };

  // Ouverture d'un formulaire de modification pop-up
  handleClickOpenEdit() {
    this.setState({
      openEdit: true,
    });
  };

  // Ferme le formulaire de modification pop-up
  handleCloseEdit() {
    this.setState({
      openEdit: false,
    });
  };

  // Envoie la requête de modification au serveur et actualise les données de la page
  handleSubmitEdit() {
    if (!this.state.isEdited) 
      return

    var emailConfirmed = 0; 
    if (this.state.editEmailConfirmed === "yes"){
      emailConfirmed = 1;
    }
    var isAdmin = 0; 
    if (this.state.editIsAdmin === "yes"){
      isAdmin = 1;
    } 
  
    const requestOptionsUpdate = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Methods':'GET, POST, PUT, OPTIONS' },
      tableName: "users", 
      setStatement: "email='"+this.state.editEmail+"', score="+this.state.editScore+", email_confirmed=" + emailConfirmed +", is_admin=" + isAdmin,
      whereConditions: "id='"+this.state.editID+"'",
    };

    (async () => {
      await Promise.all([
        axios.put("http://localhost:3001/operations",requestOptionsUpdate)
        .then(this.showToast("~ Modify ~ </br>=> User ID = "+this.state.editID+
                            "</br> Modification => Email='" + this.state.editEmail + 
                            ", Score = "+this.state.editScore+ 
                            ", Email confirmé = "+this.state.emailConfirmed+
                            ", Admin = "+this.state.isAdmin+ " <="
        ))      
      ]);
      this.refreshRows()
    })();

    this.setState({
      isEdited : false,
      editID : 0,
      editEmail : "",
      editScore : 0,
      editEmailConfirmed : "no",
      editIsAdmin : "no"
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
        tableName: 'users', 
        whereConditions: "id='"+this.state.deleteID+"'"
      }
    };

    (async () => {
      await Promise.all([
        axios.delete("http://localhost:3001/operations",requestOptionsDelete)
        .then(this.showToast("~ Delete ~ </br>User ID = "+this.state.deleteID+" <="
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
      request += "id=" + this.state.selected[i] + " OR "
    }
    request += "id=" + this.state.selected[this.state.selected.length - 1];

    const requestOptionsDelete = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      data: {
        tableName: 'users', 
        whereConditions: request
      }
    };

    (async () => {
      await Promise.all([
        axios.delete("http://localhost:3001/operations",requestOptionsDelete)
        .then(this.showToast("~ Delete all ~ </br>User ids = "+this.state.selected+ "<="
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
                startIcon={<PersonAddIcon/>}
              >
                Nouvel utilisateur
              </Button>
              <Dialog
                disableBackdropClick
                open={this.state.openAdd}
                onClose = {(e) => {e.preventDefault(); this.handleCloseAdd()}}
                aria-labelledby="form-dialog-title"
              >
                <DialogTitle id="form-dialog-title">Ajout utilisateur</DialogTitle>
                <form noValidate onSubmit={(e) => {e.preventDefault(); this.handleSubmitAdd()}}>
                  <DialogContent>
                    <TextField
                      value={this.state.newLogin}
                      onChange={(event) => {
                        event.preventDefault();
                        this.setState({
                          newLogin : event.target.value,
                        })
                      }}
                      autoFocus
                      margin="dense"
                      id="login"
                      label="Login"
                      type="text"
                      fullwidth="true"
                      style={{width: "90%"}}
                    />
                    <TextField
                      value={this.state.newPassword}
                      onChange={(event) => {
                        event.preventDefault();
                        this.setState({
                          newPassword : event.target.value,
                        })
                      }}
                      margin="dense"
                      id="password"
                      label="Mot de Passe"
                      type="password"
                      fullwidth="true"
                      style={{width: "90%"}}
                    />
                    <TextField
                      value={this.state.newEmail}
                      onChange={(event) => {
                        event.preventDefault();
                        this.setState({
                          emailEdited : true,
                          newEmail : event.target.value,
                        })
                      }}
                      helperText={this.validateEmail(this.state.newEmail) ? "" : "Adresse email invalide..."}
                      error={!(this.validateEmail(this.state.newEmail)) && this.state.emailEdited}
                      margin="dense"
                      id="email"
                      label="Adresse Email"
                      type="email"
                      fullwidth="true"
                      style={{width: "90%"}}
                    />
                    <TextField
                      value={this.state.newScore}
                      onChange={(event) => {
                        event.preventDefault();
                        this.setState({
                          newScore : event.target.value,
                        })
                      }}
                      helperText={this.state.newScore >= 0 ? "" : "Score invalide..."}
                      error={!(this.state.newScore >= 0)}
                      margin="dense"
                      id="score"
                      label="Score"
                      type="number"
                      fullwidth="true"
                      style={{width: "90%"}}
                    />
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

          {/* Bouton modifier */}
          <Dialog
            disableBackdropClick
            open={this.state.openEdit}
            onClose = {(e) => {e.preventDefault(); this.handleCloseEdit()}}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title">Modifier utilisateur</DialogTitle>
            <form noValidate onSubmit={(e) => {e.preventDefault(); this.handleSubmitEdit()}}>
              <DialogContent>
                <TextField
                  helperText={this.validateEmail(this.state.editEmail) ? "" : "Adresse email invalide..."}
                  error={!(this.validateEmail(this.state.editEmail))}

                  value={this.state.editEmail}
                  onChange={(event) => {
                    event.preventDefault();
                    this.setState({
                      isEdited : true,
                      editEmail : event.target.value,
                    })
                  }}
                  autoFocus
                  margin="dense"
                  id="email"
                  label="Email"
                  type="text"
                  fullwidth="true"
                  style={{width: "90%"}}
                />
                <TextField
                  value={this.state.editScore}
                  onChange={(event) => {
                    event.preventDefault();
                    this.setState({
                      isEdited : true,
                      editScore : event.target.value,
                    })
                  }}
                  helperText={this.state.editScore >= 0 ? "" : "Score invalide..."}
                  error={!(this.state.editScore >= 0)}
                  margin="dense"
                  id="score"
                  label="Score"
                  type="number"
                  fullwidth="true"
                  style={{width: "90%"}}
                />

                <FormLabel fullwidth="true" component="legend">Email confirmé</FormLabel>
                <RadioGroup row name="gender1" value={this.state.editEmailConfirmed} onChange={
                  (event) => {
                      this.setState({
                        isEdited : true,
                        editEmailConfirmed : event.target.value,
                      });
                  }}
                >
                  <FormControlLabel value="yes" disabled={this.state.tempEditEmailConfirmed === "yes"} control={<Radio color="primary" />} label="Oui" />
                  <FormControlLabel value="no"  disabled={this.state.tempEditEmailConfirmed === "yes"}  control={<Radio color="primary" />} label="Non" />
                </RadioGroup>

                <FormLabel fullwidth="true" component="legend">Rôle</FormLabel>
                <RadioGroup row name="gender1" value={this.state.editIsAdmin} onChange={
                  (event) => {
                    this.setState({
                      isEdited : true,
                      editIsAdmin : event.target.value,
                    });
                  }}
                >
                  <FormControlLabel style={{fontSize: 9}} value="yes" control={<Radio color="primary"/>} label="Admin" />
                  <FormControlLabel value="no" control={<Radio color="primary"/>} label="Membre" />
                </RadioGroup>
              </DialogContent>
              <DialogActions>
                <Button onClick={(e) => {e.preventDefault(); this.handleCloseEdit()}} color="primary">
                  Annuler
                </Button>
                <Button onClick={(e) => {e.preventDefault(); this.handleSubmitEdit(); this.handleCloseEdit()}} color="primary" type="submit">
                  Sauvegarder
                </Button>
              </DialogActions>
            </form>
          </Dialog>

          {/* Bouton supprimer */}
          <Dialog
            disableBackdropClick
            open={this.state.openDelete}
            onClose = {(e) => {e.preventDefault(); this.handleClosedDelete()}}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title">Suppression utilisateur</DialogTitle>
            <form noValidate onSubmit={(e) => {e.preventDefault(); this.handleSubmitDelete()}}>
              <DialogContent>
                <FormLabel fullwidth="true" component="legend">
                  Êtes-vous sûr de vouloir supprimer l'utilisateur {this.state.deleteID} ? Cette opération est irréversible... 
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
          {/* bug position des boutons par rapport aux autres tables */}
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <Grid item md={8}></Grid>
            <Grid item md={4}>
              <Button
                className={classes.btn}
                onClick = {(e) => {e.preventDefault(); this.handleClickOpenDeleteAll()}}
                variant="contained"
                color="primary"
                type="submit"
                startIcon={<DeleteForeverIcon />} // TODO changer icone
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
                      Êtes-vous sûr de vouloir supprimer les utilisateurs - {this.state.selected.map((item) => this.state.items[item].login + " - ")} ? Cette opération est irréversible... 
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
                  { field: 'id', headerName: 'ID', width: 75 },
                  { field: 'login', headerName: 'Login', width: 200,
                  renderHeader: (params) => (
                    <div style={{fontWeight:'800'}}>Login</div>
                  )},
                  { field: 'password', headerName: 'Mot de passe', width: 200,
                  renderHeader: (params) => (
                    <div style={{fontWeight:'800'}}>Mot de passe</div>
                  )},
                  { field: 'email', headerName: 'Email', width: 200, editable: true },
                  { field: 'score', headerName: 'Score', type: 'number', width: 150, editable: true },
                  { field: 'email_confirmed', headerName: 'Email confirmé', type: 'boolean', width: 150, editable: true },
                  { field: 'is_admin', headerName: 'Admin?', width: 150, type: 'boolean', editable: true },
                  { field: 'actions', headerName:'Actions', width: 200, renderCell: (params) => (
                    <strong>
                      {/* Bouton envoyer un mail */}
                      <IconButton
                        variant="contained"
                        color="primary"
                        size="small"
                        style={{ marginLeft: 16 }}
                        onClick={() => window.open("mailto:" + params.row.email + "?subject=Alerte Wikilogie : ")}
                      >
                        <MailIcon />
                      </IconButton>

                      {/* Bouton éditer la ligne */}
                      <IconButton
                        variant="contained"
                        color="primary"
                        size="small"
                        style={{ marginLeft: 16 }}
                        disabled={params.row.is_admin !== 0}
                        onClick={() => { 
                          var isAdmin = "no";
                          if (params.row.is_admin === 1) {
                            isAdmin = "yes";
                          } 
                          var isConfirmed = "no";
                          if (params.row.email_confirmed === 1) {
                            isConfirmed = "yes";
                          } 
                          this.setState({
                            editID : params.id,
                            editEmail : params.row.email,
                            editScore : params.row.score,
                            editIsAdmin : isAdmin,
                            editEmailConfirmed : isConfirmed,
                            tempEditEmailConfirmed : isConfirmed
                          });
                          this.handleClickOpenEdit();
                        }}
                      >
                        <EditIcon />
                      </IconButton>

                      {/* Bouton supprimer la ligne */}
                      <IconButton
                        variant="contained"
                        color="primary"
                        size="small"
                        style={{ marginLeft: 16 }}
                        disabled={params.row.is_admin !== 0}
                        onClick={() => { 
                          this.setState({
                            deleteID : params.id
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
              sortModel={[{ field: 'id', sort: 'asc' }]}
              isRowSelectable={(params) => params.row.is_admin !== 1}
              isCellEditable={(params) =>  params.row.is_admin !== 1}
              checkboxSelection
              onSelectionModelChange={(params) => this.handleRowSelection(params)}
              disableSelectionOnClick
              selectionModel={this.state.selected}
              // Prend en charge la modification d'une cellule directement dans le tableau (double clic ou clic + entrée)
              onEditCellChangeCommitted={(params) => {
                if(params.field === "email_confirmed" || params.field === "is_admin"){
                  if(params.props.value === true){
                    params.props.value = 1;
                  }
                  else{
                    params.props.value = 0;
                  }
                }

                const requestOptionsUpdate = {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Methods':'GET, POST, PUT, OPTIONS' },
                  tableName: "users", 
                  setStatement: params.field+"='"+params.props.value+"'",
                  whereConditions: "id='"+params.id+"'",
                };

                (async () => {
                  await Promise.all([
                    axios.put("http://localhost:3001/operations",requestOptionsUpdate)
                    .then(this.showToast("~ Modify ~ </br>User id = "+params.id+
                                        "</br> Modification => " + requestOptionsUpdate.setStatement + " <="
                    ))
                  ]);
                  this.refreshRows()
                })();
                }
              }
            />
          </div>

        </div>        
      );
    }
  }
}

export default withStyles(styles)(Users);
