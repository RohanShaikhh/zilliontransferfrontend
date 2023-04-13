import { useState, ChangeEvent, useMemo } from "react";
import "./App.css";
import { Container, Row, Col } from "react-bootstrap";
import axios from 'axios'
import Swal from 'sweetalert2'

function App() {
  const [price, setPrice] = useState("");
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setPrice(value);
  };
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-right',
    iconColor: 'white',
    customClass: {
      popup: 'colored-toast'
    },
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true
  })
  const memoizedValue = useMemo(() => {
    return price;
  }, [price]);

  const memoizedValueAddress = useMemo(() => {
    return address;
  }, [address]);

  const memoizedValueIsLoading = useMemo(() => {
    return isLoading
  },[isLoading]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setAddress(event.target.value);
  };
  const walletAddressRegExp = /^(0x)?[0-9a-fA-F]{40}$/;
  const regexDecimal = /^(?!0*(\.0+)?$)\d+(\.\d+)?$/;
  const sendData =async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("run")
    const isWalletAddress = walletAddressRegExp.test(memoizedValueAddress);
    const isAmount = regexDecimal.test(memoizedValue)
    if(!isWalletAddress){
      await Toast.fire({
        icon: 'error',
        title: 'Invalid wallet address'
      })
      return
    }
    if(!isAmount){
      await Toast.fire({
        icon: 'error',
        title: 'Please enter a valid amount'
      })
      return
    }
    if(memoizedValue === ""){
      await Toast.fire({
        icon: 'error',
        title: 'Fill the amount first'
      })
      return
    }
    setIsLoading(true);
    axios.post('http://104.248.130.142:8000/transfertokenzax', { 
      walletAddress: memoizedValueAddress,
      token: memoizedValue
    })
    .then(async response => {
      await Toast.fire({
        icon: 'success',
        title: 'Success'
      })
      setIsLoading(false);
      setPrice("")
      // Your code to handle the response goes here
    })
    .catch(async error => {
      await Toast.fire({
        icon: 'error',
        title: 'Insufficient funds'
      })
      setIsLoading(false);
      // Your code to handle the error goes here
    });
    
  };

  return (
    <div className="container">
      <div className="falling-object">
        <img
          style={{ height: "100px", width: "150px" }}
          src="https://zillionxo.io/assets/images/zillion%20AAkar%20xo.png"
          alt="zillion"
        ></img>
      </div>
      <Container>
        <Row>
          <Col xs={12} md={4}></Col>
          <Col xs={12} md={4}>
            <form onSubmit={sendData}>
              <div
                style={{
                  display: "flex",
                  position: "relative",
                  marginTop: "20px",
                }}
              >
                <input
                  type="text"
                  id="walletaddress"
                  name="name"
                  className="text-input"
                  value={memoizedValueAddress}
                  onChange={handleInputChange}
                  placeholder="Enter Recipient Address"
                />
              </div>
              <div
                style={{
                  display: "flex",
                  position: "relative",
                  marginTop: "10px",
                }}
              >
                <input
                  type="text"
                  id="amount"
                  name="name"
                  className="text-input"
                  value={memoizedValue}
                  onChange={handleChange}
                  placeholder="Enter USD Amount"
                />
              </div>
              <div
                style={{
                  display: "flex",
                  marginTop: "30px",
                  position: "relative",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <button disabled={memoizedValueIsLoading} type="submit" className="submit-button">
                  Send
                </button>
              </div>
            </form>
          </Col>
          <Col xs={12} md={4}></Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
