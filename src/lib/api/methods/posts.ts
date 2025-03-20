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
import type { ISuccessResponse, ServerResponse } from '$lib/api/types/response/utils';
import { getPostsFromLocalStorage, savePostsToLocalStorage } from '$lib/utils/localStorage';

/**
 * Get All
 * @description Запрос для получения данных по постам
 * @returns {ServerResponse<IPostsResponse>}
 */
function getAll(): ServerResponse<IPostsResponse> {
	const cachedPosts = getPostsFromLocalStorage<IPostsResponse>('cachedPosts');

	return catchrequest(
		api
			.get('/posts')
			.then(checkokstatus)
			.then((r) => {
				const posts = r.data;
				savePostsToLocalStorage('cachedPosts', posts);
				return {
					success: true,
					data: posts,
					cached: false
				} as ISuccessResponse<IPostsResponse>;
			}),
		(error: unknown | AxiosError) => {
			ErrorUtils.log(error, "API: error from 'getAll'");
			if (cachedPosts) {
				return {
					success: true,
					data: cachedPosts,
					cached: true
				};
			}

			return ErrorUtils.getErrorReason(error);
		}
	);
}

export default {
	getAll
};
