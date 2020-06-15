/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./server/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./server/index.ts":
/*!*************************!*\
  !*** ./server/index.ts ***!
  \*************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! express */ "express");
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var body_parser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! body-parser */ "body-parser");
/* harmony import */ var body_parser__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(body_parser__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var pouchdb__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! pouchdb */ "pouchdb");
/* harmony import */ var pouchdb__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(pouchdb__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _lib_processor__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./lib/processor */ "./server/lib/processor.ts");
/* harmony import */ var multer__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! multer */ "multer");
/* harmony import */ var multer__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(multer__WEBPACK_IMPORTED_MODULE_4__);
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};





var db = new pouchdb__WEBPACK_IMPORTED_MODULE_2___default.a("workspaces");
db.sync("http://admin:admin@localhost:5984/workspace").catch(function (e) { return console.error(e); });
var app = express__WEBPACK_IMPORTED_MODULE_0___default()();
var multer = multer__WEBPACK_IMPORTED_MODULE_4___default()({
    storage: multer__WEBPACK_IMPORTED_MODULE_4___default.a.memoryStorage()
});
app.use(body_parser__WEBPACK_IMPORTED_MODULE_1___default.a.json());
app.use(body_parser__WEBPACK_IMPORTED_MODULE_1___default.a.text());
app.post("/:ws/download", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var filepath, ws, doc, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, Object(_lib_processor__WEBPACK_IMPORTED_MODULE_3__["download"])(req.body)];
            case 1:
                filepath = _a.sent();
                ws = req.params.ws;
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                return [4 /*yield*/, db.get(ws)];
            case 3:
                doc = _a.sent();
                doc.files.push(filepath);
                return [3 /*break*/, 5];
            case 4:
                e_1 = _a.sent();
                doc = {
                    _id: ws,
                    files: [filepath]
                };
                return [3 /*break*/, 5];
            case 5: return [4 /*yield*/, db.put(doc)];
            case 6:
                _a.sent();
                res.status(200).send({ done: true, path: filepath, ws: doc });
                return [2 /*return*/];
        }
    });
}); });
app.post("/:ws/import", multer.single("upload"), function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var file, filepath, ws, doc, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                file = req.file;
                return [4 /*yield*/, Object(_lib_processor__WEBPACK_IMPORTED_MODULE_3__["convert"])(file.buffer)];
            case 1:
                filepath = _a.sent();
                ws = req.params.ws;
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                return [4 /*yield*/, db.get(ws)];
            case 3:
                doc = _a.sent();
                doc.files.push(filepath);
                return [3 /*break*/, 5];
            case 4:
                e_2 = _a.sent();
                doc = {
                    _id: ws,
                    files: [filepath]
                };
                return [3 /*break*/, 5];
            case 5: return [4 /*yield*/, db.put(doc)];
            case 6:
                _a.sent();
                res.status(200).send({ done: true, path: filepath, ws: doc });
                return [2 /*return*/];
        }
    });
}); });
app.listen(3001);


/***/ }),

/***/ "./server/lib/processor.ts":
/*!*********************************!*\
  !*** ./server/lib/processor.ts ***!
  \*********************************/
/*! exports provided: download, convert */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "download", function() { return download; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "convert", function() { return convert; });
/* harmony import */ var promise_fs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! promise-fs */ "promise-fs");
/* harmony import */ var promise_fs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(promise_fs__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! path */ "path");
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var youtube_dl__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! youtube-dl */ "youtube-dl");
/* harmony import */ var youtube_dl__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(youtube_dl__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var uuidv4__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! uuidv4 */ "uuidv4");
/* harmony import */ var uuidv4__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(uuidv4__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var fluent_ffmpeg__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! fluent-ffmpeg */ "fluent-ffmpeg");
/* harmony import */ var fluent_ffmpeg__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(fluent_ffmpeg__WEBPACK_IMPORTED_MODULE_4__);
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};





