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
    });
    it ('marks caller as the campaign manager', async ()=> {
        const manager = await campaign.methods.manager().call();
        assert.equal(accounts[0], manager);
    });
    it ('allows people to contribute money and marks them as approvers', async ()=> {
        await campaign.methods.contribute().send({
            value: '200', 
            from: accounts[1]
        });
        //approvers function allows us to access the mapping, we'll pass a key and this will return the value that
        //corresponds to that key.. ".call()" bec
        const isContributor = await campaign.methods.approvers(accounts[1]).call();
        assert(isContributor);
    });
    it ('requires a minimum contribution', async() => {
        try{
            await campaign.methods.contribute().send({
                value: '5',
                from: accounts[1]
            });
            assert(false)
        }catch (err) {
            assert(err);
        }
    });
    it ('allows a manager to make a payment request ', async () => {
        await campaign.methods
        .createRequest('Buy batteries', '100', accounts[1])
        .send({
            from: accounts[0],
            gas: '1000000'
        });
        const request = await campaign.methods.requests(0).call();
        assert.equal('Buy batteries', request.description);
    });
    it('processes request', async () => {
        await campaign.methods.contribute().send({
            from: accounts[0],
            value: web3.utils.toWei('10', 'ether')
        });
        await campaign.methods
        //10 ether we sent into the contract, 5 of it will be send to other address
        .createRequest('A', web3.utils.toWei('5', 'ether'), accounts[1])
        .send({ from: accounts[0], gas: '1000000'});

        //before finalizing, vote on it
        await campaign.methods.approveRequest(0).send({
            from: accounts[0], gas: '1000000'
        });
        //only the manager has the ability to finalize the request
        await campaign.methods.finalizeRequest(0).send({
            from: accounts[0], gas: '1000000'
        });
        //retrive the balance accounts[1] has
        //this will return a string, we need to turn it into ether and then a number for comparison
        let balance = await web3.eth.getBalance(accounts[1]);
        balance = web3.utils.fromWei(balance, 'ether');
        //parseFloat takes a string and turns it into a decimal number
        balance = parseFloat(balance);
        console.log(balance);
        assert(balance > 104);

    });
});