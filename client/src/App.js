import React, { useEffect, useState } from "react";
import Web3 from "web3";
import HasanTokenAbi from "./contracts/HASANTOKEN.json";
import TokensaleAbi from "./contracts/HASANTokenSale.json";
import "./App.css";
const App = () => {
  const [loading2, setloading2] = useState(false);

  const [account, setAccount] = useState("");
  const [loading, setLoading] = useState(true);

  const [TokenName, setTokenName] = useState("");
  const [TokenSymbol, setTokenSymbol] = useState("");
  const [TokenDecimal, setTokenDecimal] = useState("");
  const [BalanceOfUser, setBalanceOfUser] = useState(0);
  const [TokenSoldInPresale, setTokenSoldInPresale] = useState(0);
  const [TokenPriceInPresale, setTokenPriceInPresale] = useState(0);
  const [TotalSupplyOfTokens, setTotalSupplyOfTokens] = useState(0);
  const [DevTokenAddressInCrowsale, setDevTokenAddressInCrowsale] = useState("");
  const [inputfield, setinputfield] = useState(0);
  const [presalecontractinstance, setpresalecontractinstance] = useState({});

  // this is for load web3 for us
  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  };
  // this is for load blockchain data
  const loadBlockchainData = async () => {
    setLoading(true);
    if (typeof window.ethereum == "undefined") {
      return;
    }
    const web3 = new Web3(window.ethereum);

    const accounts = await web3.eth.getAccounts();

    if (accounts.length === 0) {
      return;
    }
    setAccount(accounts[0]);
    console.log(accounts[0]);
    const networkId = await web3.eth.net.getId();
    console.log(networkId);
    const networkData= HasanTokenAbi.networks[networkId];
    console.log(networkData.address);
    if ( networkData  ) { //networkId === 3
      //0x4311bad41f98ee9920dec4395c4e13e442afdea0 // address of token
      const hasantokencontract = new web3.eth.Contract(
        HasanTokenAbi.abi,
        networkData.address //"0xb3bc4f03e84420f05e17d1165720cd1592e53cbe"
      );
      console.log(hasantokencontract);
      //name
      const nameoftoken = await hasantokencontract.methods.name().call();
      console.log(nameoftoken);
      // decimal
      const decimaloftoken = await hasantokencontract.methods.decimals().call();
      console.log(decimaloftoken);

      // symbol
      const symboloftoken = await hasantokencontract.methods.symbol().call();
      console.log(symboloftoken);

      // totalsupply
      const totalsupplyoftoken = await hasantokencontract.methods
        .totalSupply()
        .call();
      const totalsupplyoftokenindecimals = await web3.utils.fromWei(
        totalsupplyoftoken,
        "ether"
      );
      console.log(totalsupplyoftokenindecimals);

      const balanceofuser = await hasantokencontract.methods
        .balanceOf(accounts[0])
        .call();
      const balanceofuserinwei = await web3.utils.fromWei(
        balanceofuser,
        "ether"
      );
      console.log(balanceofuserinwei);
      const networkId = await web3.eth.net.getId();
      const networkData1=  TokensaleAbi.networks[networkId];
      //crowd sale contract address
      //0x0a588dff04a280ef9e55aea9d7ce41c0484acf58
      const presalecontract = new web3.eth.Contract(
        TokensaleAbi.abi,
         networkData1.address
      );
      setpresalecontractinstance(presalecontract);
      const devtokeninpresale = await presalecontract.methods
        .tokenContract()
        .call();
      console.log(devtokeninpresale);
      const tokenpriceofpresale = await presalecontract.methods
        .tokenPrice()
        .call();
      console.log(tokenpriceofpresale);
      const tokenpriceofpresaleinether = await web3.utils.fromWei(
        tokenpriceofpresale,
        "ether"
      );
      console.log(tokenpriceofpresaleinether);

      const totalsoldofpresale = await presalecontract.methods
        .tokensSold()
        .call();
      const totalsoldofpresaleinether = await web3.utils.fromWei(
        totalsoldofpresale,
        "ether"
      );
      console.log(totalsoldofpresaleinether);

      setTokenName(nameoftoken);
      setTokenDecimal(decimaloftoken);
      setTokenSymbol(symboloftoken);
      setBalanceOfUser(balanceofuserinwei);
      setTokenSoldInPresale(totalsoldofpresaleinether);
      setTotalSupplyOfTokens(totalsupplyoftokenindecimals);
      setTokenPriceInPresale(tokenpriceofpresaleinether);
      setDevTokenAddressInCrowsale(devtokeninpresale);
      setLoading(false);
    } else {
      window.alert("you are not ropstan  network.");
      setloading2(true);
    }
  };

  const onsubmit = async () => {
    await onsendbuytransaction();
  };

  const onsendbuytransaction = async () => {
    const web3 = new Web3(window.ethereum);

    await presalecontractinstance.methods
      .buyTokens()
      .send({ from: account, value: web3.utils.toWei(inputfield, "ether") });
  };

  useEffect(() => {
    loadWeb3();
    loadBlockchainData();
  }, []);

  if (loading === true) {
    return (
      <p className="text-center">
        Loading...{loading2 ? <div>loading....</div> : ""}
      </p>
    );
  } else {
    return (
      <div className="App-header">
        
          <div className="header">
            <p>Wallet Address</p>
            <ul className=" ">
              <li className="">{account}</li>
            </ul>
          </div>

          <h1>Crowdsale</h1>
           <div className="container">
          <div className="group1" >
            <h4>Token Name : {TokenName}</h4>
            <h4>Token Symbol : {TokenSymbol}</h4>
            <h4> Decimal : {TokenDecimal}</h4>
          </div>
 
          <div className="group1">
            <h4> Balance Of User : {BalanceOfUser} HT</h4>
            <h4> Total Supply Tokens : {TotalSupplyOfTokens} HT</h4>
          </div>
       
          <div className="group1" >
            <h4>Token Address In Crowsale : {DevTokenAddressInCrowsale} </h4> 
          </div>
          <div className="group1"> 
            <h4> Token Price: {TokenPriceInPresale} ether</h4>
            <h4> Token Sold In Presale : {TokenSoldInPresale} per ether</h4>
          </div>
        
          </div>
          <div className="button">
            <input
              type="number"
              placeholder="input the eth amount"
              value={inputfield}
              onChange={(e) => setinputfield(e.target.value)}
              required
              className="input"
              
            />
            <button
              style={{ backgroundColor: "lightblue" }}
              onClick={onsubmit}
              disabled={!inputfield}
            >
              Buy TOken
            </button>
          </div>
        </div>
       
    );
  }
};

export default App;
