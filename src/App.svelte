<svelte:head>
  <!-- <script src="https://cdn.jsdelivr.net/npm/jzz" on:load={jzzLoaded}></script>
  <script src="https://cdn.jsdelivr.net/npm/jzz-midi-gear" on:load={jzzGearLoaded}></script> -->
</svelte:head>
<script>
  import { onMount } from 'svelte'
  import Scanner from './Scanner.svelte';
  export let name = 'unset';
  export let message = 'unset';
  onMount(async () => {
    let data = await (await fetch('/api')).json()
    message = data.msg
    console.log('MESSAGE: ', message)
  })
  function jzzLoaded() {
    console.log('called jzzLoaded');
  }
  function jzzGearLoaded() {
    console.log(`JZZ: ${typeof JZZ}`);
  }
</script>

<main>
<h1>{name}, {message}</h1>
  <Scanner/>
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  h1 {
    color: rebeccapurple;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
