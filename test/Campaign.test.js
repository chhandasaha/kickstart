//Test file to test our campaign
// import * as data from "../ethereum/build/CampaignFactory.json"
// import * as data from "../ethereum/build/Campaign.json"
const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());
const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts;
let factory; // reference to the deployed instance of the factory
let campaignAddress;
let campaign;

beforeEach (async () => {
    accounts =await web3.eth.getAccounts();
    //use factory to create instance of the campaign and assign it to the campaign variable,
    // take address of it, and assign tp campaignAddress variable
    factory =await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({ data: compiledFactory.bytecode})
    .send({ from: accounts[0], gas: '1000000'});

    await factory.methods.createCampaign('100').send({ from: accounts[0], gas: '1000000'});
    const addresses = await factory.methods.getDeployedCampaigns().call();
    campaignAddress = addresses[0];
    campaign = await new web3.eth.Contract(
        JSON.parse(compiledCampaign.interface),
        campaignAddress
    );
});

describe('Campaigns', () => {
    it('deploys a factory and a campaign', () => {
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    } )
});