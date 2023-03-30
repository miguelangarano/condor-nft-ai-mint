import { ExternalProvider } from "@ethersproject/providers";
import { ethers } from "ethers";
import { Component, createSignal, onMount } from "solid-js";
import BottomBar from "./components/bottom-bar";
import Home from "./components/home";
import Mint from "./components/mint";
import Prompt from "./components/prompt";
import Success from "./components/success";
import TopBar from "./components/top-bar";

declare global {
	interface Window {
		ethereum?: ExternalProvider;
	}
}

const App: Component = () => {
	const [currentAccount, setCurrentAccount] = createSignal("");
	const [currentStep, setCurrentStep] = createSignal<number>(0);
	const [nextStepEnabled, setNextStepEnabled] = createSignal(true);
	const [imageData, setImageData] = createSignal<{
		title: string;
		prompt: string;
		image: string;
	}>({ title: "", prompt: "", image: "" });
	const [provider, setProvider] =
		createSignal<ethers.providers.Web3Provider>();

	const loadBlockchainData = async () => {
		console.log("loading blockchain data", window.ethereum);
		if (window.ethereum) {
			const prov = new ethers.providers.Web3Provider(window.ethereum);
			console.log(prov);
			setProvider(prov);
		}
	};

	onMount(() => {
		loadBlockchainData();
	});

	const renderCurrentStepComponent = () => {
		switch (currentStep()) {
			case 0:
				return (
					<Home
						account={currentAccount()}
						connect={connectToWallet}
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
						provider={provider()}
					/>
				);
			case 3:
				return <Success />;
		}
	};

	const connectToWallet = async () => {
		if (window.ethereum) {
			const accounts = await window.ethereum.request({
				method: "eth_requestAccounts",
			});
			const account = ethers.utils.getAddress(accounts[0]);
			console.log("account", account, accounts);
			setCurrentAccount(account);
		}
	};

	return (
		<div class="w-screen h-screen bg-gray-800 flex-row lg:p-10 relative">
			<TopBar account={currentAccount()} connect={connectToWallet} />
			<div class="flex-1 overflow-y-scroll bg-gray-800 pb-[80%] md:pb-[25%] pt-4 px-2">
				{renderCurrentStepComponent()}
			</div>
			<BottomBar
				currentStep={currentStep()}
				nextStep={() => setCurrentStep(currentStep() + 1)}
				nextStepEnabled={nextStepEnabled()}
				disableNextStep={() => setNextStepEnabled(false)}
				account={currentAccount()}
			/>
		</div>
	);
};

export default App;
