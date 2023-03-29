import { Component, createSignal } from "solid-js";
import logo from "./assets/condor-base.svg";
import BottomBar from "./components/bottom-bar";
import Home from "./components/home";
import Mint from "./components/mint";
import Prompt from "./components/prompt";

const App: Component = () => {
	const [currentStep, setCurrentStep] = createSignal(0);
	const [nextStepEnabled, setNextStepEnabled] = createSignal(true);
	const [imageData, setImageData] = createSignal<{
		title: string;
		prompt: string;
		image: string;
	}>({ title: "", prompt: "", image: "" });

	const renderCurrentStepComponent = () => {
		switch (currentStep()) {
			case 0:
				return <Home enableNextStep={() => setNextStepEnabled(true)} />;
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
					/>
				);
		}
	};

	console.log(currentStep());

	return (
		<div class="w-screen h-screen bg-gray-800 flex-row p-10 relative">
			<div class="w-full">
				<img src={logo} class="w-14 h-14" />
			</div>
			<div class="flex-1 overflow-y-scroll bg-gray-800">
				{renderCurrentStepComponent()}
			</div>
			<BottomBar
				currentStep={currentStep()}
				nextStep={() => setCurrentStep(currentStep() + 1)}
				nextStepEnabled={nextStepEnabled()}
				disableNextStep={() => setNextStepEnabled(false)}
			/>
		</div>
	);
};

export default App;
