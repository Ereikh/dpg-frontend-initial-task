/**
 * Dependence
 */
import { MathUtils } from '$lib/utils/math';
import { ObjectUtils } from '$lib/utils/object';
import { AxiosError, type AxiosResponse } from 'axios';

/**
 * Types
 */
import type { ArrayOr } from '$lib/utils/object';

/**
 * Try catch request
 * @template {any} TResponse
 * @template {any} TCatchResponse
 * @param {Promise<TResponse>} promise - Promise request
 * @param {((error: unknown) => TCatchResponse) | TCatchResponse} catchResponse - Response on catch
 * @returns {Promise<TResponse | TCatchResponse>}
 */
export async function catchrequest<TResponse, TCatchResponse, TErrorType = AxiosError>(
	promise: Promise<TResponse>,
	catchResponse: TCatchResponse | ((error: TErrorType) => TCatchResponse)
): Promise<TResponse | TCatchResponse> {
	try {
		return await promise;
	} catch (error) {
		if (typeof catchResponse === 'function') {
			return (catchResponse as (error: TErrorType) => TCatchResponse)(
				error as TErrorType
			) as TCatchResponse;
		} else {
			return catchResponse as TCatchResponse;
		}
	}
}

/**
 * Check ok status
 * @template {AxiosResponse} TResponse
 * @param {TResponse} response - Current response
 * @param {ArrayOr<number> | ((response: TResponse) => boolean)} [ok=(tresponse) => (tresponse >= 200 && tresponse <= 226)] - Statuses for okay
 * @returns {TResponse} - Current response or throw error response if is not okay
 */
export function checkokstatus<TResponse extends AxiosResponse<any>>(
	response: TResponse,
	ok: ArrayOr<number> | ((response: TResponse) => boolean) = (response) =>
		MathUtils.clampInclude(response.status, 200, 226)
): TResponse {
	if (typeof ok === 'function') {
		if (!ok(response)) {
			throw new AxiosError(
				response.data?.message || 'unknown error message data',
				response.status.toString(),
				response.config,
				response.request,
				response
			);
		}
		return response;
	}

	if (!ObjectUtils.convertToArray(ok).includes(response.status)) {
		throw new AxiosError(
			response.data?.message || 'unknown error message data',
			response.status.toString(),
			response.config,
			response.request,
			response
		);
	}
	return response;
}
