/* eslint-disable no-undef */
const HASANTOKEN = artifacts.require("./HASANTOKEN");
const HASANTOKENSALE = artifacts.require("./HASANTOKENSALE");

module.exports = async function (deployer) {
 await deployer.deploy(HASANTOKEN);
  
 const token=await HASANTOKEN.deployed();
 //token Price is 0.001
 var tokenPrice=1000000000000000;
 
 await deployer.deploy(HASANTOKENSALE,token.address,tokenPrice);
};
