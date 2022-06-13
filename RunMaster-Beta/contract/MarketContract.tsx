import Web3 from "web3";
import Market from './Market.json'
const contractAddress = Market.address;
const contractAbi = Market.abi;
const web3 = new Web3(new 
    Web3.providers.HttpProvider(Market.rpc));
    
export default new web3.eth.Contract(contractAbi,contractAddress)