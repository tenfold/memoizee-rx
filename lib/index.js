"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var memoizee = require("memoizee");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
function memoizeeRx(toWrap, options) {
    if (options === void 0) { options = {}; }
    var disposeSymbol = Symbol('___dispose');
    var newOptions = Object.assign({
        normalizer: function (args) {
            return Array.from(args);
        },
    }, options, {
        dispose: function (value) {
            value[disposeSymbol]();
        },
    });
    return memoizee(function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var result$ = toWrap.apply(this, args);
        var expired$ = new rxjs_1.Subject();
        var sharedResult$ = result$.pipe(operators_1.takeUntil(expired$), operators_1.shareReplay());
        sharedResult$[disposeSymbol] = function () { return expired$.next(); };
        return sharedResult$;
    }, newOptions);
}
exports.memoizeeRx = memoizeeRx;
