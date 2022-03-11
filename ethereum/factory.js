import web3 from'./web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
    JSON.parse(CampaignFactory.interface),
    '0x3015073b0BDe213DaE986510395Eb2bBDAbbD10E'
);

export default instance;
