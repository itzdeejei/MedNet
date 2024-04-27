import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Loader from '../../components/Loader';
import Transactions from '../../build/Transactions.json';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import styles from "../../main_dashboard/assets/jss/material-dashboard-react/components/tableStyle.js";
import CardBody from '../../main_dashboard/components/Card/CardBody';
import CardHeader from '../../main_dashboard/components/Card/CardHeader';
import Card from '../../main_dashboard/components/Card/Card';

const useStyles = makeStyles(styles);

export default function ViewTransactions(props) {
  const classes = useStyles();
  const [account] = useState(props.location.query.account);
  const [txnAddress] = useState(props.location.query.address);
  const [web3] = useState(props.location.query.web3);
  const [supplyChain] = useState(props.location.query.supplyChain);
  const [details, setDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [names, setNames] = useState([]);

  useEffect(() => {
    getTxnData();
  }); 

  async function getTxnData() {
    try {
      const transaction = new web3.eth.Contract(Transactions.abi, txnAddress);
      let txns = await transaction.methods.getAllTransactions().call({ from: account });
      const txnsList = await Promise.all(txns.map(async (data) => {
        let name = data[1];
        const test = await supplyChain.methods.getUserInfo(name).call();
        const trimmedName = web3.utils.hexToUtf8(test.name).trim();

        let name1 = data[2];
        const test1 = await supplyChain.methods.getUserInfo(name1).call();
        const trimmedName1 = web3.utils.hexToUtf8(test1.name).trim();

        setNames(prevNames => [...prevNames, { name: trimmedName, name1: trimmedName1 }]);

        return (
          <TableRow key={data[0]} className={classes.tableBodyRow}>
            <TableCell multiline className={classes.tableCell} style={{ maxWidth: "75px" }}>{data[0]}</TableCell>
            <TableCell multiline className={classes.tableCell} style={{ maxWidth: "50px" }}>{data[1]}</TableCell>
            <TableCell multiline className={classes.tableCell} style={{ maxWidth: "50px" }}>{trimmedName}</TableCell>
            <TableCell multiline className={classes.tableCell} style={{ maxWidth: "50px" }}>{data[2]}</TableCell>
            <TableCell multiline className={classes.tableCell} style={{ maxWidth: "50px" }}>{trimmedName1}</TableCell>
            <TableCell multiline className={classes.tableCell} style={{ maxWidth: "75px" }}>{data[3]}</TableCell>
            <TableCell multiline className={classes.tableCell} style={{ maxWidth: "40px" }}>{new Date(data[6] * 1000).toString()}</TableCell>
          </TableRow>
        );
      }));


      setDetails(txnsList);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching transaction data:', error);
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader color="danger">
        <h4 className={classes.cardTitleWhite}>Transactions List</h4>
        <p className={classes.cardCategoryWhite}>
          View all transactions for this product
        </p>
      </CardHeader>
      <CardBody>
        {loading ? (
          <Loader />
        ) : (
          <div className={classes.tableResponsive}>
            <Table className={classes.table}>
              <TableHead className={classes["dangerTableHeader"]}>
                <TableRow className={classes.tableHeadRow}>
                  <TableCell className={classes.tableCell + " " + classes.tableHeadCell} style={{ maxWidth: "75px" }}>TxnHash</TableCell>
                  <TableCell className={classes.tableCell + " " + classes.tableHeadCell} style={{ maxWidth: "50px" }}>From Address</TableCell>
                  <TableCell className={classes.tableCell + " " + classes.tableHeadCell} style={{ maxWidth: "50px" }}>Name</TableCell>
                  <TableCell className={classes.tableCell + " " + classes.tableHeadCell} style={{ maxWidth: "50px" }}>To Address</TableCell>
                  <TableCell className={classes.tableCell + " " + classes.tableHeadCell} style={{ maxWidth: "50px" }}>Name</TableCell>
                  <TableCell className={classes.tableCell + " " + classes.tableHeadCell} style={{ maxWidth: "75px" }}>Previous TxnHash</TableCell>
                  <TableCell className={classes.tableCell + " " + classes.tableHeadCell} style={{ maxWidth: "40px" }}>Timestamp</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {details}
              </TableBody>
            </Table>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
