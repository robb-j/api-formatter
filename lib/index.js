"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class MetaBlock {
    constructor(success, messages, status, api) {
        this.success = success;
        this.messages = (typeof messages === 'string') ? [messages] : messages;
        this.status = status;
        this.name = api.name;
        this.version = api.version;
    }
}
exports.MetaBlock = MetaBlock;
/** A class for creating a json envelope for sending api responses */
class Api {
    /** Creates an express middleware that adds req.api & res.api instances */
    // static middleware(name: String = null, version: String = null) {
    static middleware(options) {
        return (req, res, next) => {
            let api = new this(req, res, options);
            req.api = api;
            res.api = api;
            next();
        };
    }
    /** Creates a new Api instance from an Express responses */
    constructor(req, res, options = {}) {
        this.req = req;
        this.res = res;
        this.name = options.name || process.env.npm_package_name || null;
        this.version = options.version || process.env.npm_package_version || null;
        this.httpFail = options.httpFail === undefined ? true : options.httpFail;
    }
    /** Sends an api failure */
    sendFail(messages, status) {
        if (status === undefined) {
            status = this.httpFail ? 400 : 200;
        }
        this.res.status(status).send({
            meta: new MetaBlock(false, messages, status, this),
            data: null
        });
    }
    /** Sends a data response */
    sendData(data, status = 200) {
        this.res.status(status).send({
            meta: new MetaBlock(true, [], status, this),
            data: data
        });
    }
    /** Catches errors and sends the message as a sendFail */
    catch(block, hook) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield block(this);
            }
            catch (error) {
                if (hook)
                    hook(error, this);
                this.sendFail(error.message);
            }
        });
    }
}
exports.Api = Api;
//# sourceMappingURL=index.js.map