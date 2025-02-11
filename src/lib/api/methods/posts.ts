/**
 * Dependence
 */
import { catchrequest, checkokstatus } from '$lib/api/utils/requests';
import { api } from '$lib/api/api';
import { ErrorUtils } from '$lib/utils/error';

/**
 * Types
 */
import type { AxiosError } from 'axios';
import type { IPostsResponse } from '$lib/api/types/response/posts';
import type {
	ISuccessResponse,
	IErrorResponse,
	ServerResponse
} from '$lib/api/types/response/utils';

/**
 * Local Storage Keys
 */
const POSTS_CACHE_KEY = 'cachedPosts';

/**
 * Get All
 * @description Запрос для получения данных по постам с кешированием
 * @returns {ServerResponse<IPostsResponse>}
 */
async function getAll(): ServerResponse<IPostsResponse> {
	try {
		if (localStorage.getItem(POSTS_CACHE_KEY)) {
			console.log('get from cache');
			return {
				success: true,
				data: JSON.parse(localStorage.getItem(POSTS_CACHE_KEY) as string)
			} as ISuccessResponse<IPostsResponse>;
		}
		const response = await catchrequest(
			api.get('/posts').then(checkokstatus),
			(error: unknown | AxiosError) => {
				ErrorUtils.log(error, "API: error from 'getAll'");
				return ErrorUtils.getErrorReason(error) as IErrorResponse;
			}
		);

		if (response) {
			localStorage.setItem(POSTS_CACHE_KEY, JSON.stringify(response.data));
		}

		return response as any;
	} catch {
		const cachedPosts = localStorage.getItem(POSTS_CACHE_KEY);
		if (cachedPosts) {
			return { success: true, data: JSON.parse(cachedPosts) } as ISuccessResponse<IPostsResponse>;
		} else {
			return {
				success: false,
				data: { code: 500, message: 'Нет данных для отображения.' }
			} as IErrorResponse;
		}
	}
}

export default {
	getAll
};
