// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

import "@thirdweb-dev/contracts/base/ERC1155LazyMint.sol";

contract HogwartsContract is ERC1155LazyMint {
    constructor(
        string memory _name,
        string memory _symbol
    ) ERC1155LazyMint(_name, _symbol, msg.sender, 0) {}

    uint256 public constant GRYFFINDOR = 1;
    uint256 public constant HUFFLEPUFF = 2;
    uint256 public constant RAVENCLAW = 3;
    uint256 public constant SLYTHERIN = 4;
    uint256 public constant MAX_CHOICES = 4;
    uint256 public constant POINTS_PER_WIN = 10;

    mapping(address => uint256) public chosenTeam;
    mapping(uint256 => uint256) public teamPoints;

    function mintTeam(
        address _claimer,
        uint256 _tokenId,
        bytes memory data
    ) public {
        require(
            _tokenId >= GRYFFINDOR && _tokenId <= MAX_CHOICES,
            "Invalid Hogwarts House"
        );
        require(chosenTeam[msg.sender] == 0, "Already chosen a Hogwarts House");
        _mint(_claimer, _tokenId, 1, data);
        chosenTeam[msg.sender] = _tokenId;
    }

    function addPoints(uint256 teamId, bool answeredCorrectly) public {
        require(
            teamId >= GRYFFINDOR && teamId <= MAX_CHOICES,
            "Invalid Hogwarts House"
        );
        require(chosenTeam[msg.sender] == teamId, "Not on the Hogwarts house");
        require(answeredCorrectly == true, "Answered incorrectly");
        teamPoints[teamId] += POINTS_PER_WIN;
    }
}
