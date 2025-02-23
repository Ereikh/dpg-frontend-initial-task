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
			const cachedData = JSON.parse(localStorage.getItem('data')) || []
			const errorText = cachedData.length ? getReasonPhrase(response.data.code) : "Нет данных для отображения" 
			throw new Error(errorText)
		}

		localStorage.setItem('data', JSON.stringify(response.data))
		return response.data;
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
