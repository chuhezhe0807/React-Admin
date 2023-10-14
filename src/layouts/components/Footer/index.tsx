import type {RootState} from "@/redux/index";

import { useSelector } from "react-redux";

import "./index.less";

const LayoutFooter = () => {
	const { themeConfig } = useSelector((state: RootState) => state.global);
	return (
		<>
			{!themeConfig.footer && (
				<div className="footer">
					<a href="http://www.spicyboy.cn/" target="_blank" rel="noreferrer">
						2022 © Hooks-Admin By Hooks Technology.
					</a>
				</div>
			)}
		</>
	);
};

export default LayoutFooter;
