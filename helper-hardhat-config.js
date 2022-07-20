const { ethers } = require("hardhat");

//Almost the things that our Contract constructor need, are all mentioned here
const networkConfig = {
  4: {
    name: "rinkeby",
    vrfCoordinatorV2: "0x8a753747a1fa494ec906ce90e9f37563a8af630e",
    entranceFee: ethers.utils.parseEther("0.01"),
    gasLane:
      "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc", //got from the chain.link.vrf.... under rinkeby section
    interval: "30",
    subscriptionId: "8807", // 0.1 ETH
    callbackGasLimit: "500000", // 500,000 gas
  },
  31337: {
    name: "hardhat",
    entranceFee: ethers.utils.parseEther("0.01"),
    gasLane:
      "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc",
    interval: "30",
    subscriptionId: "0", // 0.1 ETH
    callbackGasLimit: "500000", // 500,000 gas
  },
};

const developmentChains = ["hardhat", "localhost"];

module.exports = {
  networkConfig,
  developmentChains,
};
