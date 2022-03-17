import react, {Component} from "react";
import factory from '../ethereum/factory';

class CampaignIndex extends Component {
    // async componentDidMount(){
    //     //it will retrive an array of addresses of all of our deployed campaigns
    //     const campaigns = await factory.methods.getDeployedCampaigns().call(); 
    //     console.log(campaigns);
    // }
    static async getInitialProps () {
        //it will retrive an array of addresses of all of our deployed campaigns
        const campaigns = await factory.methods.getDeployedCampaigns().call();
        return {campaigns};
    }
    //whenever we make a react component we do have to return some jsx from the render method, else we'll get error
    render () {
        return <div>{this.props.campaigns[0]}</div>
        //return <div>Campaign Index !!!</div>
    }
}
export default CampaignIndex;