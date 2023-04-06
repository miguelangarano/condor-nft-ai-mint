import { config as dotEnvConfig } from "dotenv";
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-ethers";
dotEnvConfig();
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
			allowUnlimitedContractSize: true,
		},
		localhost: {
			chainId: 1337,
			gas: "auto",
			gasPrice: "auto",
			allowUnlimitedContractSize: true,
		},
		polygon_mumbai: {
			chainId: 80001,
			url: "https://rpc-mumbai.maticvigil.com",
			accounts: [process.env.PRIVATE_KEY ?? ""],
		},
	},
};

export default config;
