(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[930],{53156:function(e,t,r){"use strict";r.d(t,{Z:function(){return M}});var n=r(63366),a=r(87462),o=r(67294),i=r(86010),s=r(28320),u=r(34867),c=r(94780),d=r(29628);var p=(0,r(70182).ZP)(),f=r(66500),l=r(85893);const h=["className","component","disableGutters","fixed","maxWidth","classes"],m=(0,f.Z)(),v=p("div",{name:"MuiContainer",slot:"Root",overridesResolver:(e,t)=>{const{ownerState:r}=e;return[t.root,t[`maxWidth${(0,s.Z)(String(r.maxWidth))}`],r.fixed&&t.fixed,r.disableGutters&&t.disableGutters]}}),y=e=>(0,d.Z)({props:e,name:"MuiContainer",defaultTheme:m});var b=r(98216),g=r(90948),x=r(71657);const O=function(e={}){const{createStyledComponent:t=v,useThemeProps:r=y,componentName:d="MuiContainer"}=e,p=t((({theme:e,ownerState:t})=>(0,a.Z)({width:"100%",marginLeft:"auto",boxSizing:"border-box",marginRight:"auto",display:"block"},!t.disableGutters&&{paddingLeft:e.spacing(2),paddingRight:e.spacing(2),[e.breakpoints.up("sm")]:{paddingLeft:e.spacing(3),paddingRight:e.spacing(3)}})),(({theme:e,ownerState:t})=>t.fixed&&Object.keys(e.breakpoints.values).reduce(((t,r)=>{const n=r,a=e.breakpoints.values[n];return 0!==a&&(t[e.breakpoints.up(n)]={maxWidth:`${a}${e.breakpoints.unit}`}),t}),{})),(({theme:e,ownerState:t})=>(0,a.Z)({},"xs"===t.maxWidth&&{[e.breakpoints.up("xs")]:{maxWidth:Math.max(e.breakpoints.values.xs,444)}},t.maxWidth&&"xs"!==t.maxWidth&&{[e.breakpoints.up(t.maxWidth)]:{maxWidth:`${e.breakpoints.values[t.maxWidth]}${e.breakpoints.unit}`}}))),f=o.forwardRef((function(e,t){const o=r(e),{className:f,component:m="div",disableGutters:v=!1,fixed:y=!1,maxWidth:b="lg"}=o,g=(0,n.Z)(o,h),x=(0,a.Z)({},o,{component:m,disableGutters:v,fixed:y,maxWidth:b}),O=((e,t)=>{const{classes:r,fixed:n,disableGutters:a,maxWidth:o}=e,i={root:["root",o&&`maxWidth${(0,s.Z)(String(o))}`,n&&"fixed",a&&"disableGutters"]};return(0,c.Z)(i,(e=>(0,u.Z)(t,e)),r)})(x,d);return(0,l.jsx)(p,(0,a.Z)({as:m,ownerState:x,className:(0,i.Z)(O.root,f),ref:t},g))}));return f}({createStyledComponent:(0,g.ZP)("div",{name:"MuiContainer",slot:"Root",overridesResolver:(e,t)=>{const{ownerState:r}=e;return[t.root,t[`maxWidth${(0,b.Z)(String(r.maxWidth))}`],r.fixed&&t.fixed,r.disableGutters&&t.disableGutters]}}),useThemeProps:e=>(0,x.Z)({props:e,name:"MuiContainer"})});var M=O},17285:function(e,t,r){"use strict";var n;Object.defineProperty(t,"__esModule",{value:!0}),t.AmpStateContext=void 0;var a=((n=r(67294))&&n.__esModule?n:{default:n}).default.createContext({});t.AmpStateContext=a},49546:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.isInAmpMode=i,t.useAmp=function(){return i(a.default.useContext(o.AmpStateContext))};var n,a=(n=r(67294))&&n.__esModule?n:{default:n},o=r(17285);function i(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=e.ampFirst,r=void 0!==t&&t,n=e.hybrid,a=void 0!==n&&n,o=e.hasQuery,i=void 0!==o&&o;return r||a&&i}("function"===typeof t.default||"object"===typeof t.default&&null!==t.default)&&(Object.assign(t.default,t),e.exports=t.default)},16505:function(e,t,r){"use strict";var n=r(930);function a(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}Object.defineProperty(t,"__esModule",{value:!0}),t.defaultHead=p,t.default=void 0;var o,i=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var r in e)if(Object.prototype.hasOwnProperty.call(e,r)){var n=Object.defineProperty&&Object.getOwnPropertyDescriptor?Object.getOwnPropertyDescriptor(e,r):{};n.get||n.set?Object.defineProperty(t,r,n):t[r]=e[r]}return t.default=e,t}(r(67294)),s=(o=r(70148))&&o.__esModule?o:{default:o},u=r(17285),c=r(60523),d=r(49546);r(67206);function p(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0],t=[i.default.createElement("meta",{charSet:"utf-8"})];return e||t.push(i.default.createElement("meta",{name:"viewport",content:"width=device-width"})),t}function f(e,t){return"string"===typeof t||"number"===typeof t?e:t.type===i.default.Fragment?e.concat(i.default.Children.toArray(t.props.children).reduce((function(e,t){return"string"===typeof t||"number"===typeof t?e:e.concat(t)}),[])):e.concat(t)}var l=["name","httpEquiv","charSet","itemProp"];function h(e,t){return e.reduce((function(e,t){var r=i.default.Children.toArray(t.props.children);return e.concat(r)}),[]).reduce(f,[]).reverse().concat(p(t.inAmpMode)).filter(function(){var e=new Set,t=new Set,r=new Set,n={};return function(a){var o=!0,i=!1;if(a.key&&"number"!==typeof a.key&&a.key.indexOf("$")>0){i=!0;var s=a.key.slice(a.key.indexOf("$")+1);e.has(s)?o=!1:e.add(s)}switch(a.type){case"title":case"base":t.has(a.type)?o=!1:t.add(a.type);break;case"meta":for(var u=0,c=l.length;u<c;u++){var d=l[u];if(a.props.hasOwnProperty(d))if("charSet"===d)r.has(d)?o=!1:r.add(d);else{var p=a.props[d],f=n[d]||new Set;"name"===d&&i||!f.has(p)?(f.add(p),n[d]=f):o=!1}}}return o}}()).reverse().map((function(e,r){var o=e.key||r;if(!t.inAmpMode&&"link"===e.type&&e.props.href&&["https://fonts.googleapis.com/css","https://use.typekit.net/"].some((function(t){return e.props.href.startsWith(t)}))){var s=function(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?a(Object(r),!0).forEach((function(t){n(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):a(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}({},e.props||{});return s["data-href"]=s.href,s.href=void 0,s["data-optimized-fonts"]=!0,i.default.cloneElement(e,s)}return i.default.cloneElement(e,{key:o})}))}var m=function(e){var t=e.children,r=i.useContext(u.AmpStateContext),n=i.useContext(c.HeadManagerContext);return i.default.createElement(s.default,{reduceComponentsToState:h,headManager:n,inAmpMode:d.isInAmpMode(r)},t)};t.default=m,("function"===typeof t.default||"object"===typeof t.default&&null!==t.default)&&(Object.assign(t.default,t),e.exports=t.default)},70148:function(e,t,r){"use strict";var n=r(7980),a=r(33227),o=r(88361),i=(r(92191),r(85971)),s=r(52715),u=r(91193);function c(e){var t=function(){if("undefined"===typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"===typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function(){var r,n=u(e);if(t){var a=u(this).constructor;r=Reflect.construct(n,arguments,a)}else r=n.apply(this,arguments);return s(this,r)}}Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var d=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var r in e)if(Object.prototype.hasOwnProperty.call(e,r)){var n=Object.defineProperty&&Object.getOwnPropertyDescriptor?Object.getOwnPropertyDescriptor(e,r):{};n.get||n.set?Object.defineProperty(t,r,n):t[r]=e[r]}return t.default=e,t}(r(67294));var p=function(e){i(r,e);var t=c(r);function r(e){var o;return a(this,r),(o=t.call(this,e)).emitChange=function(){o._hasHeadManager&&o.props.headManager.updateHead(o.props.reduceComponentsToState(n(o.props.headManager.mountedInstances),o.props))},o._hasHeadManager=o.props.headManager&&o.props.headManager.mountedInstances,o}return o(r,[{key:"componentDidMount",value:function(){this._hasHeadManager&&this.props.headManager.mountedInstances.add(this),this.emitChange()}},{key:"componentDidUpdate",value:function(){this.emitChange()}},{key:"componentWillUnmount",value:function(){this._hasHeadManager&&this.props.headManager.mountedInstances.delete(this),this.emitChange()}},{key:"render",value:function(){return null}}]),r}(d.Component);t.default=p},9008:function(e,t,r){e.exports=r(16505)}}]);