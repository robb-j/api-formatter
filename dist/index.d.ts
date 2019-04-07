export declare type Messages = string[] | string;
export declare type CatchBlock = (api: Api) => void;
export declare type ErrorHook = (error: Error, api?: Api) => void;
export declare class MetaBlock {
    success: boolean;
    messages: string[];
    status: number;
    name?: string;
    version?: string;
    constructor(success: boolean, messages: Messages, status: number, api: Api);
}
export interface IApiOptions {
    name?: string;
    version?: string;
    httpFail?: boolean;
}
/** A class for creating a json envelope for sending api responses */
export declare class Api {
    /** Creates an express middleware that adds req.api & res.api instances */
    static middleware(options: IApiOptions): (req: any, res: any, next: () => void) => void;
    protected req: any;
    protected res: any;
    name?: string;
    version?: string;
    httpFail: boolean;
    /** Creates a new Api instance from an Express responses */
    constructor(req: any, res: any, options?: IApiOptions);
    /** Sends an api failure */
    sendFail(messages: Messages, status?: number): void;
    /** Sends a data response */
    sendData(data: any, status?: number): void;
    /** Catches errors and sends the message as a sendFail */
    catch(block: CatchBlock, hook?: ErrorHook): Promise<void>;
    protected pickStatusCode(status?: number): number;
    protected makeEnvelope(success: boolean, messages: Messages, status: number, data: any): any;
}
