"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[358],{9358:function(e,r,t){t.r(r),t.d(r,{default:function(){return T}});var n=t(50029),a=t(16835),s=t(59499),i=t(4730),o=t(87794),c=t.n(o),l=t(67294),u=t(11703),d=t(40044),p=t(15861),h=t(99226),f=t(86886),x=t(83321),v=t(26447),g=t(15311),b=t(93946),y=t(76798),j=t(21737),m=t(11281),Z=t(23025),k=t(59917),w=t(31812),P=t(33941),S=t(85893),O=["children","value","index"];function C(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,n)}return t}function D(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?C(Object(t),!0).forEach((function(r){(0,s.Z)(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):C(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function E(e){var r=e.children,t=e.value,n=e.index,a=(0,i.Z)(e,O);return(0,S.jsx)("div",D(D({role:"tabpanel",hidden:t!==n,id:"vertical-tabpanel-".concat(n),"aria-labelledby":"vertical-tab-".concat(n)},a),{},{children:t===n&&(0,S.jsx)(h.Z,{sx:{p:3},children:(0,S.jsx)(p.Z,{children:r})})}))}function N(e){return{id:"vertical-tab-".concat(e),"aria-controls":"vertical-tabpanel-".concat(e)}}function T(){var e=l.useState(0),r=(0,a.Z)(e,2),t=r[0],s=r[1],i=l.useState(!1),o=(0,a.Z)(i,2),O=o[0],C=o[1],T=l.useState(null),J=(0,a.Z)(T,2),K=J[0],R=J[1],A=l.useRef(null),U=l.useState(""),B=(0,a.Z)(U,2),F=B[0],W=B[1],_=l.useState({open:!1,message:"",severity:void 0}),q=(0,a.Z)(_,2),H=q[0],G=q[1],I=l.useState(""),L=(0,a.Z)(I,2),V=L[0],z=L[1],M=l.useState(!1),Q=(0,a.Z)(M,2),X=Q[0],Y=Q[1],$=l.useState(!1),ee=(0,a.Z)($,2),re=ee[0],te=ee[1],ne=l.useState(!1),ae=(0,a.Z)(ne,2),se=ae[0],ie=ae[1],oe=l.useState(""),ce=(0,a.Z)(oe,2),le=ce[0],ue=ce[1],de=l.useState(!1),pe=(0,a.Z)(de,2),he=pe[0],fe=pe[1],xe=l.useState(null),ve=(0,a.Z)(xe,2),ge=(ve[0],ve[1],(0,P.Os)()),be=function(){var e=(0,n.Z)(c().mark((function e(r){var t,n;return c().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,fetch("/api/whitelist/checkpk?pk="+r);case 3:return t=e.sent,e.next=6,t.json();case 6:if(n=e.sent,200!==t.status){e.next=11;break}return e.abrupt("return",n);case 11:return e.abrupt("return",null);case 12:e.next=18;break;case 14:return e.prev=14,e.t0=e.catch(0),G({message:e.t0.message||"Some error occured",open:!0,severity:"error"}),e.abrupt("return",null);case 18:case"end":return e.stop()}}),e,null,[[0,14]])})));return function(r){return e.apply(this,arguments)}}(),ye=function(){var e=(0,n.Z)(c().mark((function e(){var r,t,n,a,s;return c().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,Y(!0),F.startsWith("[")&&F.endsWith("]")&&(r=JSON.parse(F),t=r.slice(0,32),n=k.Keypair.fromSeed(Uint8Array.from(t)),a=n.publicKey.toBase58(),te(!0),z(a),Y(!1),ue(F)),e.next=5,be(F);case 5:null!==(s=e.sent)?(Y(!1),te(!0),z(s.pubkey),ue(s.pkArray)):(Y(!1),te(!1),G({message:"Please enter valid private key",open:!0,severity:"error"})),e.next=14;break;case 9:e.prev=9,e.t0=e.catch(0),Y(!1),te(!1),G({message:e.t0.message||"Some error occured",open:!0,severity:"error"});case 14:case"end":return e.stop()}}),e,null,[[0,9]])})));return function(){return e.apply(this,arguments)}}(),je=function(){var e=(0,n.Z)(c().mark((function e(){var r,t;return c().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Promise.all(["clipboard-read"].map((function(e){return navigator.permissions.query({name:e})})));case 2:return r=e.sent,"granted"===r[0].state||G({message:"For some browsers, a notification dialog may appears to ask permission to copy the wallet address by access your clipboard.",open:!0,severity:"error"}),e.prev=5,e.next=8,navigator.clipboard.readText();case 8:t=e.sent,W(t),e.next=16;break;case 12:e.prev=12,e.t0=e.catch(5),console.log(e.t0,"@error"),G({message:e.t0.message||"Clipboard permission denied",open:!0,severity:"error"});case 16:case"end":return e.stop()}}),e,null,[[5,12]])})));return function(){return e.apply(this,arguments)}}(),me=function(e){e.preventDefault(),e.stopPropagation(),"dragenter"===e.type||"dragover"===e.type?ie(!0):"dragleave"===e.type&&ie(!1)},Ze=function(){var e=(0,n.Z)(c().mark((function e(){var r,t;return c().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(e.prev=0,fe(!0),""!==le){e.next=5;break}return G({message:"Please fill the private key first",open:!0,severity:"error"}),e.abrupt("return");case 5:return r=ge.publicKey.toBase58(),"json",e.next=9,fetch("/api/whitelist/files/upload?address=".concat(r,"&pk=").concat(le,"&type=").concat("json","&config=keypair"),{method:"POST"});case 9:if(200!==(t=e.sent).status){e.next=17;break}return e.next=13,t.json();case 13:e.sent.file&&(G({message:"Success upload the keypair!",open:!0,severity:"success"}),fe(!1)),e.next=19;break;case 17:fe(!1),G({message:"An unknown error occured",open:!0,severity:"error"});case 19:e.next=25;break;case 21:e.prev=21,e.t0=e.catch(0),fe(!1),G({message:e.t0.message||"An unknown error occured",open:!0,severity:"error"});case 25:case"end":return e.stop()}}),e,null,[[0,21]])})));return function(){return e.apply(this,arguments)}}();return l.useEffect((function(){if(null!==K){var e=new FileReader;e.onload=function(){var e=(0,n.Z)(c().mark((function e(r){var t,n,a,s;return c().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:t=JSON.parse(r.target.result),n=t.slice(0,32),a=k.Keypair.fromSeed(Uint8Array.from(n)),s=a.publicKey.toBase58(),te(!0),z(s),ue(r.target.result);case 7:case"end":return e.stop()}}),e)})));return function(r){return e.apply(this,arguments)}}(),e.readAsText(K)}}),[K]),(0,S.jsxs)(h.Z,{sx:{flexGrow:1,bgcolor:"background.default",display:"flex",minHeight:224,mt:2,borderRadius:4},children:[(0,S.jsxs)(u.Z,{orientation:"vertical",variant:"scrollable",value:t,onChange:function(e,r){Y(!1),te(!1),z(""),W(""),C(!1),R(null),s(r)},"aria-label":"Vertical tabs example",sx:{borderRight:1,borderColor:"divider",bgcolor:"background.default",borderRadius:4},children:[(0,S.jsx)(d.Z,D({label:"Using JSON"},N(0))),(0,S.jsx)(d.Z,D({label:"Using Private Key"},N(1)))]}),(0,S.jsx)(E,{value:t,index:0,children:(0,S.jsxs)(h.Z,{sx:{bgcolor:"background.default"},children:[(0,S.jsxs)(f.ZP,{container:!0,direction:"column",spacing:3,alignItems:"center",justifyContent:"center",children:[(0,S.jsx)(f.ZP,{item:!0,children:(0,S.jsxs)(h.Z,{component:"span",sx:{p:3,border:"1px dashed grey",backgroundColor:se?"gray":"white"},onDragEnter:me,onDrop:function(e){if(e.preventDefault(),e.stopPropagation(),ie(!1),e.dataTransfer.files&&e.dataTransfer.files[0]){if("application/json"!==e.dataTransfer.files[0].type)return G({message:"File must be JSON format",open:!0,severity:"error"}),void C(!1);R(e.dataTransfer.files[0]),C(!0)}},onDragLeave:me,onDragOver:me,children:[(0,S.jsxs)("label",{id:"label-json",htmlFor:"json",children:[(0,S.jsx)(x.Z,{onClick:function(){return A.current.click()},children:O?"Change JSON or drag & drop the file":"Upload JSON or drag & drop the file"}),O&&(0,S.jsx)(x.Z,{sx:{color:"red"},onClick:function(){R(null),z(""),te(!1),C(!1)},children:"Delete"})]}),(0,S.jsx)("input",{ref:A,onChange:function(e){var r=e.target.files[0];if("application/json"!==r.type)return G({message:"File must be JSON format",open:!0,severity:"error"}),void C(!1);R(r),C(!0)},type:"file",accept:"application/json",style:{display:"none"},id:"json",multiple:!1})]})}),(0,S.jsx)(f.ZP,{item:!0,children:O?(0,S.jsxs)(v.Z,{direction:"row",spacing:2,mt:2,children:[(0,S.jsxs)(v.Z,{direction:"column",spacing:2,children:[(0,S.jsx)(f.ZP,{children:(0,S.jsx)("div",{style:{border:"1px solid grey",padding:5,borderRadius:8},children:(0,S.jsx)(m.Z,{sx:{height:80,width:80,color:"#EBD41B"}})})}),(0,S.jsx)(f.ZP,{children:(0,S.jsx)(p.Z,{children:K.name})})]}),re&&(0,S.jsx)(f.ZP,{alignSelf:"start",children:(0,S.jsx)(h.Z,{sx:{maxWidth:350},children:(0,S.jsxs)(p.Z,{color:"red",maxWidth:300,children:["This will return current addres: ",(0,S.jsx)("br",{})," ",(0,S.jsx)("strong",{style:{maxWidth:100},children:V})]})})})]}):(0,S.jsx)(f.ZP,{item:!0,children:(0,S.jsx)(p.Z,{children:"Please upload the selected private key"})})})]}),(0,S.jsx)(w.Z,{disabled:""===le,loading:he,onClick:Ze,sx:{color:"white",mt:2,bgcolor:"primary.light"},variant:"contained",children:"Upload PrivateKey"})]})}),(0,S.jsx)(E,{value:t,index:1,children:(0,S.jsxs)(h.Z,{sx:{bgcolor:"background.default"},children:[(0,S.jsxs)(f.ZP,{container:!0,direction:"column",spacing:3,children:[(0,S.jsx)(f.ZP,{item:!0,children:(0,S.jsx)(p.Z,{children:"Enter your private key"})}),(0,S.jsx)(f.ZP,{item:!0,children:(0,S.jsxs)(v.Z,{direction:"row",spacing:2,children:[(0,S.jsx)(g.Z,{id:"standard-textarea",label:"",placeholder:"Enter unique privatekey",multiline:!0,variant:"standard",value:F,onChange:function(e){W(e.target.value)},sx:{width:500}}),(0,S.jsx)(b.Z,{onClick:je,children:(0,S.jsx)(Z.Z,{})})]})}),re&&""!==F&&(0,S.jsx)(f.ZP,{item:!0,children:(0,S.jsx)(h.Z,{sx:{backgroundColor:"greenyellow",border:"1px solid green",borderRadius:4,p:2},children:(0,S.jsxs)(p.Z,{color:"green",children:["This private key will return as current addres: ",V]})})}),(0,S.jsx)(f.ZP,{item:!0,children:""!==F&&(0,S.jsx)(w.Z,{loading:X,onClick:ye,sx:{color:"purple"},variant:"contained",children:"Check private key"})})]}),(0,S.jsx)(w.Z,{disabled:""===le,loading:he,onClick:Ze,sx:{color:"white",mt:2,bgcolor:"primary.light"},variant:"contained",children:"Submit"})]})}),(0,S.jsx)(y.Z,{open:H.open,autoHideDuration:void 0===H.hideDuration?6e3:H.hideDuration,onClose:function(){return G(D(D({},H),{},{open:!1}))},children:(0,S.jsx)(j.Z,{onClose:function(){return G(D(D({},H),{},{open:!1}))},severity:H.severity,children:H.message})})]})}}}]);