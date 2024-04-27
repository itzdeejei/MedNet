import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import Medicine from "../../build/Medicine.json";
import RawMaterial from "../../build/RawMaterial.json";
import { Link } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  form: {
    marginTop: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  textField: {
    marginBottom: theme.spacing(2),
  },
  result: {
    marginTop: theme.spacing(2),
  },
}));

export default function Verify(props) {
  const classes = useStyles();
  const [productID, setProductID] = useState('')
  const [verificationResult, setVerificationResult] = useState('');
  const [details, setDetails] = useState(null);
  const { account, web3, supplyChain } = props;

  const handleVerification = async () => {
    try {
      let medicine = new web3.eth.Contract(Medicine.abi, productID);
      let data = await medicine.methods.getMedicineInfo().call();



      if (productID) {
        setVerificationResult('Product is authentic!');
        var addr = String(data[2]);
        let rawMaterial = new web3.eth.Contract(RawMaterial.abi, addr);
        let rdata = await rawMaterial.methods.getSuppliedRawMaterials().call();
        
        setDetails(
          <div>
          <p>
            Medicine Transaction contract address:{' '}
            <Link
              to={{
                pathname: `/customer/view-transaction/${data[7]}`,
                query: { address: data[7], raddress: rdata[6], account: account, web3: web3, supplyChain: supplyChain },
              }}
            >
              {data[7]}
            </Link>
          </p>
          </div>
          
          
        );
      } else {
        setVerificationResult('Product ID is empty. Please enter a valid ID.');
        setDetails(null);
      }
    } catch (error) {
      console.error('Error verifying product:', error.message);
      setVerificationResult('Product is fake!');
      setDetails(null);
    }
  };


  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.form}>
        <Typography variant="h4" gutterBottom>
          Product Verification
        </Typography>
        <TextField
          className={classes.textField}
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="productID"
          label="Product ID"
          name="productID"
          autoFocus
          value={productID}
          onChange={(e) => setProductID(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleVerification}
        >
          Verify
        </Button>
        {verificationResult && (
          <Typography className={classes.result} variant="body1">
            {verificationResult}
          </Typography>
        )}
        {details}
      </div>
    </Container>
  );
}
