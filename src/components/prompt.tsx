import { Component, createSignal, JSXElement } from "solid-js";
import { makeHttpRequest } from "../connection/api";

type Props = {
	enableNextStep: () => void;
	setImageData: (title: string, prompt: string, imageData: string) => void;
};

const Prompt = (props: Props): JSXElement => {
	const [title, setTitle] = createSignal("");
	const [prompt, setPrompt] = createSignal("");
	const [image, setImage] = createSignal("");
	const [loading, setLoading] = createSignal(false);
	const [loadingProgress, setLoadingProgress] = createSignal(1);

	const generateImage = () => {
		if (title() && prompt()) {
			setLoading(true);
			const inter = setInterval(() => {
				if (loadingProgress() <= 10) {
					setLoadingProgress(loadingProgress() + 1);
				} else {
					setLoadingProgress(1);
				}
			}, 1000);
			console.log("ENVS::", import.meta.env.VITE_API_URI, import.meta.env.VITE_API_KEY)
			makeHttpRequest(
				import.meta.env.VITE_API_URI,
				"POST",
				{
					inputs: prompt(),
					options: { wait_for_model: true },
				},
				{
					Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
					Accept: "application/json",
					"Content-Type": "application/json",
				},
				"arraybuffer"
			)
				.then((response) => {
					try {
						const type = response.headers["content-type"];
						const data = response.data;

						const base64data = Buffer.from(data).toString("base64");
						const img = `data:${type};base64,${base64data}`;
						clearInterval(inter);
						setLoadingProgress(10);
						if (img) {
							setTimeout(() => {
								setImage(img);
								setLoading(false);
								props.enableNextStep();
								props.setImageData(title(), prompt(), img);
							}, 1000);
						}
					} catch (e) {
						console.error(e);
						alert("Something went wrong, please try again");
					}
				})
				.catch((e) => {
					console.error(e);
					alert("Something went wrong, please try again");
				});
		} else {
			alert("Please fill in all fields");
		}
	};

	return (
		<div class="w-full flex flex-col items-center justify-center gap-10">
			<article class="prose lg:prose-xl">
				<h2 class="text-center">
					Prompt your text and generate your AI image
				</h2>
			</article>
			<div class="w-full flex flex-col md:flex-row justify-center items-center gap-8">
				<div class="card w-full md:w-96 bg-base-100 shadow-xl p-10 gap-8 items-center">
					<article class="prose lg:prose-xl">
						<h3 class="text-center">Input your prompt</h3>
					</article>
					<input
						type="text"
						value={title()}
						onChange={(e) => setTitle(e.target.value)}
						placeholder="Title of your masterpiece"
						class="input input-bordered w-full max-w-xs shadow-xl"
					/>
					<input
						type="text"
						value={prompt()}
						onChange={(e) => setPrompt(e.target.value)}
						placeholder="Your prompt here"
						class="input input-bordered w-full max-w-xs shadow-xl"
					/>
					<button
						class={`btn btn-wide ${
							loading() ? "loading btn-disabled" : ""
						}`}
						disabled={loading() || title() === "" || prompt() === ""}
						onClick={generateImage}
					>
						Generate image
					</button>
				</div>
				<div class="card w-full md:w-96 bg-base-100 shadow-xl p-2 flex items-center justify-center">
					<div class="avatar w-full">
						<div class="w-full rounded flex items-center justify-center">
							{image() === "" && loading() && (
								<progress
									class="progress progress-secondary w-full"
									value={loadingProgress() * 10}
									max="100"
								></progress>
							)}
							{image() !== "" && <img src={image()} />}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Prompt;
