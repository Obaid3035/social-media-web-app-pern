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
exports.__esModule = true;
exports.Gone = exports.Forbidden = exports.UnAuthorized = exports.NotFound = exports.BadRequest = exports["default"] = void 0;
var http_status_codes_1 = require("http-status-codes");
var GeneralError = /** @class */ (function (_super) {
    __extends(GeneralError, _super);
    function GeneralError(message) {
        var _this = _super.call(this) || this;
        _this.message = message;
        return _this;
    }
    GeneralError.prototype.getErrorCode = function () {
        if (this instanceof BadRequest) {
            return http_status_codes_1.StatusCodes.BAD_REQUEST;
        }
        if (this instanceof NotFound) {
            return http_status_codes_1.StatusCodes.NOT_FOUND;
        }
        if (this instanceof UnAuthorized) {
            return http_status_codes_1.StatusCodes.UNAUTHORIZED;
        }
        if (this instanceof Forbidden) {
            return http_status_codes_1.StatusCodes.FORBIDDEN;
        }
        if (this instanceof Gone) {
            return http_status_codes_1.StatusCodes.GONE;
        }
        return 500;
    };
    return GeneralError;
}(Error));
exports["default"] = GeneralError;
var BadRequest = /** @class */ (function (_super) {
    __extends(BadRequest, _super);
    function BadRequest() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return BadRequest;
}(GeneralError));
exports.BadRequest = BadRequest;
var NotFound = /** @class */ (function (_super) {
    __extends(NotFound, _super);
    function NotFound() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return NotFound;
}(GeneralError));
exports.NotFound = NotFound;
var UnAuthorized = /** @class */ (function (_super) {
    __extends(UnAuthorized, _super);
    function UnAuthorized() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return UnAuthorized;
}(GeneralError));
exports.UnAuthorized = UnAuthorized;
var Forbidden = /** @class */ (function (_super) {
    __extends(Forbidden, _super);
    function Forbidden() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Forbidden;
}(GeneralError));
exports.Forbidden = Forbidden;
var Gone = /** @class */ (function (_super) {
    __extends(Gone, _super);
    function Gone() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Gone;
}(GeneralError));
exports.Gone = Gone;
