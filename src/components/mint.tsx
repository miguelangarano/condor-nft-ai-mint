import { ethers } from "ethers";
import { NFTStorage } from "nft.storage";
import { createSignal, JSXElement } from "solid-js";
import config from "../contract-config.json";
import abi from "../abis/NFT.json";

type Props = {
	enableNextStep: () => void;
	nextStep: () => void;
	imageData: { title: string; prompt: string; image: string };
	provider: ethers.providers.Web3Provider | undefined;
};

const Mint = (props: Props): JSXElement => {
	const [loading, setLoading] = createSignal(false);
	const [nftUrl, setNFTUrl] = createSignal("");
	const [nft, setNFT] = createSignal<ethers.Contract>();

	const handleSubmit = async () => {
		setLoading(true);
		// load the file from disk
		const image = new File([props.imageData.image], "image.jpeg", {
			type: "image/jpeg",
		});
		const uploadData = await uploadImage(image);
		if (!uploadData) return;
		mintImage(
			uploadData.nft,
			uploadData.url,
			props.imageData.title,
			props.imageData.prompt
		);
	};

	const uploadImage = async (
		image: File
	): Promise<{ nft: ethers.Contract; url: string } | undefined> => {
		try {
			// create a new NFTStorage client using our API key
			const nftstorage = new NFTStorage({
				token: import.meta.env.VITE_NFT_STORAGE_API_KEY,
			});

			// call client.store, passing in the image & metadata
			const blob = new Blob([image], { type: "image/jpeg" });
			const { ipnft } = await nftstorage.store({
				image: blob,
				name: props.imageData.title,
				description: props.imageData.prompt,
			});

			const url = `https://ipfs.io/ipfs/${ipnft}/metadata.json`;

			const network = await props.provider?.getNetwork();
			const nft = new ethers.Contract(
				config[network.chainId].nft.address,
				abi,
				props.provider
			);
			return { nft, url };
		} catch (e) {
			setLoading(false);
			alert("Error uploading image to NFT storage");
			console.error(e);
			return undefined;
		}
	};

	const mintImage = async (
		nft: ethers.Contract,
		url: string,
		name: string,
		description: string
	) => {
		try {
			const signer = props.provider?.getSigner();
			if (signer) {
				const transaction = await nft.connect(signer).mint(url, {
					value: ethers.utils.parseUnits(
						import.meta.env.VITE_CURRENCY_VALUE,
						import.meta.env.VITE_CURRENCY_DIGITS
					),
				});
				const result = await transaction.wait();
				const transferEvents = result.events;
				let tokenIdData = {};
				if (transferEvents) {
					transferEvents.forEach((event: any) => {
						if(event.args){
							const { tokendId } = event.args;
							tokenIdData = { ...tokendId };
						}
					});
				}
				const currentTokenIDs = localStorage.getItem("tokenIDs");
				if (currentTokenIDs) {
					const idsObject = JSON.parse(currentTokenIDs);
					idsObject.push({ ...tokenIdData, name, description, url });
					localStorage.setItem("tokenIDs", JSON.stringify(idsObject));
				} else {
					localStorage.setItem(
						"tokenIDs",
						JSON.stringify([{ ...tokenIdData, name, description, url }])
					);
				}
				alert("Image minted successfully");
				setLoading(false);
				props.enableNextStep();
				props.nextStep();
			} else {
				setLoading(false);
				alert("Error connecting to wallet");
			}
		} catch (e) {
			setLoading(false);
			alert("Error minting image");
			console.error(e);
		}
	};

	return (
		<div class="w-full flex flex-col items-center justify-center gap-10">
			<article class="prose lg:prose-xl">
				<h2 class="text-center">
					Final step, mint your image and get your NFT
				</h2>
			</article>
			<div class="w-full flex flex-row justify-center gap-8">
				<div class="card w-full md:w-96 bg-base-100 shadow-xl p-10 gap-8 items-center">
					<button
						class={`btn btn-wide ${loading() ? "loading" : ""}`}
						onClick={handleSubmit}
						disabled={loading()}
					>
						Mint image
					</button>
					{props.imageData.image !== "" && (
						<img src={props.imageData.image} />
					)}
				</div>
			</div>
		</div>
	);
};

export default Mint;
