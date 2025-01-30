<!-- src/routes/+page.svelte -->
<script lang="ts">
    import { onMount, tick } from 'svelte';
    import axios from 'axios';

    type Post = {
        userId: number;
        id: number;
        title: string;
        body: string;
    };

    let posts: Post[] = [];
    let loading: boolean = true;
    let error: string = '';
    let notification: string = '';
    let isCacheUsed: boolean = false; // Флаг загрузки из кеша

    const CACHE_KEY = 'cachedPosts';

    // загрузка данных
    async function fetchPosts(): Promise<void> {
        try {
            const response = await axios.get<Post[]>('https://jsonplaceholder.typicode.com/posts');
            const data: Post[] = response.data.slice(0, 100);

            localStorage.setItem(CACHE_KEY, JSON.stringify(data));
            posts = data;
            isCacheUsed = false; // Данные загружены из API, поэтому кеш не используется
        } catch (err) {
            handleCacheFallback(err);
        } finally {
            loading = false;
            await tick();
        }
    }

    // обработка кеша
    function handleCacheFallback(err: unknown): void {
        console.error('API Error:', err);
        const cachedData = localStorage.getItem(CACHE_KEY);

        if (cachedData) {
            posts = JSON.parse(cachedData) as Post[];
            notification = 'Данные загружены из кеша';
            isCacheUsed = true;
        } else {
            error = 'Нет данных для отображения.';
        }
    }

    // загрузка при монтировании
    onMount(async () => {
        await fetchPosts();
    });

</script>

<div class="container">
    {#if isCacheUsed}
        <div class="notification">
            {notification}
            <button on:click={() => notification = ''}>×</button>
        </div>
    {/if}

    {#if loading}
        <p>Загрузка данных...</p>
    {:else if error}
        <div class="error-message">{error}</div>
    {:else}
        {#each posts as post}
            <article class="post">
                <h3>{post.title}</h3>
                <p>{post.body}</p>
            </article>
        {/each}
    {/if}
</div>

<style>
    .container {
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
    }

    .post {
        margin-bottom: 30px;
        padding: 15px;
        border-radius: 8px;
        background: #f5f5f5;
    }

    .error-message, .notification {
        padding: 15px;
        margin: 20px 0;
        border-radius: 5px;
    }

    .error-message {
        background: #ffe3e3;
        color: #cc0000;
    }

    .notification {
        background: #e3f2fd;
        color: #0d47a1;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    button {
        background: none;
        border: none;
        cursor: pointer;
        font-size: 1.2em;
    }
</style>
