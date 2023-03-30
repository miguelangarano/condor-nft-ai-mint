import type { JSXElement } from "solid-js";

type Props = {
	account: string;
	connect: () => void;
};

const Home = (props: Props): JSXElement => {
	const handleClick = () => {
		props.connect();
	};

	return (
		<div class="w-full flex flex-col items-center">
			<div class="card lg:w-1/2 md:w-1/2 sm:w-full  bg-base-100 shadow-xl p-10 items-center">
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
					<h5 class="text-center">
						{props.account == "" || props.account == undefined
							? "Connect your wallet to get started"
							: "You are connected to " +
							  props.account.slice(-10)}
					</h5>
				</article>
				{props.account == "" || props.account == undefined ? (
					<button class="btn mt-4" onClick={handleClick}>
						Connect
					</button>
				) : (
					<></>
				)}
			</div>
		</div>
	);
};

export default Home;
