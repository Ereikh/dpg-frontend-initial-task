/**
 * Types
 */
import type {StatusCodes} from "http-status-codes";

/**
 * Интерфейс ответа от сервера
 */
interface IServerResponse {
	success: boolean;
	data: any;
}

/**
 * Интерфейс успешного ответа от сервера
 */
export interface ISuccessResponse<T> extends IServerResponse {
	success: true;
	data: T;
	cached?: boolean;
}

/**
 * Интерфейс тела ошибки
 */
export interface IErrorResponseBody {
	isCanceled?: boolean;
	isNetworkError?: boolean;
	code: StatusCodes;
	message: string;
}

/**
 * Интерфейс неудачного ответа от сервера
 */
export interface IErrorResponse extends IServerResponse {
	success: false;
	data: IErrorResponseBody;
}

/**
 * Универсальный ответ от сервера (С ошибкой и без)
 */
export type ServerResponse<T> = Promise<ISuccessResponse<T> | IErrorResponse>;
