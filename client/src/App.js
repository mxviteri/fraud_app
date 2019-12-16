import React, { useState } from 'react';
import { 
  Container,
  TextField, 
  Button, 
  Select, 
  MenuItem,
  CircularProgress 
} from '@material-ui/core'
import styled from 'styled-components'
import axios from 'axios'

const Long = styled.div`
  display: flex;
  flex-direction: column;
`

const Progress = styled(CircularProgress)`
  color: ${props => props.value > 75 ? 'red' : 'green'} !important;
  height: 100px !important;
  width: 100px !important;
`

const Fraud = styled.div`
  width: max-content;
  margin: 0 auto;
  height: 200px;
  margin-top: 20px;
`

const Actions = styled.div`
  display: flex;
  justify-content: space-between;
`

const ProgressNumber = styled.span`
  display: block;
  width: 100%;
  text-align: center;
  transform: translateY(-60px);
`

function App() {
  const [amount, setAmount] = useState('')
  const [product, setProduct] = useState('W')
  const [card4, setCard4] = useState('visa')
  const [card6, setCard6] = useState('credit')
  const [cardNumber, setCardNumber] = useState('')
  const [email, setEmail] = useState('')
  const [fraud, setFraud] = useState(null)

  const submitScore = (e) => {
    e.preventDefault()
    const payload = { amount, product, card4, card6, email }
    
    axios.post('http://localhost:5000/api/fraud', payload)
    .then(response => setFraud(response.data))
    .catch(error => {
      console.log('error fetching fraud score')
    });
  }

  const clearOutput = () => {
    setAmount('')
    setProduct('W')
    setCard4('visa')
    setCard6('credit')
    setCardNumber('')
    setEmail('')
    setFraud(null)
  }

  return (
    <div className="App">
      <Container maxWidth="md">
        <h1>Fraud App</h1>
        <form onSubmit={submitScore}>
          <Long>
            <TextField
              id="amount"
              label="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              variant="outlined" />
            <Select
              variant="outlined"
              id="product"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
            >
              <MenuItem value="W">W</MenuItem>
              <MenuItem value="H">H</MenuItem>
              <MenuItem value="C">C</MenuItem>
              <MenuItem value="S">S</MenuItem>
              <MenuItem value="R">R</MenuItem>
            </Select>
            <br />
            <TextField
              id="cardnumber"
              label="4111 1111 1111 1111"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              variant="outlined" />
            <Select
              variant="outlined"
              id="card4"
              value={card4}
              onChange={(e) => setCard4(e.target.value)}
            >
              <MenuItem value="visa">Visa</MenuItem>
              <MenuItem value="mastercard">Mastercard</MenuItem>
              <MenuItem value="american express">American Express</MenuItem>
              <MenuItem value="discover">Discover</MenuItem>
            </Select>
            <Select
              variant="outlined"
              id="card6"
              value={card6}
              onChange={(e) => setCard6(e.target.value)}
            >
              <MenuItem value="credit">Credit</MenuItem>
              <MenuItem value="debit">Debit</MenuItem>
              <MenuItem value="credit or debit">Charge Card</MenuItem>
            </Select>
            <br />
            <TextField
              id="email"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant="outlined" />
          </Long>
          <Fraud>
            {fraud && (
              <div>
                <p style={{ textAlign: 'center' }}>{fraud.type}</p>
                <Progress variant="static" value={fraud.score[0] * 100} />
                <ProgressNumber>{fraud.score[0] * 100}</ProgressNumber>
              </div>
            )}
          </Fraud>
          <Actions>
            <Button type="submit" variant="outlined">Check Score</Button>
            <Button variant="outlined" onClick={clearOutput}>Clear Output</Button>
          </Actions>
        </form>
      </Container>
    </div>
  );
}

export default App;
