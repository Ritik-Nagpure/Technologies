"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();

Object.defineProperty(exports, "__esModule", { value: true });
var class_1 = require("./class");
var Soft_toy = /** @class */ (function (_super) {
    __extends(Soft_toy, _super);
    function Soft_toy() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(Soft_toy.prototype, "sft", {
        get: function () {
            return this.toyname;
        },
        enumerable: false,
        configurable: true
    });
    return Soft_toy;
}(class_1.Toy));
var husky = new Soft_toy();
// console.log(husky.toyname);
console.log(husky.sft);
