"use strict";
Object.defineProperty(exports, "__esModule", { value: true });

exports.Toy = void 0;

var Toy = /** @class */ (function () {
    function Toy() {
        this.a = '';
        this.toyname = "Robert"; // Protected properties are usually prefixed with an underscore _
    }
    Object.defineProperty(Toy.prototype, "name", {
        get: function () {
            return this.toyname;
        },
        set: function (x) {
            this.toyname = x;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Toy.prototype, "age", {
        get: function () {
            return this.toyage;
        },
        set: function (x) {
            this.toyage = x;
        },
        enumerable: false,
        configurable: true
    });
    return Toy;
}());

exports.Toy = Toy;
