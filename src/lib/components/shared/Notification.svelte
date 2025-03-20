<script lang="ts">
    export let message: string;
</script>

<div class="notification">
    {message}
</div>

<style>
    .notification {
        padding: 10px;
        background-color: #f0f0f0;
        border: 1px solid #ccc;
        margin-bottom: 20px;
        border-radius: 4px;
    }
</style>