//@ts-ignore
youtube_dl__WEBPACK_IMPORTED_MODULE_2___default.a.setYtdlBinary("/Library/Frameworks/Python.framework/Versions/3.8/bin/youtube-dl");
function download(url) {
    return __awaiter(this, void 0, void 0, function () {
        var basedir, e_1, uuid, outPath, realOut;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    basedir = path__WEBPACK_IMPORTED_MODULE_1___default.a.join(process.cwd(), "processor");
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, promise_fs__WEBPACK_IMPORTED_MODULE_0___default.a.mkdir(basedir)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _a.sent();
                    return [3 /*break*/, 4];
                case 4:
                    uuid = Object(uuidv4__WEBPACK_IMPORTED_MODULE_3__["uuid"])();
                    outPath = path__WEBPACK_IMPORTED_MODULE_1___default.a.join(basedir, uuid + ".%(ext)s");
                    realOut = path__WEBPACK_IMPORTED_MODULE_1___default.a.join(basedir, uuid + ".mp3");
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            youtube_dl__WEBPACK_IMPORTED_MODULE_2___default.a.exec(url, ["-x", "--audio-format", "mp3", "--audio-quality", "3", "-o", outPath], { cwd: basedir }, function (err, output) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    if (err) {
                                        reject(err);
                                    }
                                    else {
                                        output.forEach(function (s) { return console.log(s); });
                                        resolve(realOut);
                                    }
                                    return [2 /*return*/];
                                });
                            }); });
                        })];
            }
        });
    });
}
function convert(input) {
    return __awaiter(this, void 0, void 0, function () {
        var basedir, e_2, uuid, inPath, outPath;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    basedir = path__WEBPACK_IMPORTED_MODULE_1___default.a.join(process.cwd(), "processor");
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, promise_fs__WEBPACK_IMPORTED_MODULE_0___default.a.mkdir(basedir)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    e_2 = _a.sent();
                    return [3 /*break*/, 4];
                case 4:
                    uuid = Object(uuidv4__WEBPACK_IMPORTED_MODULE_3__["uuid"])();
                    inPath = path__WEBPACK_IMPORTED_MODULE_1___default.a.join(basedir, uuid + "-in");
                    return [4 /*yield*/, promise_fs__WEBPACK_IMPORTED_MODULE_0___default.a.writeFile(inPath, input)];
                case 5:
                    _a.sent();
                    outPath = path__WEBPACK_IMPORTED_MODULE_1___default.a.join(basedir, uuid + ".mp3");
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            fluent_ffmpeg__WEBPACK_IMPORTED_MODULE_4___default()(inPath)
                                .noVideo()
                                .audioQuality(3)
                                .on("error", function (err) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    reject(err);
                                    return [2 /*return*/];
                                });
                            }); })
                                .on("end", function (done) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, promise_fs__WEBPACK_IMPORTED_MODULE_0___default.a.unlink(inPath)];
                                        case 1:
                                            _a.sent();
                                            resolve(outPath);
                                            return [2 /*return*/];
                                    }
                                });
                            }); })
                                .save(outPath);
                        })];
            }
        });
    });
}


/***/ }),

/***/ "body-parser":
/*!******************************!*\
  !*** external "body-parser" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("body-parser");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),

/***/ "fluent-ffmpeg":
/*!********************************!*\
  !*** external "fluent-ffmpeg" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("fluent-ffmpeg");

/***/ }),

/***/ "multer":
/*!*************************!*\
  !*** external "multer" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("multer");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),

/***/ "pouchdb":
/*!**************************!*\
  !*** external "pouchdb" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("pouchdb");

/***/ }),

/***/ "promise-fs":
/*!*****************************!*\
  !*** external "promise-fs" ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("promise-fs");

/***/ }),

/***/ "uuidv4":
/*!*************************!*\
  !*** external "uuidv4" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("uuidv4");

/***/ }),

