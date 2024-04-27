import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Loader from '../../components/Loader';
import CardBody from '../../main_dashboard/components/Card/CardBody';
import CardHeader from '../../main_dashboard/components/Card/CardHeader';
import Card from '../../main_dashboard/components/Card/Card';


const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
}));

export default function ViewUser(props) {
  console.log(props);
  console.log(props.account); 

  const classes = useStyles();
  const [account] = useState(props.account);
  const [web3, setWeb3] = useState(props.web3);
  const [address, setAddress] = useState("");
  const [supplyChain] = useState(props.supplyChain);
  const [loading, isLoading] = useState(false);
  const [details, setDetails] = useState({});
  const [active, setActive] = useState(false);
  const [name, setName] = useState("");
  const [locationx, setLocationX] = useState("");
  const [locationy, setLocationY] = useState("");
  const [role, setRole] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);

  console.log([account]);
  console.log("Check view SupplyChain");
  console.log([supplyChain]);
  const handleInputChange = (e) => {
    setAddress(e.target.value);
  }

  async function handleSubmit() {
    setFormSubmitted(true);
    var test = await supplyChain.methods.getUserInfo(address).call();
    setName(test.name);
    setRole(test.role);
    setLocationX(test.userLoc[0]);
    setLocationY(test.userLoc[1]);
    
    console.log(test);
  }

  async function viewAllUsers() {
    setActive(true);
    var users = await supplyChain.methods.getAllUsers().call();

    const usersList = await Promise.all(users.map(async (data) => {
      return (
        <TableRow key={data[ 0 ]} className={classes.tableBodyRow}>
          <TableCell multiline className={classes.tableCell} style={{ maxWidth: "75px" }}>{data[ 0 ]}</TableCell>
          <TableCell multiline className={classes.tableCell} style={{ maxWidth: "50px" }}>{data[ 1 ]}</TableCell>
          <TableCell multiline className={classes.tableCell} style={{ maxWidth: "50px" }}>{data[ 2 ]}</TableCell>
          <TableCell multiline className={classes.tableCell} style={{ maxWidth: "50px" }}>{data[ 3 ]}</TableCell>
        </TableRow>
      )

    }))

    setDetails(usersList);
    isLoading(false);

    if (active) {
      viewAllUsers();
      return (
        <Loader></Loader>
      );
    } else {
      return (
        <Card>
          <CardHeader color="danger">
            <h4 className={classes.cardTitleWhite}>Users List</h4>
            <p className={classes.cardCategoryWhite}>
              View all the registered Users
            </p>
          </CardHeader>
          <CardBody>
            <div className={classes.tableResponsive}>
              <Table className={classes.table}>
                <TableHead className={classes[ "dangerTableHeader" ]}>
                  <TableRow className={classes.tableHeadRow}>
                    <TableCell className={classes.tableCell + " " + classes.tableHeadCell} style={{ maxWidth: "75px" }}>TxnHash</TableCell>
                    <TableCell className={classes.tableCell + " " + classes.tableHeadCell} style={{ maxWidth: "50px" }} >From Address</TableCell>
                    <TableCell className={classes.tableCell + " " + classes.tableHeadCell} style={{ maxWidth: "50px" }} >Name</TableCell>
                    <TableCell className={classes.tableCell + " " + classes.tableHeadCell} style={{ maxWidth: "50px" }} >To Address</TableCell>
                    <TableCell className={classes.tableCell + " " + classes.tableHeadCell} style={{ maxWidth: "50px" }} >Name</TableCell>
                    <TableCell className={classes.tableCell + " " + classes.tableHeadCell} style={{ maxWidth: "75px" }} >Previous TxnHash</TableCell>
                    <TableCell className={classes.tableCell + " " + classes.tableHeadCell} style={{ maxWidth: "40px" }} >Timestamp</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {details}
                </TableBody>
              </Table>
            </div>
          </CardBody>
        </Card>
      );
    }

  }

  

  if (loading) { 
    console.log(web3.utils.toAscii(name));
    return (
      <div>
        <p>Address: { address }</p>
        <p>Name: { web3.utils.hexToUtf8(name).trim() }</p>
        <p>Role: { role }</p>
        <p>Location: {locationx}, {locationy}</p>
      </div>
    );
  }

  return (

    <Grid container style={{ backgroundColor: "white", display: "center", alignItems: "center", maxWidth: 400, justify: "center"}}>
        <Container component="main" maxWidth="xs">
        <CssBaseline />
    <div>
      <form className={classes.root} noValidate autoComplete="off">
      <Grid item xs={12}>
        <TextField id="address" label="Account" variant="outlined" onChange={ handleInputChange }/><br></br>
      </Grid>
        <Button variant="contained" color="primary" onClick={ handleSubmit } >
          Submit
        </Button>   
      </form>
      <Grid item xs={12}>
      <Button variant="contained" color="primary" style={{ width: '200px', margin: '8px' }} onClick={ viewAllUsers } >
          View all Users
      </Button>
      </Grid>
      

      {formSubmitted ? (
              role !== "0" ? (
                <div>
                  <p>Address: { address }</p>
                  <p>Name: {name ? web3.utils.hexToUtf8(name).trim() : 'Unknown'}</p>
                  <p>Role: {role}</p>
                  <p>Location: {locationx}, {locationy}</p>
                </div>
              ) : (
                <p>User not registered</p>
              )
      
    ) : (
      <p></p>

    )}

      </div>
      </Container>
      </Grid>
    
  );
  
} 