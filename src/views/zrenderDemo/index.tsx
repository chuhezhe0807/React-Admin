import React, {useEffect, useRef} from 'react';
import Line, {type GLine} from '@/lib/zrender/Line';

function ZrenderDemo() {
    const LineRef = useRef<GLine>(new Line());
    console.log(LineRef.current.style.lineDisplayType);
    console.log(LineRef.current.style.isStep);

    useEffect(() => {
        
    }, [])  

    return (
        <div>index</div>
    )
}

export default ZrenderDemo;
