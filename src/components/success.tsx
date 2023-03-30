import { JSXElement } from "solid-js";
import image from "../assets/success-love.svg";

const Success = (): JSXElement => {
	return (
		<div class="w-full flex flex-col items-center justify-center gap-4">
			<article class="prose lg:prose-xl">
				<h2 class="text-center">
					Your NFT has been minted successfully, check your wallet!
				</h2>
			</article>
			<img src={image} class="w-3/4 md:w-1/4" />
		</div>
	);
};

export default Success;
