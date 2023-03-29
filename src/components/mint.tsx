import { Component, createSignal } from "solid-js";

type Props = {
	imageData: { title: string; prompt: string; image: string };
};

const Mint: Component = (props: Props) => {
	const [loading, setLoading] = createSignal(false);

	const mintImage = () => {
		console.log("minting image");
	};

	return (
		<div class="w-full flex flex-col items-center justify-center gap-10 mb-14">
			<article class="prose lg:prose-xl">
				<h2 class="text-center">
					Final step, mint your image and get your NFT
				</h2>
			</article>
			<div class="w-full flex flex-row justify-center gap-8">
				<div class="card w-96 bg-base-100 shadow-xl p-10 gap-8 items-center">
					<article class="prose lg:prose-xl">
						<h3 class="text-center">Input your prompt</h3>
					</article>
					{props.imageData.image !== "" && (
						<img src={props.imageData.image} />
					)}
					<button
						class={`btn btn-wide ${loading() ? "loading" : ""}`}
						onClick={mintImage}
					>
						Mint image
					</button>
				</div>
			</div>
		</div>
	);
};

export default Mint;
