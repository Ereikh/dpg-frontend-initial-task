<script lang="ts">
	import { onMount } from 'svelte';
	import type { IPost } from '$lib/api/types/models/post';
	import Post from '$lib/components/feed/Post.svelte';

	export let posts: IPost[] = [];
</script>

<div class="posts">
	{#each posts as post (post.id)}
		<Post {post} />
	{/each}
</div>

<style lang="scss">
	.posts {
		display: flex;
		flex-direction: column;
		gap: 5px;
		width: 500px;
	}

	.error {
		color: red;
		font-size: 16px;
	}
</style>
