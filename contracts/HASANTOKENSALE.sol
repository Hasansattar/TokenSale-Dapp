// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


import "./HASANTOKEN.sol";

contract HASANTokenSale {

    address public admin;             
    HASANTOKEN public tokenContract;   
    uint256 public tokenPrice;          
    uint256 public tokensSold;
    event Sell(address _buyer,uint256 _amount);  

    constructor(address _tokenContractAddress, uint256 _tokenPrice) {
        //assign an admin
        admin =msg.sender;      
        //Token contract
        tokenContract = HASANTOKEN(_tokenContractAddress);   
        //Token Price\
        tokenPrice = _tokenPrice;    
    }

    

    //Buy Tokens
    function buyTokens() public payable {
          uint256    amount =msg.value / tokenPrice;
            //require that the contract has enough tokens or not
        require(tokenContract.balanceOf(address(this)) >=  amount*10**18 ,'smart contract dont hold enough tokens');
        
        // transfer the tokens to user
        tokenContract.transfer(msg.sender, amount*10**18 );
        //keep track of tokensSold
          tokensSold +=  amount*10**18 ;
        //triger Sell Event
       emit Sell(msg.sender, amount*10**18 );
 

    }

    //ending Token DappTokenSale
    function endSale() public {
        //Require admin ,check if admin has clicked the function
        require(msg.sender == admin,'you are not admin');
        //Transfer remaining dapp tokens to admin
        tokenContract.transfer(admin, tokenContract.balanceOf(address(this)));
        //Destroy contract
        selfdestruct(payable(admin));
    }
}
