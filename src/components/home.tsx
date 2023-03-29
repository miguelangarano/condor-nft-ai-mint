import type { Component } from "solid-js";

type Props = {
	nextStep: () => void;
};

const Home: Component = ({ nextStep }: Props) => {
	return (
		<div class="w-full flex flex-col items-center">
			<div class="card w-1/2 bg-base-100 shadow-xl p-10">
				<article class="prose lg:prose-xl">
					<h1 class="text-center">Condor NFT Mint</h1>
					<h4 class="text-justify">
						This app will allow you to generate an prompted AI
						generated image with Stable diffussion API tool. After
						you have your AI generated image, you will be able to
						create an NFT from it and mint it. The images are stored
						in IPFS and the NFT gets saved in the wallet you
						connected.
					</h4>
					<h5 class="text-center">Let's get started</h5>
				</article>
			</div>
		</div>
	);
};

export default Home;
