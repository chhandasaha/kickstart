import web3 from'./web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
    JSON.parse(CampaignFactory.interface),
    //'0x3015073b0BDe213DaE986510395Eb2bBDAbbD10E'
    '0x4CC07BEE0C7b40f9C30379CD00656dFF744a4e24'
);

export default instance;
