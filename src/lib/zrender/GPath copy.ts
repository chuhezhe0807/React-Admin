import {PathStyleProps, Displayable, Element, PathProps, Path} from "zrender";
import { clone } from "zrender/lib/core/util";
import PathProxy from "zrender/lib/core/PathProxy";

type Dictionary<T> = {
    [key: string]: T
}

export default class GPath<T, Shape extends Dictionary<any>> {
    constructor(defaultProps: {
        type?: string
        shape?: Shape
        style?: PathStyleProps
        beforeBrush?: Displayable['beforeBrush']
        afterBrush?: Displayable['afterBrush']
        getBoundingRect?: Displayable['getBoundingRect']
    
        calculateTextPosition?: Element['calculateTextPosition']
        buildPath(this: Path, ctx: CanvasRenderingContext2D | PathProxy, shape: Shape, inBatch?: boolean): void
        init?(this: Path, opts: PathProps): void // TODO Should be SubPathOption
    }) {
        type SubPathStyle = PathStyleProps & T;

        interface SubPathOption extends PathProps {
            shape: Shape
        }

        class Sub extends Path {
            shape: Shape;
            style: SubPathStyle;

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

        return Sub;
    }
};