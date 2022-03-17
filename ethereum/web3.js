import Web3 from 'web3';

//assuming metamask has already injected a web3 instance onto the page
// const web3 = new Web3(window.web3.currentProvider);
// export default web3;

let web3;
//typeof is used to verify whether a variable is defined or no
if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
  // We are in the browser and metamask is running.
   window.ethereum.request({ method: "eth_requestAccounts" });
  // Web3 is constractor
   //web3 = new Web3(window.ethereum);
  web3 = new Web3(window.web3.currentProvider);
} else {
  // We are on the server *OR* the user is not running metamask
  const provider = new Web3.providers.HttpProvider(
    'https://goerli.infura.io/v3/c54545926b944624adb5d11e89bb63e0'
  );
  web3 = new Web3(provider);
}
 
export default web3;