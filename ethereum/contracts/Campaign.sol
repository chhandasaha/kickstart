// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.6.0<0.9.0;

contract CampaignFactory {
    address[] public deployedCampaigns;

    function createCampaign(uint minimum) public {
        address newCampaign =  address(new Campaign(minimum, msg.sender));
        deployedCampaigns.push(newCampaign);
    }

    function getDeployedCampaigns() public view returns(address[] memory){
        return deployedCampaigns;

    }
}

contract Campaign {
    struct Request {
        string description;
        uint value;
        address recipient;
        bool complete;
        uint approvalCount;
        //mapping of the address who have provided approvals of the Request
        mapping(address => bool) approvals;

    }
    Request[] public requests;
    address public manager;
    uint public minimumContribution;
    mapping(address => bool) public approvers;
    uint public approvarsCount;

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    constructor( uint minimum, address creator) public {
        manager = creator;
        minimumContribution = minimum;

    }
    function contribute() public payable {
        require(msg.value > minimumContribution);
        approvers[msg.sender] = true;
        approvarsCount++;
    }

    // function createRequest( string memory description, uint value, address recipient) public restricted{
    //     Request memory newReq = Request({
    //         description: description,
    //         value: value,
    //         recipient: recipient,
    //         complete: false,
    //         approvalCount: 0
    //     });
    //     //same as the previous newReq variable
    //     //Request(description, value, requests, false);
    //     requests.push(newReq);
    // }

    function createRequest(uint256 value) public {
        Request storage newRequest = requests.push();
        newRequest.value = value;
    }
    function approveRequest(uint index) public {
        Request storage request = requests[index];

        // approver should donate first
        require(approvers[msg.sender]);
        //contributor can approve only once
        require(!request.approvals[msg.sender]);

        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }
    function  finalizeRequest(uint index) public restricted {
        Request storage request = requests[index];
        // more than half of the approvers should approve to finalize or release a request
        require(request.approvalCount >(approvarsCount/2));
        require(!request.complete);
        payable(request.recipient).transfer(request.value);
        request.complete = true;
    }
}