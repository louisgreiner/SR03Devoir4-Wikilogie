import React from 'react';
import { Button, Grid } from "@material-ui/core";
import { DataGrid } from '@material-ui/data-grid';
import axios from 'axios';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import { withStyles } from '@material-ui/core/styles';
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import AssignmentIcon from '@material-ui/icons/Assignment';
import FormLabel from '@material-ui/core/FormLabel';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import './table.css';

const styles = theme => ({
  root: {
    backgroundColor: "#4443BB",
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
  }
});

class Quizz extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: [],
      selected: [],
      users: [],

      openAdd : false,
      newUser : "",
      newQuizz : "",
      newTitle : "",
      newScore : 0,

      isEdited : false,
      openEdit : false,
      editUser : "",
      editQuizz : "",
      editTitle : "",
      editScore : 0,

      openDelete : false,
      deleteUser : "",
      deleteQuizz: 0,

      openDeleteAll : false
    };
  }

  // Charge le contenu des tables dans le state une première fois au chargement de la page
  componentDidMount() {
    axios("http://localhost:3001/operations?tableName=quizz")
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
    await axios("http://localhost:3001/operations?tableName=quizz")
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
      tableName: 'quizz', 
      columnNames: "",
      values: ["'" + this.state.newUser + "'", "'" + this.state.newQuizz + "'", "'" + this.state.newTitle + "'","'" + this.state.newScore + "'"]
    };

    (async () => {
      await Promise.all([
        axios.post("http://localhost:3001/operations",requestOptionsInsert)
        .then(this.showToast("~ Insert ~ </br>=> User = "+this.state.newUser+
                            ", Quizz = "+this.state.newQuizz+
                            ", Titre = "+this.state.newTitle+
                            ", Score = "+this.state.newScore+ " <="
        ))      
      ]);
      this.refreshRows()
    })();

    this.setState({
      newUser : "",
      newQuizz : "",
      newTitle : "",
      newScore : 0
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

    const requestOptionsUpdate = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Methods':'GET, POST, PUT, OPTIONS' },
      tableName: "quizz q", 
      setStatement: "title='"+this.state.editTitle+"', score="+this.state.editScore,
      whereConditions: "q.user='"+this.state.editUser+"' AND quizz='"+this.state.editQuizz+"'"
    };

    (async () => {
      await Promise.all([
        axios.put("http://localhost:3001/operations",requestOptionsUpdate)
        .then(this.showToast("~ Modify ~ </br>=> User = "+this.state.editUser+
                            ", Quizz = "+this.state.editQuizz+
                            "</br> Modification => Titre='" + this.state.editTitle + 
                            ", Score = "+this.state.editScore+ " <="
        ))      
      ]);
      this.refreshRows()
    })();

    this.setState({
      isEdited : false,
      editUser : "",
      editQuizz : "",
      editTitle : "",
      editScore : 0
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
        tableName: 'quizz q', 
        whereConditions: "q.user='" + this.state.deleteUser +
                        "' AND quizz='" + this.state.deleteQuizz + "'"
      }
    };

    (async () => {
      await Promise.all([
        axios.delete("http://localhost:3001/operations",requestOptionsDelete)
        .then(this.showToast("~ Delete ~ </br>User = "+this.state.deleteUser+
                            ", Quizz = "+this.state.deleteQuizz+" <="
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

  // ou alternative deleteAll()
  // Supprime toutes les lignes sélectionnées
  handleSubmitDeleteAll(){
    var request = '';
    for(var i = 0; i < this.state.selected.length - 1; i++){
      request += "(q.user='" + this.state.items[this.state.selected[i]].user + "' AND quizz='" + this.state.items[this.state.selected[i]].quizz + "') OR ";
    }
    request += "(q.user='" + this.state.items[this.state.selected[this.state.selected.length - 1]].user + "' AND quizz='" + this.state.items[this.state.selected[this.state.selected.length - 1]].quizz + "')";
    
    const requestOptionsDelete = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json'},
      data: {
        tableName: 'quizz q', 
        whereConditions: request
      }
    };
    (async () => {
      await Promise.all([
        axios.delete('http://localhost:3001/operations',requestOptionsDelete)
        .then(this.showToast('~ Delete all ~ </br>Quizz = '+this.state.selected+ '<='
        ))
      ])
      this.refreshRows();
    })();
    this.setState({
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
    document.getElementById('toast').classList.add('show');
    document.getElementById('toast').innerHTML=text;
    setTimeout(function(){
      document.getElementById('toast').classList.remove('show');
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
                startIcon={<AssignmentIcon/>}
              >
                Nouveau quizz
              </Button>
              <Dialog
                disableBackdropClick
                open={this.state.openAdd}
                onClose = {(e) => {e.preventDefault(); this.handleCloseAdd()}}
                aria-labelledby="form-dialog-title"
              >
                <DialogTitle id="form-dialog-title">Ajout quizz</DialogTitle>
                <form noValidate onSubmit={(e) => {e.preventDefault(); this.handleSubmitAdd()}}>
                  <DialogContent>

                  <InputLabel style={{width: "90%"}}>User</InputLabel>
                    <Select
                      id="demo-simple-select"
                      value={this.state.newUser}
                      onChange={(event) => {
                        event.preventDefault();
                        this.setState({
                          newUser : event.target.value,
                        })
                      }}
                      style={{width: "90%"}}
                    >
                      {this.state.users.map((user) =>
                        <MenuItem value={user.login}>{user.login}</MenuItem>
                      )}
                    </Select>
                    
                    <TextField
                      value={this.state.newQuizz}
                      onChange={(event) => {
                        event.preventDefault();
                        this.setState({
                          newQuizz : event.target.value,
                        })
                      }}
                      margin="dense"
                      id="quizz"
                      label="Quizz"
                      type="text"
                      fullwidth="true"
                      style={{width: "90%"}}
                    />
                    <TextField
                      value={this.state.newTitle}
                      onChange={(event) => {
                        event.preventDefault();
                        this.setState({
                          newTitle : event.target.value,
                        })
                      }}
                      margin="dense"
                      id="title"
                      label="Titre"
                      type="text"
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
            <DialogTitle id="form-dialog-title">Modifier quizz</DialogTitle>
            <form noValidate onSubmit={(e) => {e.preventDefault(); this.handleSubmitEdit()}}>
              <DialogContent>
                <TextField
                  value={this.state.editTitle}
                  onChange={(event) => {
                    event.preventDefault();
                    this.setState({
                      isEdited : true,
                      editTitle : event.target.value,
                    })
                  }}
                  autoFocus
                  margin="dense"
                  id="title"
                  label="Titre"
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
                  margin="dense"
                  id="score"
                  label="Score"
                  type="number"
                  fullwidth="true"
                  style={{width: "90%"}}
                />
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
            <DialogTitle id="form-dialog-title">Suppression quizz</DialogTitle>
            <form noValidate onSubmit={(e) => {e.preventDefault(); this.handleSubmitDelete()}}>
              <DialogContent>
                <FormLabel fullwidth="true" component="legend">
                  Êtes-vous sûr de vouloir supprimer le quizz ({this.state.deleteUser}, {this.state.deleteQuizz}) ? Cette opération est irréversible... 
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
                      Êtes-vous sûr de vouloir supprimer les quizz - {this.state.selected.map((item) => "("+this.state.items[item].user+ ", "+ this.state.items[item].quizz + ") - ")} ? Cette opération est irréversible... 
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
                  { field: 'user', headerName: 'Login', width: 250,
                  renderHeader: (params) => (
                    <div style={{fontWeight:'800'}}>Login</div>
                  )},
                  { field: 'quizz', headerName: 'Quizz', width: 400,
                  renderHeader: (params) => (
                    <div style={{fontWeight:'800'}}>Quizz</div>
                  )},
                  { field: 'title', headerName: 'Titre du quizz', width: 250, editable: true},
                  { field: 'score', headerName: 'Score', type: 'number', width: 150, editable: true },
                  { field: 'actions', headerName:'Actions', width: 200, renderCell: (params) => (
                    <strong>
                      {/* Bouton éditer la ligne */}
                      <IconButton
                        variant="contained"
                        color="primary"
                        size="small"
                        style={{ marginLeft: 16 }}
                        onClick={() => { 
                          this.setState({
                            editUser : params.row.user,
                            editQuizz : params.row.quizz,
                            editTitle : params.row.title,
                            editScore : params.row.score
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
                        onClick={() => { 
                          this.setState({
                            deleteUser : params.row.user,
                            deleteQuizz: params.row.quizz
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
              sortModel={[{ field: 'user', sort: 'asc' }]}
              checkboxSelection
              onSelectionModelChange={(params) => this.handleRowSelection(params)}
              disableSelectionOnClick
              selectionModel={this.state.selected}
              // Prend en charge la modification d'une cellule directement dans le tableau (double clic ou clic + entrée)
              onEditCellChangeCommitted={(params) => {
                const requestOptionsUpdate = {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Methods':'GET, POST, PUT, OPTIONS' },
                  tableName: "quizz q", 
                  setStatement: params.field+"='"+params.props.value+"'",
                  whereConditions: "q.user='"+this.state.items[params.id].user+"' AND quizz='"+this.state.items[params.id].quizz+"'"
                };
                (async () => {
                  await Promise.all([
                    axios.put("http://localhost:3001/operations",requestOptionsUpdate)
                    .then(this.showToast("~ Modify ~ </br>User = "+this.state.items[params.id].user+
                                        ", Quizz = "+this.state.items[params.id].quizz+
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

export default withStyles(styles)(Quizz);
