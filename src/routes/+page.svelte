<script lang="ts">
	/**
	 * Dependence
	 */
	import PostsApi from '$lib/api/methods/posts';
	import { getReasonPhrase } from 'http-status-codes';

	/**
	 * Components
	 */
	import Feed from '$lib/components/feed/Feed.svelte';
	import Loader from '$lib/components/shared/Loader.svelte';
	import ErrorComponent from '$lib/components/shared/Error.svelte';

	/**
	 * Load data
	 * @description Метод для получения постов с кешированием
	 */
	const loadData = async () => {
		try {
			const response = await PostsApi.getAll();

			if ('success' in response && response.success) {
				return response.data;
			} else {
				throw new Error(getReasonPhrase(response.data.code));
			}
		} catch (error) {
			const cachedPosts = localStorage.getItem('cachedPosts');
			if (cachedPosts) {
				return JSON.parse(cachedPosts);
			}
			throw new Error('Нет данных для отображения.');
		}
	};
</script>

{#await loadData()}
	<Loader />
{:then posts}
	<Feed {posts} />
{:catch e}
	<ErrorComponent>
		{e.message}
	</ErrorComponent>
{/await}