/***/ "youtube-dl":
/*!*****************************!*\
  !*** external "youtube-dl" ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("youtube-dl");

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc2VydmVyL2luZGV4LnRzIiwid2VicGFjazovLy8uL3NlcnZlci9saWIvcHJvY2Vzc29yLnRzIiwid2VicGFjazovLy9leHRlcm5hbCBcImJvZHktcGFyc2VyXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiZXhwcmVzc1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcImZsdWVudC1mZm1wZWdcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJtdWx0ZXJcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJwYXRoXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwicG91Y2hkYlwiIiwid2VicGFjazovLy9leHRlcm5hbCBcInByb21pc2UtZnNcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJ1dWlkdjRcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJ5b3V0dWJlLWRsXCIiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EseUNBQXlDLGlDQUFpQztRQUMxRSxnSEFBZ0gsbUJBQW1CLEVBQUU7UUFDckk7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVB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Ozs7Ozs7OztBQ3ZFRCx3Qzs7Ozs7Ozs7Ozs7QUNBQSxvQzs7Ozs7Ozs7Ozs7QUNBQSwwQzs7Ozs7Ozs7Ozs7QUNBQSxtQzs7Ozs7Ozs7Ozs7QUNBQSxpQzs7Ozs7Ozs7Ozs7QUNBQSxvQzs7Ozs7Ozs7Ozs7QUNBQSx1Qzs7Ozs7Ozs7Ozs7QUNBQSxtQzs7Ozs7Ozs7Ozs7QUNBQSx1QyIsImZpbGUiOiJzZXJ2ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NlcnZlci9pbmRleC50c1wiKTtcbiIsImltcG9ydCBleHByZXNzIGZyb20gXCJleHByZXNzXCI7XG5pbXBvcnQgYm9keVBhcnNlciBmcm9tIFwiYm9keS1wYXJzZXJcIjtcbmltcG9ydCBpbyBmcm9tIFwic29ja2V0LmlvXCI7XG5pbXBvcnQgUG91Y2hEQiBmcm9tIFwicG91Y2hkYlwiO1xuaW1wb3J0IHtjb252ZXJ0LCBkb3dubG9hZH0gZnJvbSBcIi4vbGliL3Byb2Nlc3NvclwiO1xuXG5pbXBvcnQgTXVsdGVyIGZyb20gXCJtdWx0ZXJcIjtcblxuY29uc3QgZGIgPSBuZXcgUG91Y2hEQihcIndvcmtzcGFjZXNcIik7XG5kYi5zeW5jKFwiaHR0cDovL2FkbWluOmFkbWluQGxvY2FsaG9zdDo1OTg0L3dvcmtzcGFjZVwiKS5jYXRjaChlID0+IGNvbnNvbGUuZXJyb3IoZSkpXG5cbmNvbnN0IGFwcCA9IGV4cHJlc3MoKTtcblxuY29uc3QgbXVsdGVyID0gTXVsdGVyKHtcbiAgICBzdG9yYWdlOiBNdWx0ZXIubWVtb3J5U3RvcmFnZSgpXG59KTtcblxuYXBwLnVzZShib2R5UGFyc2VyLmpzb24oKSk7XG5hcHAudXNlKGJvZHlQYXJzZXIudGV4dCgpKTtcblxuYXBwLnBvc3QoXCIvOndzL2Rvd25sb2FkXCIsIGFzeW5jIChyZXEsIHJlcykgPT4ge1xuICAgIGNvbnN0IGZpbGVwYXRoID0gYXdhaXQgZG93bmxvYWQocmVxLmJvZHkpXG4gICAgY29uc3Qgd3MgPSByZXEucGFyYW1zLndzO1xuXG4gICAgbGV0IGRvYztcbiAgICB0cnkge1xuICAgICAgICBkb2MgPSBhd2FpdCBkYi5nZXQ8e2ZpbGVzOiBzdHJpbmdbXX0+KHdzKVxuICAgICAgICBkb2MuZmlsZXMucHVzaChmaWxlcGF0aCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBkb2MgPSB7XG4gICAgICAgICAgICBfaWQ6IHdzLFxuICAgICAgICAgICAgZmlsZXM6IFtmaWxlcGF0aF1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGF3YWl0IGRiLnB1dChkb2MpO1xuXG4gICAgcmVzLnN0YXR1cygyMDApLnNlbmQoe2RvbmU6IHRydWUsIHBhdGg6IGZpbGVwYXRoLCB3czogZG9jfSk7XG59KVxuXG5cbmFwcC5wb3N0KFwiLzp3cy9pbXBvcnRcIiwgbXVsdGVyLnNpbmdsZShcInVwbG9hZFwiKSwgYXN5bmMgKHJlcSwgcmVzKSA9PiB7XG4gICAgY29uc3QgZmlsZSA9IHJlcS5maWxlO1xuICAgIGNvbnN0IGZpbGVwYXRoID0gYXdhaXQgY29udmVydChmaWxlLmJ1ZmZlcik7XG4gICAgY29uc3Qgd3MgPSByZXEucGFyYW1zLndzO1xuXG4gICAgbGV0IGRvYztcbiAgICB0cnkge1xuICAgICAgICBkb2MgPSBhd2FpdCBkYi5nZXQ8e2ZpbGVzOiBzdHJpbmdbXX0+KHdzKVxuICAgICAgICBkb2MuZmlsZXMucHVzaChmaWxlcGF0aCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBkb2MgPSB7XG4gICAgICAgICAgICBfaWQ6IHdzLFxuICAgICAgICAgICAgZmlsZXM6IFtmaWxlcGF0aF1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGF3YWl0IGRiLnB1dChkb2MpO1xuXG4gICAgcmVzLnN0YXR1cygyMDApLnNlbmQoe2RvbmU6IHRydWUsIHBhdGg6IGZpbGVwYXRoLCB3czogZG9jfSk7XG59KVxuXG5hcHAubGlzdGVuKDMwMDEpO1xuIiwiaW1wb3J0IGZzIGZyb20gXCJwcm9taXNlLWZzXCI7XG5pbXBvcnQgeyBSZWFkU3RyZWFtIH0gZnJvbSBcImZzXCI7XG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IHl0ZGwgZnJvbSBcInlvdXR1YmUtZGxcIjtcblxuaW1wb3J0IHsgdXVpZCBhcyB1dWlkdjQgfSBmcm9tIFwidXVpZHY0XCI7XG5pbXBvcnQgZmZtcGVnIGZyb20gXCJmbHVlbnQtZmZtcGVnXCI7XG5cbi8vQHRzLWlnbm9yZVxueXRkbC5zZXRZdGRsQmluYXJ5KFwiL0xpYnJhcnkvRnJhbWV3b3Jrcy9QeXRob24uZnJhbWV3b3JrL1ZlcnNpb25zLzMuOC9iaW4veW91dHViZS1kbFwiKTtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGRvd25sb2FkKHVybDogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICBjb25zdCBiYXNlZGlyID0gcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksIFwicHJvY2Vzc29yXCIpO1xuXG4gICAgdHJ5IHtcbiAgICAgICAgYXdhaXQgZnMubWtkaXIoYmFzZWRpcik7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyBpZ25vcmVcbiAgICB9XG5cbiAgICBjb25zdCB1dWlkID0gdXVpZHY0KCk7XG5cbiAgICBjb25zdCBvdXRQYXRoID0gcGF0aC5qb2luKGJhc2VkaXIsIHV1aWQgKyBcIi4lKGV4dClzXCIpO1xuICAgIGNvbnN0IHJlYWxPdXQgPSBwYXRoLmpvaW4oYmFzZWRpciwgdXVpZCArIFwiLm1wM1wiKTtcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZTxzdHJpbmc+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgeXRkbC5leGVjKFxuICAgICAgICAgICAgdXJsLFxuICAgICAgICAgICAgW1wiLXhcIiwgXCItLWF1ZGlvLWZvcm1hdFwiLCBcIm1wM1wiLCBcIi0tYXVkaW8tcXVhbGl0eVwiLCBcIjNcIiwgXCItb1wiLCBvdXRQYXRoXSxcbiAgICAgICAgICAgIHsgY3dkOiBiYXNlZGlyIH0sXG4gICAgICAgICAgICBhc3luYyAoZXJyLCBvdXRwdXQpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG91dHB1dC5mb3JFYWNoKHMgPT4gY29uc29sZS5sb2cocykpO1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJlYWxPdXQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICk7XG4gICAgfSk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjb252ZXJ0KGlucHV0OiBCdWZmZXIgfCBSZWFkU3RyZWFtKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICBjb25zdCBiYXNlZGlyID0gcGF0aC5qb2luKHByb2Nlc3MuY3dkKCksIFwicHJvY2Vzc29yXCIpO1xuXG4gICAgdHJ5IHtcbiAgICAgICAgYXdhaXQgZnMubWtkaXIoYmFzZWRpcik7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyBpZ25vcmVcbiAgICB9XG5cbiAgICBjb25zdCB1dWlkID0gdXVpZHY0KCk7XG5cbiAgICBjb25zdCBpblBhdGggPSBwYXRoLmpvaW4oYmFzZWRpciwgdXVpZCArIFwiLWluXCIpO1xuICAgIGF3YWl0IGZzLndyaXRlRmlsZShpblBhdGgsIGlucHV0KTtcblxuICAgIGNvbnN0IG91dFBhdGggPSBwYXRoLmpvaW4oYmFzZWRpciwgdXVpZCArIFwiLm1wM1wiKTtcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZTxzdHJpbmc+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgZmZtcGVnKGluUGF0aClcbiAgICAgICAgICAgIC5ub1ZpZGVvKClcbiAgICAgICAgICAgIC5hdWRpb1F1YWxpdHkoMylcbiAgICAgICAgICAgIC5vbihcImVycm9yXCIsIGFzeW5jIChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAub24oXCJlbmRcIiwgYXN5bmMgKGRvbmUpID0+IHtcbiAgICAgICAgICAgICAgICBhd2FpdCBmcy51bmxpbmsoaW5QYXRoKTtcbiAgICAgICAgICAgICAgICByZXNvbHZlKG91dFBhdGgpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5zYXZlKG91dFBhdGgpO1xuICAgIH0pO1xufVxuIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiYm9keS1wYXJzZXJcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZXhwcmVzc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJmbHVlbnQtZmZtcGVnXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIm11bHRlclwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJwYXRoXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInBvdWNoZGJcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicHJvbWlzZS1mc1wiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJ1dWlkdjRcIik7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwieW91dHViZS1kbFwiKTsiXSwic291cmNlUm9vdCI6IiJ9