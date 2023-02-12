import{j as g,c as S,a as n,F as T,g as H,m as W,r as G,t as X,C as _,u as q,b as P,d as U,e as V}from"./index-41eda882.js";import{A as J}from"./index-4d80603c.js";import"./getDataOrAriaProps-380929c1.js";const K=e=>{let{children:t}=e;return t},Q=K;function N(e){return e!=null}const Y=e=>{let{itemPrefixCls:t,component:l,span:i,className:s,style:o,labelStyle:r,contentStyle:m,bordered:u,label:c,content:a,colon:b}=e;const h=l;return u?g(h,{className:S({[`${t}-item-label`]:N(c),[`${t}-item-content`]:N(a)},s),style:o,colSpan:i,children:[N(c)&&n("span",{style:r,children:c}),N(a)&&n("span",{style:m,children:a})]}):n(h,{className:S(`${t}-item`,s),style:o,colSpan:i,children:g("div",{className:`${t}-item-container`,children:[(c||c===0)&&n("span",{className:S(`${t}-item-label`,{[`${t}-item-no-colon`]:!b}),style:r,children:c}),(a||a===0)&&n("span",{className:S(`${t}-item-content`),style:m,children:a})]})})},O=Y;function L(e,t,l){let{colon:i,prefixCls:s,bordered:o}=t,{component:r,type:m,showLabel:u,showContent:c,labelStyle:a,contentStyle:b}=l;return e.map((h,x)=>{let{props:{label:v,children:w,prefixCls:d=s,className:$,style:y,labelStyle:F,contentStyle:j,span:E=1},key:f}=h;return typeof r=="string"?n(O,{className:$,style:y,labelStyle:Object.assign(Object.assign({},a),F),contentStyle:Object.assign(Object.assign({},b),j),span:E,colon:i,component:r,itemPrefixCls:d,bordered:o,label:u?v:null,content:c?w:null},`${m}-${f||x}`):[n(O,{className:$,style:Object.assign(Object.assign(Object.assign({},a),y),F),span:1,colon:i,component:r[0],itemPrefixCls:d,bordered:o,label:v},`label-${f||x}`),n(O,{className:$,style:Object.assign(Object.assign(Object.assign({},b),y),j),span:E*2-1,component:r[1],itemPrefixCls:d,bordered:o,content:w},`content-${f||x}`)]})}const Z=e=>{const t=React.useContext(R),{prefixCls:l,vertical:i,row:s,index:o,bordered:r}=e;return i?g(T,{children:[n("tr",{className:`${l}-row`,children:L(s,e,Object.assign({component:"th",type:"label",showLabel:!0},t))},`label-${o}`),n("tr",{className:`${l}-row`,children:L(s,e,Object.assign({component:"td",type:"content",showContent:!0},t))},`content-${o}`)]}):n("tr",{className:`${l}-row`,children:L(s,e,Object.assign({component:r?["th","td"]:"td",type:"item",showLabel:!0,showContent:!0},t))},o)},k=Z,ee=e=>{const{componentCls:t,descriptionsSmallPadding:l,descriptionsDefaultPadding:i,descriptionsMiddlePadding:s,descriptionsBg:o}=e;return{[`&${t}-bordered`]:{[`${t}-view`]:{border:`${e.lineWidth}px ${e.lineType} ${e.colorSplit}`,"> table":{tableLayout:"auto",borderCollapse:"collapse"}},[`${t}-item-label, ${t}-item-content`]:{padding:i,borderInlineEnd:`${e.lineWidth}px ${e.lineType} ${e.colorSplit}`,"&:last-child":{borderInlineEnd:"none"}},[`${t}-item-label`]:{backgroundColor:o,"&::after":{display:"none"}},[`${t}-row`]:{borderBottom:`${e.lineWidth}px ${e.lineType} ${e.colorSplit}`,"&:last-child":{borderBottom:"none"}},[`&${t}-middle`]:{[`${t}-item-label, ${t}-item-content`]:{padding:s}},[`&${t}-small`]:{[`${t}-item-label, ${t}-item-content`]:{padding:l}}}}},te=e=>{const{componentCls:t,descriptionsExtraColor:l,descriptionItemPaddingBottom:i,descriptionsItemLabelColonMarginRight:s,descriptionsItemLabelColonMarginLeft:o,descriptionsTitleMarginBottom:r}=e;return{[t]:Object.assign(Object.assign(Object.assign({},G(e)),ee(e)),{["&-rtl"]:{direction:"rtl"},[`${t}-header`]:{display:"flex",alignItems:"center",marginBottom:r},[`${t}-title`]:Object.assign(Object.assign({},X),{flex:"auto",color:e.colorText,fontWeight:e.fontWeightStrong,fontSize:e.fontSizeLG,lineHeight:e.lineHeightLG}),[`${t}-extra`]:{marginInlineStart:"auto",color:l,fontSize:e.fontSize},[`${t}-view`]:{width:"100%",borderRadius:e.borderRadiusLG,table:{width:"100%",tableLayout:"fixed"}},[`${t}-row`]:{"> th, > td":{paddingBottom:i},"&:last-child":{borderBottom:"none"}},[`${t}-item-label`]:{color:e.colorText,fontWeight:"normal",fontSize:e.fontSize,lineHeight:e.lineHeight,textAlign:"start","&::after":{content:'":"',position:"relative",top:-.5,marginInline:`${o}px ${s}px`},[`&${t}-item-no-colon::after`]:{content:'""'}},[`${t}-item-no-label`]:{"&::after":{margin:0,content:'""'}},[`${t}-item-content`]:{display:"table-cell",flex:1,color:e.colorText,fontSize:e.fontSize,lineHeight:e.lineHeight,wordBreak:"break-word",overflowWrap:"break-word"},[`${t}-item`]:{paddingBottom:0,verticalAlign:"top","&-container":{display:"flex",[`${t}-item-label`]:{display:"inline-flex",alignItems:"baseline"},[`${t}-item-content`]:{display:"inline-flex",alignItems:"baseline"}}},"&-middle":{[`${t}-row`]:{"> th, > td":{paddingBottom:e.paddingSM}}},"&-small":{[`${t}-row`]:{"> th, > td":{paddingBottom:e.paddingXS}}}})}},ne=H("Descriptions",e=>{const t=e.colorFillAlter,l=e.fontSizeSM*e.lineHeightSM,i=e.colorText,s=`${e.paddingXS}px ${e.padding}px`,o=`${e.padding}px ${e.paddingLG}px`,r=`${e.paddingSM}px ${e.paddingLG}px`,m=e.padding,u=e.marginXS,c=e.marginXXS/2,a=W(e,{descriptionsBg:t,descriptionsTitleMarginBottom:l,descriptionsExtraColor:i,descriptionItemPaddingBottom:m,descriptionsSmallPadding:s,descriptionsDefaultPadding:o,descriptionsMiddlePadding:r,descriptionsItemLabelColonMarginRight:u,descriptionsItemLabelColonMarginLeft:c});return[te(a)]}),R=React.createContext({}),A={xxl:3,xl:3,lg:3,md:3,sm:2,xs:1};function ie(e,t){if(typeof e=="number")return e;if(typeof e=="object")for(let l=0;l<P.length;l++){const i=P[l];if(t[i]&&e[i]!==void 0)return e[i]||A[i]}return 3}function D(e,t,l){let i=e;return(l===void 0||l>t)&&(i=V(e,{span:t})),i}function le(e,t){const l=U(e).filter(r=>r),i=[];let s=[],o=t;return l.forEach((r,m)=>{var u;const c=(u=r.props)===null||u===void 0?void 0:u.span,a=c||1;if(m===l.length-1){s.push(D(r,o,c)),i.push(s);return}a<o?(o-=a,s.push(r)):(s.push(D(r,o,a)),i.push(s),o=t,s=[])}),i}function C(e){let{prefixCls:t,title:l,extra:i,column:s=A,colon:o=!0,bordered:r,layout:m,children:u,className:c,style:a,size:b,labelStyle:h,contentStyle:x}=e;const{getPrefixCls:v,direction:w}=React.useContext(_),d=v("descriptions",t),[$,y]=React.useState({}),F=ie(s,$),[j,E]=ne(d),f=q();React.useEffect(()=>{const I=f.subscribe(B=>{typeof s=="object"&&y(B)});return()=>{f.unsubscribe(I)}},[]);const M=le(u,F),z=React.useMemo(()=>({labelStyle:h,contentStyle:x}),[h,x]);return j(n(R.Provider,{value:z,children:g("div",{className:S(d,{[`${d}-${b}`]:b&&b!=="default",[`${d}-bordered`]:!!r,[`${d}-rtl`]:w==="rtl"},c,E),style:a,children:[(l||i)&&g("div",{className:`${d}-header`,children:[l&&n("div",{className:`${d}-title`,children:l}),i&&n("div",{className:`${d}-extra`,children:i})]}),n("div",{className:`${d}-view`,children:n("table",{children:n("tbody",{children:M.map((I,B)=>n(k,{index:B,colon:o,prefixCls:d,vertical:m==="vertical",bordered:r,row:I},B))})})})]})}))}C.Item=Q;function p(e){const{name:t,prefix:l="icon",iconStyle:i={width:"100px",height:"100%"}}=e,s=`#${l}-${t}`;return n("svg",{"aria-hidden":"true",style:i,children:n("use",{href:s})})}const ae=()=>g("div",{className:"card content-box",children:[n(J,{message:"SVG \u56FE\u6807\u76EE\u524D\u4F7F\u7528 vite-plugin-svg-icons \u63D2\u4EF6\u5B8C\u6210\uFF0C\u5B98\u65B9\u6587\u6863\u8BF7\u67E5\u770B \uFF1Ahttps://github.com/vbenjs/vite-plugin-svg-icons",style:{width:"100%"},type:"warning"}),n("br",{}),g("div",{className:"icon-list",children:[n(p,{name:"xianxingdaoyu"}),n(p,{name:"xianxingdiqiu"}),n(p,{name:"xianxingditu"}),n(p,{name:"xianxingfanchuan"}),n(p,{name:"xianxingfeiji"}),n(p,{name:"xianxinglvhangriji"}),n(p,{name:"xianxingtianqiyubao"}),n(p,{name:"xianxingxiangjipaizhao"}),n(p,{name:"xianxingxiarilengyin"}),n(p,{name:"xianxingyoulun"}),n(p,{name:"xianxingxiarilengyin"})]}),g(C,{title:"\u914D\u7F6E\u9879",bordered:!0,className:"antd-descriptions",column:1,children:[n(C.Item,{label:"name",children:"\u56FE\u6807\u7684\u540D\u79F0\uFF0Csvg \u56FE\u6807\u5FC5\u987B\u5B58\u50A8\u5728 src/assets/icons \u76EE\u5F55\u4E0B"}),n(C.Item,{label:"prefix",children:"\u56FE\u6807\u7684\u524D\u7F00\uFF0C\u9ED8\u8BA4\u4E3Aicon"}),g(C.Item,{label:"iconStyle",children:[" \u56FE\u6807\u7684\u6837\u5F0F\uFF0C\u9ED8\u8BA4\u6837\u5F0F\u4E3A ","{ width: 100px, height: 100px}"," "]})]})]});export{ae as default};