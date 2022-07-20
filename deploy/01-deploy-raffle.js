const { getNamedAccounts, deployments, network, run } = require("hardhat");
const {
  networkConfig,
  developmentChains,
} = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deployer } = await getNamedAccounts();
  const { deploy, log } = deployments;
  const chainId = network.config.chainId;
  let vrfCoordinatorV2, subscriptionId;

  if (developmentChains.includes(network.name)) {
    const vrfCoordinatorV2Mock = await ethers.getContract(
      "VRFCoordinatorV2Mock"
    );
    vrfCoordinatorV2 = vrfCoordinatorV2Mock.address;
    const transactionResponse = await vrfCoordinatorV2Mock.createSubscription();
    const transactionReceipt = await transactionResponse.wait(1);
    subscriptionId = transactionReceipt.events[0].args.subId;
  } else {
    vrfCoordinatorV2 = networkConfig[chainId]["vrfCoordinatorV2"];
    subscriptionId = networkConfig[chainId]["subscriptionId"];
  }

  const entranceFee = networkConfig[chainId]["entranceFee"];
  const gasLane = networkConfig[chainId]["gasLane"];
  const interval = networkConfig[chainId]["interval"];
  const callbackGasLimit = networkConfig[chainId]["callbackGasLimit"];

  const args = [
    vrfCoordinatorV2,
    subscriptionId,
    gasLane,
    interval,
    entranceFee,
    callbackGasLimit,
  ];
  const raffle = await deploy("Raffle", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });

  console.log(process.env.ETHERSCAN_API_KEY);
  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    log("Verifying Raffle contract on Etherscan...");
    //verify checks, either the contract is already verified and published on the Etherscan/testnet or not
    await verify(raffle.address, args);
  }
  log("----------------------------------------------------------");
};

module.exports.tags = ["all", "raffle"];
