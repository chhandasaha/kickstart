const path = require('path');
const solc = require('solc');
//fs-extra is file system with some extra feature
const fs = require('fs-extra');

const buildPath = path.resolve(__dirname, 'build');
// Delete the current build folder.
fs.removeSync(buildPath); 

const campaignPath = path.resolve(__dirname, 'contracts', 'Campaign.sol');
const source = fs.readFileSync(campaignPath, 'utf8');
const output = solc.compile(source, 1).contracts;

//ensures that the directory exist and if it doesn't, then it will create the directory
fs.ensureDirSync(buildPath);

console.log(output);
//loop over the output object and take each contract that exist inside there and write it to a different file
// inside of the build directory
console.log(solc.compile(source, 1));
for (let contract in output) {
    fs.outputJsonSync(
        path.resolve(buildPath, contract.replace(':', '') + '.json'),
        //actual content that we want to write to this json file
        output[contract]
    );
}