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
	 * @description Метод для получения постов
	 */
	const loadData = async () => {
		const response = await PostsApi.getAll();

		if (!response.success) {
			throw new Error(getReasonPhrase(response.data.code));
		}
		const res = {posts: response.data, cached: response.cached};
		return res.posts
	};

</script>

{#await loadData()}
	<Loader />
{:then posts}
	<Feed {posts} />
{:catch e}
	<ErrorComponent>
		{e}
	</ErrorComponent>
{/await}