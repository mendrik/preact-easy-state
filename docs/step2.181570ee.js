parcelRequire=function(e,r,n,t){var i="function"==typeof parcelRequire&&parcelRequire,o="function"==typeof require&&require;function u(n,t){if(!r[n]){if(!e[n]){var f="function"==typeof parcelRequire&&parcelRequire;if(!t&&f)return f(n,!0);if(i)return i(n,!0);if(o&&"string"==typeof n)return o(n);var c=new Error("Cannot find module '"+n+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[n][1][r]||r};var l=r[n]=new u.Module(n);e[n][0].call(l.exports,p,l,l.exports,this)}return r[n].exports;function p(e){return u(p.resolve(e))}}u.isParcelRequire=!0,u.Module=function(e){this.id=e,this.bundle=u,this.exports={}},u.modules=e,u.cache=r,u.parent=i,u.register=function(r,n){e[r]=[function(e,r){r.exports=n},{}]};for(var f=0;f<n.length;f++)u(n[f]);if(n.length){var c=u(n[n.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=c:"function"==typeof define&&define.amd?define(function(){return c}):t&&(this[t]=c)}return u}({103:[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.Step2=void 0;var t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},e=require("../../decorators/view"),o=require("../../util/quill-component"),r=require("preact"),n=function(){var t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var o in e)e.hasOwnProperty(o)&&(t[o]=e[o])};return function(e,o){function r(){this.constructor=e}t(e,o),e.prototype=null===o?Object.create(o):(r.prototype=o.prototype,new r)}}(),u=function(e,o,r,n){var u,c=arguments.length,i=c<3?o:null===n?n=Object.getOwnPropertyDescriptor(o,r):n;if("object"===("undefined"==typeof Reflect?"undefined":t(Reflect))&&"function"==typeof Reflect.decorate)i=Reflect.decorate(e,o,r,n);else for(var p=e.length-1;p>=0;p--)(u=e[p])&&(i=(c<3?u(i):c>3?u(o,r,i):u(o,r))||i);return c>3&&i&&Object.defineProperty(o,r,i),i},c=function(t){function o(){return null!==t&&t.apply(this,arguments)||this}return n(o,t),o.prototype.render=function(){return(0,r.h)("div",null,"Step 2")},o=u([e.View],o)}(o.QuillComponent);exports.Step2=c;
},{"../../decorators/view":52,"../../util/quill-component":39,"preact":10}]},{},[103], null)
//# sourceMappingURL=/preact-easy-state/step2.181570ee.map