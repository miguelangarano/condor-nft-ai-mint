import { JSXElement } from "solid-js";

type Props = {
	currentStep: number;
	nextStep: () => void;
	disableNextStep: () => void;
	nextStepEnabled: boolean;
	account?: string;
	showNFTs: () => void;
};

const BottomBar = (props: Props): JSXElement => {
	const pressHandler = () => {
		if(props.currentStep == 3) {
			props.showNFTs();
			return;
		}
		props.nextStep();
		if (props.currentStep < 3) props.disableNextStep();
	};

	return (
		<div class="w-full flex flex-col items-center justify-center fixed bottom-0 left-0 gap-y-10 bg-gray-800 drop-shadow-2xl py-4">
			<button
				class={`btn ${props.nextStepEnabled ? "" : "btn-disabled"}`}
				disabled={
					!props.nextStepEnabled ||
					props.account == undefined ||
					props.account == ""
				}
				onClick={pressHandler}
			>
				{props.currentStep == 0
					? "Start"
					: props.currentStep == 3
					? "See NFT's"
					: "Next"}
			</button>
			<ul class="steps">
				<li
					class={`step ${
						props.currentStep >= 0 ? "step-primary" : ""
					}`}
				>
					Home
				</li>
				<li
					class={`step ${
						props.currentStep >= 1 ? "step-primary" : ""
					}`}
				>
					Prompt
				</li>
				<li
					class={`step ${
						props.currentStep >= 2 ? "step-primary" : ""
					}`}
				>
					Mint
				</li>
				<li
					class={`step ${
						props.currentStep >= 3 ? "step-primary" : ""
					}`}
				>
					Success
				</li>
			</ul>
		</div>
	);
};

export default BottomBar;
