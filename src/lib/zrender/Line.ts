import {PathStyleProps} from "zrender";

import GPath from "./GPath";
import type {Overwrite} from "@/typings/utils";

type TExtraStyleProperties = {
    lineDisplayType: number,
    isStep?: boolean
}

export type GLine = Overwrite<typeof Line, {style: PathStyleProps & TExtraStyleProperties}>

const Line = GPath.extend<TExtraStyleProperties>({
    type: "line",

    style: {
        lineDisplayType: 1,
        fill: "#ccc"
    },

    init() {
        this.style.lineDisplayType;
        this.style.isStep;
    },

    beforeBrush() {
        this.style.lineDisplayType;
    },

    buildPath() {
        this.style.lineDisplayType;
    },

    afterBrush() {
        this.style.lineDisplayType;
    }
});

export default Line;