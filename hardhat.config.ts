import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-ethers";

const config: HardhatUserConfig = {
	solidity: "0.8.18",
	paths: {
		tests: "./__tests__",
	},
	networks: {
		hardhat: {
			chainId: 1337,
			gas: "auto",
			gasPrice: "auto",
			allowUnlimitedContractSize: true
		},
		localhost: {
			chainId: 1337,
			gas: "auto",
			gasPrice: "auto",
			allowUnlimitedContractSize: true
		}
	}
};

export default config;
