import Web3 from "web3";
import Nft from './Nft.json'
const contractAddress = Nft.address
const contractAbi = Nft.abi;
const web3 = new Web3(new 
    Web3.providers.HttpProvider(Nft.rpc));

export default new web3.eth.Contract(contractAbi,contractAddress)