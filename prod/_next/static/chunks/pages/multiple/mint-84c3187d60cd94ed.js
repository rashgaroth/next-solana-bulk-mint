(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[388],{68227:function(e,r,n){"use strict";n.d(r,{Z:function(){return i}});n(67294);var t=n(84808),o=n(98456),s=n(85893);function i(e){var r=e.open,n=e.handleClose;return(0,s.jsx)("div",{children:(0,s.jsx)(t.Z,{sx:{color:"#fff",zIndex:function(e){return e.zIndex.drawer+1}},open:r,onClick:n,children:(0,s.jsx)(o.Z,{color:"inherit"})})})}},52472:function(e,r,n){"use strict";var t=n(67294),o=n(33941),s=n(11163),i=n(85893);r.Z=function(e){var r=e.children,n=(0,o.Os)(),c=(0,s.useRouter)();return(0,t.useEffect)((function(){var e="/"===c.asPath,r="/home"===c.asPath;(e||r)&&(n.connected?c.push("/home",void 0,{shallow:!1}):c.push("/",void 0,{shallow:!1})),n.connected||c.push("/",void 0,{shallow:!1})}),[n.connected]),(0,i.jsx)("div",{children:r})}},71511:function(e,r,n){"use strict";n.r(r);var t=n(59499),o=n(50029),s=n(87794),i=n.n(s),c=n(67294),l=n(53156),a=n(87918),d=n(86886),u=n(15861),h=n(99226),p=n(26447),b=n(85071),g=n(76798),f=n(21737),x=n(59874),j=n(11163),y=n(31812),v=n(33941),m=n(9008),k=n.n(m),w=n(5152),P=n.n(w),F=n(68227),O=n(52472),Z=n(85893);function C(e,r){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);r&&(t=t.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),n.push.apply(n,t)}return n}function S(e){for(var r=1;r<arguments.length;r++){var n=null!=arguments[r]?arguments[r]:{};r%2?C(Object(n),!0).forEach((function(r){(0,t.Z)(e,r,n[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):C(Object(n)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(n,r))}))}return e}var _=P()((function(){return Promise.all([n.e(450),n.e(333),n.e(920),n.e(358)]).then(n.bind(n,9358))}),{ssr:!0,loadableGenerated:{webpack:function(){return[9358]}}}),D=(0,x.Z)((function(e){return{container:{background:"linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)",animation:"$gradient 15s ".concat(e.transitions.easing.easeInOut," infinite"),minHeight:"100vh",padding:"4rem 0",flex:1,zIndex:1e3,backgroundSize:"400% 400%",position:"relative"},"@keyframes gradient":{"0%":{backgroundPosition:"0% 50%"},"50%":{backgroundPosition:"100% 50%"},"100%":{backgroundPosition:"0% 50%"}}}}));r.default=function(){var e=(0,j.useRouter)(),r=(0,c.useState)({open:!1,message:"",severity:void 0}),n=r[0],t=r[1],s=D(),x=(0,v.Os)(),m=(0,c.useState)(!1),w=m[0],P=m[1],C=(0,c.useState)(!1),E=C[0],N=C[1],T=function(){var r=(0,o.Z)(i().mark((function r(){return i().wrap((function(r){for(;;)switch(r.prev=r.next){case 0:N(!0),e.push("/multiple/select-type",void 0,{shallow:!1});case 2:case"end":return r.stop()}}),r)})));return function(){return r.apply(this,arguments)}}(),R=function(){var r=(0,o.Z)(i().mark((function r(){var n,t,o;return i().wrap((function(r){for(;;)switch(r.prev=r.next){case 0:return r.prev=0,N(!0),n=x.publicKey.toBase58(),r.next=5,fetch("/api/whitelist/check-cache-config?address=".concat(n));case 5:if(200!==(t=r.sent).status){r.next=12;break}return r.next=9,t.json();case 9:(o=r.sent).isExist&&e.push("/multiple/home",void 0,{shallow:!1}),o.isKeypairExist&&e.push("/multiple/select-type",void 0,{shallow:!1});case 12:N(!1),r.next=18;break;case 15:r.prev=15,r.t0=r.catch(0),console.error(r.t0,"@error get");case 18:case"end":return r.stop()}}),r,null,[[0,15]])})));return function(){return r.apply(this,arguments)}}();return(0,c.useEffect)((function(){R()}),[]),(0,Z.jsx)(O.Z,{children:(0,Z.jsxs)("div",{className:s.container,children:[(0,Z.jsxs)(l.Z,{children:[(0,Z.jsxs)("h1",{style:{color:"#FFF"},children:["Launch Sugar ",(0,Z.jsx)(a.Z,{label:(0,Z.jsx)("p",{style:{color:"#FFF"},children:"Beta"}),sx:{borderRadius:2,backgroundColor:"#e73c7e"}})," "]}),(0,Z.jsxs)(d.ZP,{container:!0,direction:"column",children:[(0,Z.jsx)(d.ZP,{item:!0,children:(0,Z.jsx)(u.Z,{color:"white",variant:"h2",mb:2,children:"Before you start"})}),(0,Z.jsx)(d.ZP,{item:!0,children:(0,Z.jsxs)("div",{children:[(0,Z.jsx)(k(),{children:(0,Z.jsx)("title",{children:"Preparing"})}),(0,Z.jsxs)(h.Z,{sx:{backgroundColor:"white",borderRadius:4,backgroundSize:"400% 400%",backgroundPosition:"100% 50%",p:2},children:[(0,Z.jsx)("h1",{style:{fontWeight:"bold"},color:"black",children:"The Disclaimers"}),(0,Z.jsxs)("div",{children:["This process will required the private key that will mint the NFTs, if you using this apps without the conversation between you & ",(0,Z.jsx)("b",{style:{color:"purple"},children:"NVP"}),". do not continue! ",(0,Z.jsx)("br",{}),"\u2666 The ",(0,Z.jsx)("strong",{style:{color:"red"},children:"private key"})," will be displayed as (account).json ",(0,Z.jsx)("br",{}),"\u2666 The ",(0,Z.jsx)("strong",{style:{color:"red"},children:"private key"})," needs agreement between"," ",(0,Z.jsx)("b",{style:{color:"purple"},children:"NVP"})," and the user(s) ",(0,Z.jsx)("br",{}),"\u2666 The ",(0,Z.jsx)("strong",{style:{color:"red"},children:"private key"})," will be encoded to the server and decode it to the client ",(0,Z.jsx)("br",{}),"\u2666 The ",(0,Z.jsx)("strong",{style:{color:"red"},children:"private key"})," required will be use for mint the NFTs"," ",(0,Z.jsx)("code",{style:{backgroundColor:"grey",padding:2,color:"#FFF",borderRadius:4},children:"$sugar mint"})," ",(0,Z.jsx)("br",{})]}),x.connected?(0,Z.jsx)(_,{}):(0,Z.jsx)("h2",{children:"Please Connect Wallet .."}),(0,Z.jsx)("h1",{style:{fontWeight:"bold"},color:"black",children:"The Steps"}),(0,Z.jsxs)("div",{children:["After uploading the ",(0,Z.jsx)("strong",{style:{color:"red"},children:"private key"}),", you need to follow the steps below: ",(0,Z.jsx)("br",{}),"1. Create Sugar (Upload config / Create config from the forms). Same as"," ",(0,Z.jsx)("code",{style:{backgroundColor:"grey",padding:2,color:"#FFF",borderRadius:4},children:"$sugar launch"})," ",(0,Z.jsx)("br",{}),"2. Deploy Sugar. Same as"," ",(0,Z.jsx)("code",{style:{backgroundColor:"grey",padding:2,color:"#FFF",borderRadius:4},children:"$sugar deploy"})," ",(0,Z.jsx)("br",{}),"3. After you've been deployed the Sugar, you can check your Sugar state (Show sugar, set collection, update)"," ",(0,Z.jsxs)("code",{style:{backgroundColor:"grey",padding:2,color:"#FFF",borderRadius:4},children:["$sugar ","{SUBCOMMAND}"]})," ",(0,Z.jsx)("a",{href:"https://docs.metaplex.com/tools/sugar/commands",target:"_blank",rel:"noreferrer",style:{color:"blueviolet",textDecoration:"underline"},children:"Read more"})," ",(0,Z.jsx)("br",{}),"4. Delete or Remove your ",(0,Z.jsx)("strong",{style:{color:"red"},children:"private key"})]}),(0,Z.jsxs)(p.Z,{direction:"row",spacing:0,alignItems:"center",children:[(0,Z.jsx)(b.Z,S(S({},{inputProps:{"aria-label":"Checkbox Agreement"}}),{},{onChange:function(e){P(e.target.checked)}})),(0,Z.jsx)("p",{children:"I Agree with all the risk"})]}),(0,Z.jsx)(y.Z,{loading:E,disabled:!w,sx:{bgcolor:"primary.main",color:"#FFF"},onClick:T,children:"Submit"})]})]})})]})]}),(0,Z.jsx)(F.Z,{open:E,handleClose:void 0}),(0,Z.jsx)(g.Z,{open:n.open,autoHideDuration:void 0===n.hideDuration?6e3:n.hideDuration,onClose:function(){return t(S(S({},n),{},{open:!1}))},children:(0,Z.jsx)(f.Z,{onClose:function(){return t(S(S({},n),{},{open:!1}))},severity:n.severity,children:n.message})})]})})}},28028:function(e,r,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/multiple/mint",function(){return n(71511)}])}},function(e){e.O(0,[338,468,930,176,626,774,888,179],(function(){return r=28028,e(e.s=r);var r}));var r=e.O();_N_E=r}]);