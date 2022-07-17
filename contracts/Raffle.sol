// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
// import "@chainlink/contracts/src/v0.8/interfaces/KeeperCompatibleInterface.sol";

error Raffle__SendMoreToEnterRaffle();

contract Raffle is VRFConsumerBaseV2 {
  /* State variables */
  // Chainlink VRF Variables
  VRFCoordinatorV2Interface private immutable i_vrfCoordinator; //this will hold the coordinator value
  uint64 private immutable i_subscriptionId;
  bytes32 private immutable i_gasLane;
  uint32 private immutable i_callbackGasLimit;
  uint16 private constant REQUEST_CONFIRMATIONS = 3;
  uint32 private constant NUM_WORDS = 1;

  // Lottery Variables
  uint256 private immutable i_interval;
  uint256 private s_lastTimeStamp;
  address private s_recentWinner;
  uint256 private i_entranceFee;
  address payable[] private s_players;
  // RaffleState private s_raffleState;

  /* Events */
  event RequestedRaffleWinner(uint256 indexed requestId);
  event RaffleEnter(address indexed player);
  event WinnerPicked(address indexed player);

  constructor(
    address vrfCoordinatorV2,
    uint64 subscriptionId,
    bytes32 gasLane, // The gas lane key hash value, which is the maximum gas price you are willing to pay for a request in wei.
    uint256 interval,
    uint256 entranceFee,
    uint32 callbackGasLimit
  ) VRFConsumerBaseV2(vrfCoordinatorV2) {
    i_entranceFee = entranceFee;
    i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
    i_gasLane = gasLane;
    i_interval = interval;
    i_subscriptionId = subscriptionId;
    i_entranceFee = entranceFee;
    // s_raffleState = RaffleState.OPEN;
    s_lastTimeStamp = block.timestamp;
    i_callbackGasLimit = callbackGasLimit;
  }

  function enterRaffle() public payable {
    // require(msg.value >= i_entranceFee, "Not enough value sent");
    // require(s_raffleState == RaffleState.OPEN, "Raffle is not open");
    if (msg.value < i_entranceFee) {
      revert Raffle__SendMoreToEnterRaffle();
    }
  }

  function requestRandomWinner() external {
    uint256 requestId = i_vrfCoordinator.requestRandomWords(
      i_gasLane,
      i_subscriptionId,
      REQUEST_CONFIRMATIONS,
      i_callbackGasLimit,
      NUM_WORDS
    );
  }

  function fulfillRandomWords(
    uint256, /* requestId */
    uint256[] memory randomWords
  ) internal override {}

  /** Getter Functions */

  function getNumWords() public pure returns (uint256) {
    // return NUM_WORDS;
  }
}
