import { toSvg } from "jdenticon";
import { createEffect, createSignal, JSXElement } from "solid-js";
import logo from "../assets/condor-base.svg";
import { useNavigate } from "@solidjs/router";

type Props = {
	account: string;
	connect: () => void;
};

const TopBar = (props: Props): JSXElement => {
	const navigate = useNavigate();
	const [accountSvg, setAccountSvg] = createSignal<JSXElement>(<></>);

	createEffect(() => {
		if (props.account) generateAccountSvg();
	}, [props.account]);

	const generateAccountSvg = () => {
		const svg = document.createElement("svg");
		svg.innerHTML = toSvg(props.account, 50);
		setAccountSvg(svg);
	};

	const handleConnection = () => {
		if (props.account == "") {
			props.connect();
		}
	};

	return (
		<div class="w-full flex items-center justify-between">
			<img
				src={logo}
				class="w-14 h-14"
				onClick={() => {
					if(window.location.toString().includes('list')){
						navigate("/", { replace: true })
					}else{
						navigate("/list", { replace: true })
					}
				}}
			/>
			<div class="flex gap-4">
				<div class="flex gap-5 items-center">{accountSvg()}</div>
				<button class="btn" onClick={handleConnection}>
					{props.account != "" ? props.account.slice(-10) : "Connect"}
				</button>
			</div>
		</div>
	);
};

export default TopBar;
