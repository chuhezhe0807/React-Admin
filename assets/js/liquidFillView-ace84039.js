import{bg as me,bh as ye,bi as be,bj as we,aU as J,bk as pe,bl as Se,bm as Pe,bn as Me,bo as Ie,bp as Ce,bq as xe,br as le,bs as G,bt as oe,b3 as Q,b4 as X,b1 as K,b2 as ee,aQ as se,bf as De,b9 as Le,bd as Te,b0 as ke,s as Ae,B as Ee,A as U,H as te,N as ae,Z as re,V as Oe,bu as Re,v as ie,Y as Ye,J as We}from"./useEcharts-c2bc74a4.js";function Be(e){return me(null,e)}var ze={isDimensionStacked:ye,enableDataStack:be,getStackedDimension:we};function Ve(e,t){var s=t;t instanceof J||(s=new J(t));var d=pe(s);return d.setExtent(e[0],e[1]),Se(d,s),d}function _e(e){Pe(e,Me)}function ue(e,t){return t=t||{},Ie(e,null,null,t.state!=="normal")}const Ne=Object.freeze(Object.defineProperty({__proto__:null,createList:Be,getLayoutRect:Ce,dataStack:ze,createScale:Ve,mixinAxisModelCommonMethods:_e,getECData:xe,createTextStyle:ue,createDimensions:le,createSymbol:G,enableHoverEmphasis:oe},Symbol.toStringTag,{value:"Module"}));function He(e){var t=K.extend(e);return K.registerClass(t),t}function $e(e){var t=ee.extend(e);return ee.registerClass(t),t}function qe(e){var t=Q.extend(e);return Q.registerClass(t),t}function Ue(e){var t=X.extend(e);return X.registerClass(t),t}se([De,Le]);se(Te);qe({type:"series.liquidFill",optionUpdated:function(){var e=this.option;e.gridSize=Math.max(Math.floor(e.gridSize),4)},getInitialData:function(e,t){var s=le(e.data,{coordDimensions:["value"]}),d=new ke(s,this);return d.initData(e.data),d},defaultOption:{color:["#294D99","#156ACF","#1598ED","#45BDFF"],center:["50%","50%"],radius:"50%",amplitude:"8%",waveLength:"80%",phase:"auto",period:"auto",direction:"right",shape:"circle",waveAnimation:!0,animationEasing:"linear",animationEasingUpdate:"linear",animationDuration:2e3,animationDurationUpdate:1e3,outline:{show:!0,borderDistance:8,itemStyle:{color:"none",borderColor:"#294D99",borderWidth:8,shadowBlur:20,shadowColor:"rgba(0, 0, 0, 0.25)"}},backgroundStyle:{color:"#E3F7FF"},itemStyle:{opacity:.95,shadowBlur:50,shadowColor:"rgba(0, 0, 0, 0.4)"},label:{show:!0,color:"#294D99",insideColor:"#fff",fontSize:50,fontWeight:"bold",align:"center",baseline:"middle",position:"inside"},emphasis:{itemStyle:{opacity:.8}}}});const Ge=Ae({type:"ec-liquid-fill",shape:{waveLength:0,radius:0,radiusY:0,cx:0,cy:0,waterLevel:0,amplitude:0,phase:0,inverse:!1},buildPath:function(e,t){t.radiusY==null&&(t.radiusY=t.radius);for(var s=Math.max(Math.ceil(2*t.radius/t.waveLength*4)*2,8);t.phase<-Math.PI*2;)t.phase+=Math.PI*2;for(;t.phase>0;)t.phase-=Math.PI*2;var d=t.phase/Math.PI/2*t.waveLength,h=t.cx-t.radius+d-t.radius*2;e.moveTo(h,t.waterLevel);for(var g=0,w=0;w<s;++w){var Y=w%4,o=je(w*t.waveLength/4,Y,t.waveLength,t.amplitude);e.bezierCurveTo(o[0][0]+h,-o[0][1]+t.waterLevel,o[1][0]+h,-o[1][1]+t.waterLevel,o[2][0]+h,-o[2][1]+t.waterLevel),w===s-1&&(g=o[2][0])}t.inverse?(e.lineTo(g+h,t.cy-t.radiusY),e.lineTo(h,t.cy-t.radiusY),e.lineTo(h,t.waterLevel)):(e.lineTo(g+h,t.cy+t.radiusY),e.lineTo(h,t.cy+t.radiusY),e.lineTo(h,t.waterLevel)),e.closePath()}});function je(e,t,s,d){return t===0?[[e+1/2*s/Math.PI/2,d/2],[e+1/2*s/Math.PI,d],[e+s/4,d]]:t===1?[[e+1/2*s/Math.PI/2*(Math.PI-2),d],[e+1/2*s/Math.PI/2*(Math.PI-1),d/2],[e+s/4,0]]:t===2?[[e+1/2*s/Math.PI/2,-d/2],[e+1/2*s/Math.PI,-d],[e+s/4,-d]]:[[e+1/2*s/Math.PI/2*(Math.PI-2),-d],[e+1/2*s/Math.PI/2*(Math.PI-1),-d/2],[e+s/4,0]]}var M=Re;function ne(e){return e&&e.indexOf("path://")===0}Ue({type:"liquidFill",render:function(e,t,s){var d=this,h=this.group;h.removeAll();var g=e.getData(),w=g.getItemModel(0),Y=w.get("center"),o=w.get("radius"),W=s.getWidth(),I=s.getHeight(),V=Math.min(W,I),B=0,L=0,j=e.get("outline.show");j&&(B=e.get("outline.borderDistance"),L=M(e.get("outline.itemStyle.borderWidth"),V));var C=M(Y[0],W),x=M(Y[1],I),D,T,k,p=!1,b=e.get("shape");if(b==="container"?(p=!0,D=[W/2,I/2],T=[D[0]-L/2,D[1]-L/2],k=[M(B,W),M(B,I)],o=[Math.max(T[0]-k[0],0),Math.max(T[1]-k[1],0)]):(D=M(o,V)/2,T=D-L/2,k=M(B,V),o=Math.max(T-k,0)),j){var ve=F();ve.style.lineWidth=L,h.add(F())}var de=p?0:C-o,he=p?0:x-o,A=null;h.add(ce());var _=this._data,q=[];g.diff(_).add(function(a){var r=N(a,!1),i=r.shape.waterLevel;r.shape.waterLevel=p?I/2:o,Ee(r,{shape:{waterLevel:i}},e),r.z2=2,H(a,r,null),h.add(r),g.setItemGraphicEl(a,r),q.push(r)}).update(function(a,r){for(var i=_.getItemGraphicEl(r),u=N(a,!1,i),l={},n=["amplitude","cx","cy","phase","radius","radiusY","waterLevel","waveLength"],c=0;c<n.length;++c){var v=n[c];u.shape.hasOwnProperty(v)&&(l[v]=u.shape[v])}for(var m={},f=["fill","opacity","shadowBlur","shadowColor"],c=0;c<f.length;++c){var v=f[c];u.style.hasOwnProperty(v)&&(m[v]=u.style[v])}p&&(l.radiusY=I/2),U(i,{shape:l,x:u.x,y:u.y},e),e.isUniversalTransitionEnabled&&e.isUniversalTransitionEnabled()?U(i,{style:m},e):i.useStyle(m);var y=i.getClipPath(),S=u.getClipPath();i.setClipPath(u.getClipPath()),i.shape.inverse=u.inverse,y&&S&&d._shape===b&&!ne(b)&&U(S,{shape:y.shape},e,{isFrom:!0}),H(a,i,i),h.add(i),g.setItemGraphicEl(a,i),q.push(i)}).remove(function(a){var r=_.getItemGraphicEl(a);h.remove(r)}).execute(),w.get("label.show")&&h.add(fe(q)),this._shape=b,this._data=g;function E(a,r){if(b)if(ne(b)){var i=ie(b.slice(7),{}),u=i.getBoundingRect(),l=u.width,n=u.height;l>n?(n=a*2/l*n,l=a*2):(l=a*2/n*l,n=a*2);var c=r?0:C-l/2,v=r?0:x-n/2;return i=ie(b.slice(7),{},new Ye(c,v,l,n)),r&&(i.x=-l/2,i.y=-n/2),i}else if(p){var m=r?-a[0]:C-a[0],f=r?-a[1]:x-a[1];return G("rect",m,f,a[0]*2,a[1]*2)}else{var m=r?-a:C-a,f=r?-a:x-a;return b==="pin"?f+=a:b==="arrow"&&(f-=a),G(b,m,f,a*2,a*2)}return new We({shape:{cx:r?0:C,cy:r?0:x,r:a}})}function F(){var a=E(D);return a.style.fill=null,a.setStyle(e.getModel("outline.itemStyle").getItemStyle()),a}function ce(){var a=E(o);a.setStyle(e.getModel("backgroundStyle").getItemStyle()),a.style.fill=null,a.z2=5;var r=E(o);r.setStyle(e.getModel("backgroundStyle").getItemStyle()),r.style.stroke=null;var i=new te;return i.add(a),i.add(r),i}function N(a,r,i){var u=p?o[0]:o,l=p?I/2:o,n=g.getItemModel(a),c=n.getModel("itemStyle"),v=n.get("phase"),m=M(n.get("amplitude"),l*2),f=M(n.get("waveLength"),u*2),y=g.get("value",a),S=l-y*l*2;v=i?i.shape.phase:v==="auto"?a*Math.PI/4:v;var P=c.getItemStyle();if(!P.fill){var O=e.get("color"),z=a%O.length;P.fill=O[z]}var ge=u*2,R=new Ge({shape:{waveLength:f,radius:u,radiusY:l,cx:ge,cy:0,waterLevel:S,amplitude:m,phase:v,inverse:r},style:P,x:C,y:x});R.shape._waterLevel=S;var $=n.getModel("emphasis.itemStyle").getItemStyle();$.lineWidth=0,R.ensureState("emphasis").style=$,oe(R);var Z=E(o,!0);return Z.setStyle({fill:"white"}),R.setClipPath(Z),R}function H(a,r,i){var u=g.getItemModel(a),l=u.get("period"),n=u.get("direction"),c=g.get("value",a),v=u.get("phase");v=i?i.shape.phase:v==="auto"?a*Math.PI/4:v;var m=function(S){var P=g.count();return P===0?S:S*(.2+(P-a)/P*.8)},f=0;l==="auto"?f=m(5e3):f=typeof l=="function"?l(c,a):l;var y=0;n==="right"||n==null?y=Math.PI:n==="left"?y=-Math.PI:n==="none"?y=0:console.error("Illegal direction value for liquid fill."),n!=="none"&&u.get("waveAnimation")&&r.animate("shape",!0).when(0,{phase:v}).when(f/2,{phase:y+v}).when(f,{phase:y*2+v}).during(function(){A&&A.dirty(!0)}).start()}function fe(a){var r=w.getModel("label");function i(){var P=e.getFormattedLabel(0,"normal"),O=g.get("value",0)*100,z=g.getName(0)||e.name;return isNaN(O)||(z=O.toFixed(0)+"%"),P==null?z:P}var u={z2:10,shape:{x:de,y:he,width:(p?o[0]:o)*2,height:(p?o[1]:o)*2},style:{fill:"transparent"},textConfig:{position:r.get("position")||"inside"},silent:!0},l={style:{text:i(),textAlign:r.get("align"),textVerticalAlign:r.get("baseline")}};Object.assign(l.style,ue(r));var n=new ae(u),c=new ae(u);c.disableLabelAnimation=!0,n.disableLabelAnimation=!0;var v=new re(l),m=new re(l);n.setTextContent(v),c.setTextContent(m);var f=r.get("insideColor");m.style.fill=f;var y=new te;y.add(n),y.add(c);var S=E(o,!0);return A=new Oe({shape:{paths:a},x:C,y:x}),A.setClipPath(S),c.setClipPath(A),y}},dispose:function(){}});export{$e as a,qe as b,Ue as c,He as e,Ne as h};
