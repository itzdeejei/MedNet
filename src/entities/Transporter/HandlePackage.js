import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import {NavLink, withRouter, BrowserRouter as Router, Route} from 'react-router-dom';
import RawMaterial from '../../build/RawMaterial.json';
import Transactions from '../../build/Transactions.json';
import Popup from '../Owner/Popup'
import '../Owner/Popup.css'

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', 
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function HandlePackage(props) {
  const [account] = useState(props.account);
  const [web3, setWeb3] = useState(props.web3);
  const [supplyChain] = useState(props.supplyChain);
  const [loading, isLoading] = useState(false);
  const [pAddress, setpAddress] = useState("");
  const [type, setType] = useState("");
  const [cid, setCid] = useState("");
  const [buttonPopup, setButtonPopup] = useState(false);

  const classes = useStyles();

  const handleInputChange = (e) => {
    if (e.target.id === 'pAddress') {
        setpAddress(e.target.value);
        setCid(e.target.value);     
    } else if(e.target.id === 'type') {
        setType(e.target.value);     
    } 
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    isLoading(true);
    supplyChain.methods.transporterHandlePackage(pAddress, type, cid).send({from: account})
    .once('receipt', async (receipt) => {
      console.log(receipt);
      isLoading(false);
    })
  }


  return (
    <Grid container style={{ backgroundColor: "white", display: "center", alignItems: "center", maxWidth: 400, justify: "center"}}>
        <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          
          <Typography component="h1" variant="h5">Enter Package Details</Typography>
          <form className={classes.form} noValidate>
          <Grid container spacing={2}>

            <Grid item xs={12}>
                <TextField variant="outlined" onChange={ handleInputChange } required fullWidth  id="pAddress" label="Package Address" name="pAddress"/>
            </Grid>
            
            <Grid item xs={10}>
                <TextField variant="outlined" onChange={ handleInputChange } required fullWidth  id="type" label="Transporter type" name="type"/>
            </Grid>

            <Grid item xs={2}>    
                <button type="button" id="infoButton" onClick={ () => setButtonPopup(true) } ><span role="img" aria-label="info">ℹ️</span></button>
                      <Popup trigger={ buttonPopup } setTrigger={ setButtonPopup }>
                        <h1 className='PopHead'>TYPES</h1>
                        <h3 className='PopDes'>Use the following numbers for each transport</h3>
                        <p className='PopDet'>1 - Supplier to Manufacturer</p>
                        <p className='PopDet'>2 - Manufacturer to Wholesaler</p>
                        {/* <p className='PopDet'>3 - Wholesaler to Distributer</p> */}
                      </Popup>
                
            </Grid>
            
            {/* <Grid item xs={12}>
                <TextField variant="outlined" onChange={ handleInputChange } required fullWidth  id="cid" label="Cid" name="cid"/>
            </Grid> */}

            </Grid>
            <Button
              type="submit" fullWidth variant="contained" color="primary" className={classes.submit} onClick={ handleSubmit } >
              Submit
            </Button>
          
          </form>
        </div>
      </Container>
    </Grid>
  );
}
