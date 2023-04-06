import { ExternalProvider } from "@ethersproject/providers";
import { ethers } from "ethers";
import { JSXElement, createSignal, onMount } from "solid-js";
import NFT from "../abis/NFT.json";
import config from "../contract-config.json";
import TopBar from "./top-bar";
import { makeHttpRequest } from "../connection/api";
import { useNavigate } from "@solidjs/router";

declare global {
	interface Window {
		ethereum?: ExternalProvider;
	}
}

const NFTsList = (): JSXElement => {
	const navigate = useNavigate();
	const [currentAccount, setCurrentAccount] = createSignal("");
	const [currentProvider, setCurrentProvider] =
		createSignal<ethers.providers.Web3Provider>();
	const [allWallets, setAllWallets] = createSignal<string[]>([]);
	const [tokensAmount, setTokensAmount] = createSignal(0);
	const [tokensMetadata, setTokensMetadata] = createSignal<
		{
			hex: string;
			type: string;
			name: string;
			description: string;
			url: string;
		}[]
	>([]);

	onMount(() => {
		connectToDefaultWallet();
	});

	const connectToDefaultWallet = async () => {
		if (window.ethereum) {
			const provider = new ethers.providers.Web3Provider(window.ethereum);
			setCurrentProvider(provider);
			const accounts = await window.ethereum.request({
				method: "eth_requestAccounts",
			});
			const account = await provider.getSigner().getAddress();
			setAllWallets(accounts);
			if (account) {
				setCurrentAccount(account);
			}
			if (account && provider) {
				loadBlockchainData(account, provider);
			}
		}
	};

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
		const data = localStorage.getItem("tokenIDs");
		if (data) {
			const tokenIDs = JSON.parse(data);
			setTokensMetadata(tokenIDs);
		}
	};

	const downloadMetadata = async () => {
		const data = localStorage.getItem("tokenIDs");
		if (data) {
			const blob = new Blob([data], {
				type: "text/json",
			});
			const link = document.createElement("a");

			link.download = "metadata.json";
			link.href = window.URL.createObjectURL(blob);
			link.dataset.downloadurl = [
				"text/json",
				link.download,
				link.href,
			].join(":");

			const evt = new MouseEvent("click", {
				view: window,
				bubbles: true,
				cancelable: true,
			});

			link.dispatchEvent(evt);
			link.remove();
		}
	};

	return (
		<div class="w-screen h-screen bg-gray-800 flex-row lg:p-10 relative">
			<TopBar
				account={currentAccount()}
				connect={connectToDefaultWallet}
			/>
			<div class="flex-1 overflow-y-scroll bg-gray-800 pb-[80%] md:pb-[25%] pt-4 px-2 mt-4">
				<div class="mb-4">
					<h1 class="text-2xl text-white font-bold">
						Minted NFT List
					</h1>
				</div>
				<div class="flex flex-col md:flex-row w-full justify-end gap-4 mb-4">
					<button
						class="btn btn-primary"
						onClick={() => navigate("/", { replace: true })}
					>
						Mint New
					</button>
					<button
						class="btn btn-secondary"
						onClick={downloadMetadata}
					>
						Download metadata
					</button>
				</div>
				<div class="overflow-x-auto">
					<table class="table w-full">
						{/* head */}
						<thead>
							<tr>
								<th></th>
								<th>Name</th>
								<th>Description</th>
								<th></th>
							</tr>
						</thead>
						<tbody>
							{/* row 1 */}
							{tokensMetadata().map((token, i) => {
								return (
									<tr>
										<th>{i}</th>
										<td>{token.name}</td>
										<td>{token.description}</td>
										<td>
											<button
												class="btn"
												onClick={() =>
													window.open(
														token.url,
														"_blank"
													)
												}
											>
												Open
											</button>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};

export default NFTsList;
