import React from 'react';
import { Button, Grid, Typography } from "@material-ui/core";
import { DataGrid, gridCheckboxSelectionColDef } from '@material-ui/data-grid';
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
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import DescriptionIcon from '@material-ui/icons/Description';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import FormLabel from '@material-ui/core/FormLabel';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
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

class ArticlesToVerify extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: [],
      selected: [],
      users :[],

      openAdd : false,
      newTitle : "",
      newAuthor : "",
      newReason : "",
      newIsVerified : "no",
      newDateReport : "",
      newHeureReport : "00:00",
      newDateVerification : "",
      newHeureVerification : "00:00",

      newStatus : "no",
      newVerifiedBy : 0,

      openEdit : false,
      isEdited : false,
      editArticleID : 0,
      editTitle : "",
      editAuthor : "",
      editReason : "",
      editIsVerified : "no",
      tempEditIsVerified : "",
      editDateReport : "",
      editDateVerification : "",
      editHeureVerification : "",
      editStatus : "no",
      editVerifiedBy : 0,

      openDelete : false,
      deleteArticleID: 0,
      deleteAuthor: "",
      deleteDateReport: "",

      openDeleteAll : false
    };
  }

  // Charge le contenu des tables dans le state une première fois au chargement de la page
  componentDidMount() {
    axios("http://localhost:3001/operations?tableName=articles_to_verify")
      .then(res => res.data)
      .then(data => {
        for(var i = 0; i < data.length; i++){
          data[i].id = i;
          // data[i].date_report = data[i].date_report ? data[i].date_report.substring(0, 10) + " " + data[i].date_report.substring(11, 19) : null;
          // data[i].date_verification = data[i].date_verification ? data[i].date_verification.substring(0, 10) + " " + data[i].date_verification.substring(11, 19) : null;
          // console.log(data[i].date_report);
          // console.log(data[i].date_verification);
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
      })
      axios("http://localhost:3001/operations?tableName=users")
      .then(res => res.data)
      .then(data => {
        this.setState({
          users: data,
          newAuthor : data[0].login,
          newVerifiedBy : data[0].login,
        });
      })
  }

  // Rafraichit les données de notre tableau après chaque action (insert, update, delete)
  async refreshRows() {
    await axios("http://localhost:3001/operations?tableName=articles_to_verify")
    .then(res => res.data)
    .then(data => {
      for(var i = 0; i < data.length; i++){
        data[i].id = i;
        // j'ai changé ça mais ça marche pas
        // data[i].date_report = data[i].date_report ? data[i].date_report.substring(0, 10) + " " + data[i].date_report.substring(11, 19) : null;
        // data[i].date_verification = data[i].date_verification ? data[i].date_verification.substring(0, 10) + " " + data[i].date_verification.substring(11, 19) : null;
        // console.log(data[i].date_report);
        // console.log(data[i].date_verification);      
      }
      this.setState({
        items: data,
      });
    })
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
    var status = 0; 
    if (this.state.newStatus === "yes"){
      status = 1;
    }
    var isVerified = 0; 
    if (this.state.newIsVerified === "yes"){
      isVerified = 1;
    } 
    console.log(isVerified);
    console.log(status);
    const requestOptionsInsert = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Methods':'GET, POST, PUT, OPTIONS' 
      },
      tableName: 'articles_to_verify', 
      columnNames: ['title','author','reason','is_verified','date_report','date_verification','status','verified_by'], // surement rien ""
      values: ["'" + this.state.newTitle + 
              "'", "'" + this.state.newAuthor + 
              "'", "'" + this.state.newReason + 
              "'", isVerified
              , "TIMESTAMPTZ '" + this.state.newDateReport + ' ' +  this.state.newHeureReport + 
              "'", "TIMESTAMPTZ '" + this.state.newDateVerification + ' ' +  this.state.newHeureVerification + 
              "'", status
              ,"'" + this.state.newVerifiedBy + "'"
            ]
    };

    (async () => {






      var tableName = 'articles_to_verify';
      var columnNames = ['title','author','reason','is_verified','date_report','date_verification','status','verified_by'];
      var values = ["'" + this.state.newTitle + 
          "'", "'" + this.state.newAuthor + 
          "'", "'" + this.state.newReason + 
          "'", isVerified
          , "TIMESTAMPTZ '" + this.state.newDateReport + ' ' +  this.state.newHeureReport + 
          "'", "TIMESTAMPTZ '" + this.state.newDateVerification + ' ' +  this.state.newHeureVerification + 
          "'", status
          ,"'" + this.state.newVerifiedBy + "'"
        ];
      var query = "INSERT INTO " + tableName + " ";
      const len = columnNames.length;
      if (len > 0){
          query = query + "(";
          query = query + columnNames.join(",");
          query = query + ") ";
      }
      query = query + "VALUES (" + values.join(",") + ");";

      console.log(query);
      await Promise.all([
        axios.post("http://localhost:3001/operations",requestOptionsInsert)
        .then(this.showToast("~ Insert ~ </br>=> Titre = "+this.state.newTitle+
                            ", auteur = "+this.state.newAuthor+
                            ", date_report = "+this.state.newDateReport+ " <="
        ))      
      ]);
      this.refreshRows()
    })();

    this.setState({
      newTitle : "",
      newAuthor : "",
      newReason : "",
      newIsVerified : 0,
      newDateReport : "",
      newDateVerification : "",
      newStatus : false,
      newVerifiedBy : false,
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

    var isVerified = 0; 
    if (this.state.editIsVerified === "yes"){
      isVerified = 1;
    }
    var status = 0; 
    if (this.state.editStatus === "yes"){
      status = 1;
    } 
    var dateVerif = "NULL"; 
    if (this.state.editDateVerification !== ""){
      dateVerif = "TIMESTAMPTZ '" + this.state.editDateVerification + ' ' + this.state.editHeureVerification + "'";

    }
    var verifiedBy = "NULL"; 
    if (this.state.editVerifiedBy != 0){
      verifiedBy = "'" + this.state.editVerifiedBy + "'";

    } 
    const requestOptionsUpdate = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Methods':'GET, POST, PUT, OPTIONS' },
      tableName: "articles_to_verify", 
      setStatement: "title='" + this.state.editTitle + 
                    "', reason='" + this.state.editReason +
                    "', is_verified=" + isVerified +
                    ", date_verification=" + dateVerif +
                    ", status=" + status +
                    ", verified_by=" + verifiedBy + "",
      whereConditions: "article_id=" + this.state.editArticleID +
                      " AND author='" + this.state.editAuthor +
                      "' AND date_report='" + this.state.editDateReport + "'",
                    //   "' AND date_verification=TO_DATE('"+ this.state.editDateReport +"', 'YYYY-MM-DD')"

      };

    (async () => {
      await Promise.all([
        axios.put("http://localhost:3001/operations",requestOptionsUpdate)
        .then(this.showToast("~ Modify ~ </br>Article id = "+this.state.editArticleID+
                            ", auteur = "+this.state.editAuthor+
                            ", date_report = "+this.state.editDateReport+
                            "</br> Modification => title='" + this.state.editTitle + 
                            "', reason='" + this.state.editReason +
                            "', is_verified=" + isVerified +
                            ", date_verification='" + this.state.editDateVerification +
                            "', status=" + status + 
                            ", verified_by=" + this.state.newVerifiedBy + " <="
        )) 
      ]);
      this.refreshRows()
    })();

    this.setState({
      isEdited : false,
      editArticleID : 0,
      editTitle : "",
      editAuthor : "",
      editReason : "",
      editIsVerified : "no",
      editDateReport : "",
      editDateVerification : "",
      editStatus : "no",
      editVerifiedBy : 0,
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
        tableName: 'articles_to_verify a', 
        whereConditions: "article_id='" + this.state.deleteArticleID + 
                        "' AND a.author='" + this.state.deleteAuthor + 
                        "' AND date_report='" + this.state.deleteDateReport + "'"
      }
    };

    (async () => {
      await Promise.all([
        axios.delete("http://localhost:3001/operations",requestOptionsDelete)
        .then(this.showToast("~ Delete ~ </br>Article id = "+this.state.deleteArticleID+
                            ", auteur = "+this.state.deleteAuthor+
                            ", date_report = "+this.state.deleteDateReport+" <="
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
      request += "(article_id='" + this.state.items[this.state.selected[i]].article_id + 
                  "' AND a.author='" + this.state.items[this.state.selected[i]].author + 
                  "' AND date_report='" + this.state.items[this.state.selected[i]].date_report +
                  "') OR ";
    }
    request += "(article_id='" + this.state.items[this.state.selected[this.state.selected.length - 1]].article_id + 
                "' AND a.author='" + this.state.items[this.state.selected[this.state.selected.length - 1]].author + 
                "' AND date_report='" + this.state.items[this.state.selected[this.state.selected.length - 1]].date_report + 
                ")";
    
    const requestOptionsDelete = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      data: {
        tableName: 'articles_to_verify a', 
        whereConditions: request
      }
    };

    (async () => {
      await Promise.all([
        axios.delete("http://localhost:3001/operations",requestOptionsDelete)
        .then(this.showToast("~ Delete all ~ </br>Article ids = "+this.state.selected+ "<="
        ))
      ])
      this.refreshRows();
    })();

    this.setState({ // remet à zéro la liste des éléments selectionnés
      selected: []
    });

      // numéro des balises à changer si ajout balises dans le front
      // document.getElementsByTagName('span')[7].setAttribute("class","MuiButtonBase-root MuiIconButton-root PrivateSwitchBase-root-4 MuiCheckbox-root MuiCheckbox-colorPrimary MuiDataGrid-checkboxInput MuiIconButton-colorPrimary");
      // document.getElementsByTagName('input')[0].setAttribute("data-indeterminate","false");
      // document.getElementsByTagName('path')[1].setAttribute("d","M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z");
  }

  // pas utile pour l'instant
  validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
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
                startIcon={<DescriptionIcon/>}
              >
                Nouvel article
              </Button>
              <Dialog
                disableBackdropClick
                open={this.state.openAdd}
                onClose = {(e) => {e.preventDefault(); this.handleCloseAdd()}}
                aria-labelledby="form-dialog-title"
              >
                <DialogTitle id="form-dialog-title">Ajout article</DialogTitle>
                <form noValidate onSubmit={(e) => {e.preventDefault(); this.handleSubmitAdd()}}>
                  <DialogContent>
                    <TextField
                      value={this.state.newTitle}
                      onChange={(event) => {
                        event.preventDefault();
                        this.setState({
                          newTitle : event.target.value,
                        })
                      }}
                      autoFocus
                      margin="dense"
                      id="title"
                      label="Titre"
                      type="text"
                      fullwidth="true"
                      style={{width: "90%"}}
                      required
                    />
                    <FormControl>
                    <FormLabel fullwidth="true" component="legend">Auteur</FormLabel>

                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={this.state.newAuthor}
                        onChange={(event) => {
                          event.preventDefault();
                          this.setState({
                            newAuthor : event.target.value,
                          })
                        }}
                      >
                      {this.state.users.map((user) =>
                        <MenuItem value={user.login}>{user.login}</MenuItem>
                      )}
                      </Select>
                    </FormControl>
                    <TextField
                      value={this.state.newReason}
                      onChange={(event) => {
                        event.preventDefault();
                        this.setState({
                          newReason : event.target.value,
                        })
                      }}
                      margin="dense"
                      id="reason"
                      label="Raison"
                      type="text"
                      required
                      fullwidth="true"
                      style={{width: "90%"}}
                    />
                    <FormLabel fullwidth="true" component="legend">Article vérifié</FormLabel>
                    <RadioGroup row name="gender1"  required value={this.state.newIsVerified} onChange={
                      (event) => {
                          this.setState({
                            newIsVerified : event.target.value,
                          });
                      }}
                    >
                      <FormControlLabel value="yes" 
                        // disabled={this.state. === "yes"} 
                        control={<Radio color="primary" />} label="Oui" />
                      <FormControlLabel value="no"  
                        // disabled={this.state.tempEditIsVerified === "yes"}  
                        control={<Radio color="primary" />} label="Non" />
                    </RadioGroup>
                    <FormLabel fullwidth="true" component="legend">Date de report</FormLabel>
                    <TextField // DATE REPORT = date de l'article ? (on doit le rentrer à la main) ou = date ajout dans la bdd (on peut utiliser CURRENTDATE donc pas besoin de le demander)
                      value={this.state.newDateReport}
                      onChange={(event) => {
                        event.preventDefault();
                        this.setState({
                          newDateReport : event.target.value,
                        })
                      }}
                      margin="dense"
                      id="date_report"
                      label=""
                      type="date"
                      fullwidth="true"
                      style={{width: "60%"}}
                    />
                    <TextField 
                      value={this.state.newHeureReport}
                      onChange={(event) => {
                        event.preventDefault();
                        this.setState({
                          newHeureReport : event.target.value,
                        });
                        console.log(event.target.value);
                      }}
                      margin="dense"
                      id="date_report"
                      label=""
                      type="time"
                      required
                      fullwidth="true"
                      style={{width: "30%"}}
                    />

                    <FormLabel fullwidth="true" component="legend">Date de vérification</FormLabel>
                    <TextField // DATE REPORT = date de l'article ? (on doit le rentrer à la main) ou = date ajout dans la bdd (on peut utiliser CURRENTDATE donc pas besoin de le demander)
                      value={this.state.newDateVerification}
                      onChange={(event) => {
                        event.preventDefault();
                        this.setState({
                          newDateVerification : event.target.value,
                        })
                      }}
                      margin="dense"
                      id="date_report"
                      label=""
                      type="date"
                      fullwidth="true"
                      style={{width: "60%"}}
                    />
                    <TextField 
                      value={this.state.newHeureVerification}
                      onChange={(event) => {
                        event.preventDefault();
                        this.setState({
                          newHeureVerification : event.target.value,
                        });
                        console.log(event.target.value);
                      }}
                      margin="dense"
                      id="date_report"
                      label=""
                      type="time"
                      required
                      fullwidth="true"
                      style={{width: "30%"}}
                    />
                    <FormLabel fullwidth="true" component="legend">Statut</FormLabel>
                    <RadioGroup row name="gender1" required value={this.state.newStatus} onChange={
                      (event) => {
                          this.setState({
                            newStatus : event.target.value,
                          });
                      }}
                    >
                      <FormControlLabel value="yes" control={<Radio color="primary" />} label="Oui" />
                      <FormControlLabel value="no" control={<Radio color="primary" />} label="Non" />
                    </RadioGroup>
                    <FormControl>
                    <InputLabel 
                      id="demo-simple-select-label"
                      fullwidth="true"
                    >Vérifié par</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={this.state.newVerifiedBy}
                      required
                      onChange={(event) => {
                        event.preventDefault();
                        this.setState({
                          newVerifiedBy : event.target.value,
                        })
                      }}
                      // disabled={this.state.tempEditIsVerified === "yes"}
                    >
                    {this.state.users.map((user) =>
                      <MenuItem value={user.id}>{user.login}</MenuItem>
                    )}
                    </Select>
                  </FormControl>
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
            <DialogTitle id="form-dialog-title">Modifier article</DialogTitle>
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
                  disabled={this.state.tempEditIsVerified === "yes" }
                />
                <TextField
                  value={this.state.editReason}
                  onChange={(event) => {
                    event.preventDefault();
                    this.setState({
                      isEdited : true,
                      editReason : event.target.value,
                    })
                  }}
                  margin="dense"
                  id="reason"
                  label="Raison"
                  type="text"
                  fullwidth="true"
                  style={{width: "90%"}}
                  disabled={this.state.tempEditIsVerified === "yes"}
                />

                <FormLabel fullwidth="true" component="legend">Statut</FormLabel>
                <RadioGroup row name="gender1" value={this.state.editStatus} onChange={
                  (event) => {
                      this.setState({
                        editStatus : event.target.value,
                      });
                  }}
                >
                  <FormControlLabel value="yes" control={<Radio color="primary" />} label="Oui" />
                  <FormControlLabel value="no" control={<Radio color="primary" />} label="Non" />
                </RadioGroup>

                <FormLabel fullwidth="true" component="legend">Article vérifié</FormLabel>
                <RadioGroup row name="gender1" value={this.state.editIsVerified} onChange={
                  (event) => {
                      this.setState({
                        isEdited : true,
                        editIsVerified : event.target.value,
                      });
                  }}
                >
                  <FormControlLabel value="yes" disabled={this.state.tempEditIsVerified === "yes"} control={<Radio color="primary" />} label="Oui" />
                  <FormControlLabel value="no"  disabled={this.state.tempEditIsVerified === "yes"}  control={<Radio color="primary" />} label="Non" />
                </RadioGroup>
                <FormLabel fullwidth="true" component="legend">Date de vérification</FormLabel>
                <TextField // peut-être à aller chercher dynamiquement quand on coche isVerified avec CURRENTDATE
                  value={this.state.editDateVerification}
                  onChange={(event) => {
                    event.preventDefault();
                    this.setState({
                      editDateVerification : event.target.value,
                    })
                  }}
                  margin="dense"
                  id="date_verification"
                  label=""
                  type="date"
                  fullwidth="true"
                  style={{width: "60%"}}
                  disabled={this.state.tempEditIsVerified === "yes" || this.state.editIsVerified === "no"}
                />
                <TextField 
                  value={this.state.editHeureVerification}
                  onChange={(event) => {
                    event.preventDefault();
                    this.setState({
                      editHeureVerification : event.target.value,
                    });
                  }}
                  margin="dense"
                  id="date_report"
                  label=""
                  type="time"
                  required
                  fullwidth="true"
                  style={{width: "30%"}}
                  disabled={this.state.tempEditIsVerified === "yes" || this.state.editIsVerified === "no"}

                />


                <Typography>
                <FormControl style={{minWidth: 250}}> 
                  <InputLabel 
                    id="demo-simple-select-label"
                    fullwidth="true"
                  >Vérifié par</InputLabel>
                  
                  <Select
                    // style={{display: 'block', width: "90%"}}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={this.state.editVerifiedBy}
                    onChange={(event) => {
                      event.preventDefault();
                      // console.log(this.state.editVerifiedBy);
                      this.setState({
                        editVerifiedBy : event.target.value,
                      });
                      console.log("event.target " + event.target.value);
                      // console.log("editverified " + this.state.editVerifiedBy);
                    }}
                    disabled={this.state.tempEditIsVerified === "yes" || this.state.editIsVerified === "no"}
                  >
                  {this.state.users.map((user) =>
                    <MenuItem value={user.id}>{user.login}</MenuItem>
                  )}
                  </Select>
                </FormControl>
                </Typography>
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
                  Êtes-vous sûr de vouloir supprimer l'article ({this.state.deleteArticleID},{this.state.deleteAuthor},{this.state.deleteDateReport}) ? Cette opération est irréversible... 
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
                      Êtes-vous sûr de vouloir supprimer les articles - {this.state.selected.map((item) => "("+this.state.items[item].article_id+ ", "+ this.state.items[item].author + ", "+this.state.items[item].author +") - ")} ? Cette opération est irréversible... 
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
                  { field: 'article_id', headerName: 'ID article', width: 75,
                  renderHeader: (params) => (
                    <div style={{fontWeight:'800'}}>ID article</div>
                  )},
                  { field: 'title', headerName: 'Titre', width: 200, editable: true },
                  { field: 'author', headerName: 'Auteur', width: 150,
                  renderHeader: (params) => (
                    <div style={{fontWeight:'800'}}>Auteur</div>
                  )},
                  { field: 'reason', headerName: 'Raison', width: 150, editable: true },
                  { field: 'is_verified', headerName: 'Vérifié ?', type: 'boolean', width: 150, editable: true },
                  { field: 'date_report', headerName: 'Date report', type: 'dateTime', valueFormatter: (params) => (params.value.substring(0, 10) + " " + params.value.substring(11, 19)), width: 200 },
                  { field: 'date_verification', headerName: 'Date vérification', type: 'dateTime', valueFormatter: (params) => (params.value !== null ? params.value.substring(0, 10) + " " + params.value.substring(11, 19) : null), width: 200, editable: true },
                  { field: 'status', headerName: 'Statut', type: 'boolean', width: 150, editable: true },
                  { field: 'verified_by', headerName: 'Vérifié par', width: 150, editable: true },
                  { field: 'actions', headerName:'Actions', width: 200, renderCell: (params) => (
                    <strong>
                      {/* Bouton éditer la ligne */}
                      <IconButton
                        variant="contained"
                        color="primary"
                        size="small"
                        style={{ marginLeft: 16 }}
                        onClick={() => { 
                          var isVerified = "no";
                          if (params.row.is_verified === 1) {
                            isVerified = "yes";
                          } 
                          var status = "no";
                          if (params.row.status === 1) {
                            status = "yes";
                          } 
                          var currVerif = params.row.date_verification;
                          var currDateVerif = "";
                          var currHeureVerif = "00:00";
                          if (currVerif) {
                            currDateVerif  = currVerif.substring(0,10);
                            currHeureVerif = currVerif.substring(11,16);
                          }
                          var verifiedBy = 0;
                          if (params.row.verified_by) {
                            verifiedBy = params.row.verified_by;
                          }
                          console.log(verifiedBy);
                          console.log(params.row.date_verification);
                          console.log(currDateVerif);
                          console.log(currHeureVerif);
                          this.setState({
                            editArticleID : params.row.article_id,
                            editTitle : params.row.title,
                            editAuthor : params.row.author,
                            editReason : params.row.reason,
                            editIsVerified : isVerified,
                            tempEditIsVerified : isVerified,
                            editDateReport : params.row.date_report,
                            editDateVerification : currDateVerif,
                            editHeureVerification : currHeureVerif,
                            editStatus : status,
                            editVerifiedBy : verifiedBy,
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
                            deleteArticleID: params.row.article_id,
                            deleteAuthor: params.row.author,
                            deleteDateReport: params.row.date_report,
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
              sortModel={[{ field: 'article_id', sort: 'asc' }]}
              checkboxSelection
              onSelectionModelChange={(params) => this.handleRowSelection(params)}
              disableSelectionOnClick
              selectionModel={this.state.selected}
              isCellEditable={(params) => {
                if(params.row.is_verified !== 1 || params.field === "status") {
                  if(params.field === "is_verified"){
                    if(params.row.title !== null && params.row.reason !== null && params.row.is_verified !== null && params.row.date_verification !== null && params.row.verified_by !== null){
                      return true;
                    }
                    else{
                      return false;
                    }
                  }
                  return true;
                }
              }}
              // Prend en charge la modification d'une cellule directement dans le tableau (double clic ou clic + entrée)
              onEditCellChangeCommitted={(params) => {
                if(params.props.value === null){
                  this.refreshRows();
                }
                else{
                  if(params.field === "is_verified" || params.field === "status"){
                    if(params.props.value === true){
                      params.props.value = 1;
                    }
                    else{
                      params.props.value = 0;
                    }
                  }
                  if(params.field === "date_verification" && params.props.value !== this.state.items[params.id].date_verification) {
                    params.props.value = params.props.value.toISOString();
                  }
                  const requestOptionsUpdate = {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Methods':'GET, POST, PUT, OPTIONS' },
                    tableName: "articles_to_verify a", 
                    setStatement: params.field+"='"+params.props.value+"'",
                    whereConditions: "article_id='" + this.state.items[params.id].article_id + 
                                    "' AND a.author='" + this.state.items[params.id].author + 
                                    "' AND date_report='" + this.state.items[params.id].date_report + "'"
                  };
                  (async () => {
                    await Promise.all([
                      axios.put("http://localhost:3001/operations",requestOptionsUpdate)
                      .then(this.showToast("~ Modify ~ </br>Article id = "+this.state.items[params.id].article_id+
                                            ", auteur = "+this.state.items[params.id].author+
                                            ", date_report = "+this.state.items[params.id].date_report+
                                            "</br> Modification => " + requestOptionsUpdate.setStatement + " <="
                      ))
                    ]);
                    this.refreshRows()
                  })();
                }
              }}
            />
          </div>

        </div>        
      );
    }
  }
}

export default withStyles(styles)(ArticlesToVerify);
