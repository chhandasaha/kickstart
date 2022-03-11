import Web3 from 'web3';

//assuming metamask has already injected a web3 instance onto the page
const web3 = new Web3(window.web3.currentProvider);

export default web3;