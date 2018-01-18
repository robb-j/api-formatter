export declare type Messages = String[] | String;
export declare type CatchBlock = (api: Api) => void;
export declare type ErrorHook = (error: Error, api?: Api) => void;
export declare class MetaBlock {
    success: Boolean;
    messages: String[];
    status: Number;
    name?: String;
    version?: String;
    constructor(success: Boolean, messages: Messages, status: Number, api: Api);
}
export interface IApiOptions {
    name?: String;
    version?: String;
    httpFail?: Boolean;
}
/** A class for creating a json envelope for sending api responses */
export declare class Api {
    /** Creates an express middleware that adds req.api & res.api instances */
    static middleware(options: IApiOptions): (req: any, res: any, next: () => void) => void;
    private req;
    private res;
    name?: String;
    version?: String;
    httpFail: Boolean;
    /** Creates a new Api instance from an Express responses */
    constructor(req: any, res: any, options?: IApiOptions);
    /** Sends an api failure */
    sendFail(messages: Messages, status?: Number): void;
    /** Sends a data response */
    sendData(data: any, status?: Number): void;
    /** Catches errors and sends the message as a sendFail */
    catch(block: CatchBlock, hook?: ErrorHook): Promise<void>;
}
