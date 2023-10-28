import {PathStyleProps, Displayable, Element, PathProps, Path} from "zrender";
import { clone } from "zrender/lib/core/util";
import PathProxy from "zrender/lib/core/PathProxy";

import type {Overwrite} from "@/typings/utils";

type Dictionary<T> = {
    [key: string]: T
}

export type TDefaultProps<T> = {
    type?: string
    shape?: Dictionary<any>
    style?: PathStyleProps & T
    beforeBrush?: (this: Overwrite<Path, {style: PathStyleProps & T}>) => void
    afterBrush?: (this: Overwrite<Path, {style: PathStyleProps & T}>) => void
    getBoundingRect?: Displayable['getBoundingRect']

    calculateTextPosition?: Element['calculateTextPosition']
    buildPath(this: Overwrite<Path, {style: PathStyleProps & T}>, ctx: CanvasRenderingContext2D | PathProxy, shape: Dictionary<any>, inBatch?: boolean): void
    init?(this: Overwrite<Path, {style: PathStyleProps & T}>, opts: PathProps): void // TODO Should be SubPathOption
}

export default class GPath {
    static extend<T>(defaultProps: TDefaultProps<T>): {
        new(opts?: PathProps & {shape: Dictionary<any>, style: PathStyleProps & T}): Overwrite<Path, {style: PathStyleProps & T}>
        new(opts?: PathProps & {shape: Dictionary<any>}): Path
    } {
        interface SubPathOption extends PathProps {
            shape: Dictionary<any>
        }
    
        class Sub extends Path {
            getDefaultStyle() {
                return clone(defaultProps.style);
            }
    
            getDefaultShape() {
                return clone(defaultProps.shape) as Object;
            }
    
            constructor(opts?: SubPathOption) {
                super(opts);
                defaultProps.init && defaultProps.init.call(this as any, opts!);
            }
        }
    
        // TODO Legacy usage. Extend functions
        for (let key in defaultProps) {
            if (typeof (defaultProps as any)[key] === 'function') {
                (Sub.prototype as any)[key] = (defaultProps as any)[key];
            }
        }
    
        return Sub as any;
    }
}