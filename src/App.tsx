import { ExternalProvider } from "@ethersproject/providers";
import { ethers } from "ethers";
import { Component, createSignal, onMount } from "solid-js";
import BottomBar from "./components/bottom-bar";
import Home from "./components/home";
import Mint from "./components/mint";
import Prompt from "./components/prompt";
import Success from "./components/success";
import TopBar from "./components/top-bar";
import config from "./contract-config.json";
import NFT from "./abis/NFT.json";
import { useNavigate } from "@solidjs/router";

declare global {
	interface Window {
		ethereum?: ExternalProvider;
	}
}

const App: Component = () => {
	const navigate = useNavigate();
	const [currentAccount, setCurrentAccount] = createSignal("");
	const [currentStep, setCurrentStep] = createSignal<number>(0);
	const [nextStepEnabled, setNextStepEnabled] = createSignal(true);
	const [imageData, setImageData] = createSignal<{
		title: string;
		prompt: string;
		image: string;
	}>({ title: "", prompt: "", image: "" });
	const [currentProvider, setCurrentProvider] =
		createSignal<ethers.providers.Web3Provider>();
	const [tokensAmount, setTokensAmount] = createSignal(0);
	const [allWallets, setAllWallets] = createSignal<string[]>([]);

	const connectToDefaultWallet = async () => {
		if (window.ethereum) {
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			console.log(provider);
			setCurrentProvider(provider);
			const accounts = await window.ethereum.request({
				method: "eth_requestAccounts",
			});
			const account = await provider.getSigner().getAddress();
			console.log("account", account, accounts);
			setAllWallets(accounts);
			if (account) {
				setCurrentAccount(account);
			}
			if (account && provider) {
				loadBlockchainData(account, provider);
			}
		}
	};

	onMount(() => {
		connectToDefaultWallet();
	});

	const loadBlockchainData = async (
		currentWalletAddress: string,
		provider: ethers.providers.Web3Provider
	) => {
		const network = await provider.getNetwork();
		const nft = new ethers.Contract(
			config[network.chainId].nft.address,
			NFT,
			provider
		);
		const tokensAmount = await nft.balanceOf(currentWalletAddress);
		setTokensAmount(tokensAmount.toNumber());
	};

	const renderCurrentStepComponent = () => {
		switch (currentStep()) {
			case 0:
				return (
					<Home
						account={currentAccount()}
						connect={connectToDefaultWallet}
					/>
				);
			case 1:
				return (
					<Prompt
						enableNextStep={() => setNextStepEnabled(true)}
						setImageData={(
							title: string,
							prompt: string,
							image: string
						) => setImageData({ title, prompt, image })}
					/>
				);
			case 2:
				return (
					<Mint
						enableNextStep={() => setNextStepEnabled(true)}
						imageData={imageData()}
						provider={currentProvider()}
						nextStep={() => setCurrentStep(currentStep() + 1)}
					/>
				);
			case 3:
				return <Success />;
		}
	};

	return (
		<div class="w-screen h-screen bg-gray-800 flex-row lg:p-10 relative">
			<TopBar
				account={currentAccount()}
				connect={connectToDefaultWallet}
			/>
			<div class="flex-1 overflow-y-scroll bg-gray-800 pb-[80%] md:pb-[25%] pt-4 px-2">
				{renderCurrentStepComponent()}
			</div>
			<BottomBar
				currentStep={currentStep()}
				nextStep={() => setCurrentStep(currentStep() + 1)}
				nextStepEnabled={nextStepEnabled()}
				disableNextStep={() => setNextStepEnabled(false)}
				account={currentAccount()}
				showNFTs={() => navigate("/list", { replace: true })}
			/>
		</div>
	);
};

export default App;
