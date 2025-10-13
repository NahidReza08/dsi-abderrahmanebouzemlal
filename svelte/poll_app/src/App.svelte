<script>
  import { faPlus, faPoll, faVoteYea, faCheckCircle, faChartBar } from '@fortawesome/free-solid-svg-icons';
  import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
  import ItemPoll from './lib/ItemPoll.svelte';
  import FormPoll from './lib/FormPoll.svelte';
  import { pollActions, polls } from './data/polls.svelte';
  import { onMount } from 'svelte';
  import { flip } from 'svelte/animate';
  import { crossfade } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import ToggleButton from './lib/ToggleButton.svelte';

  let selectedPoll = $state(null);
  let clickPosition = $state({ x: 0, y: 0 });
  let addingPoll = $state(false);
  let currentTheme = $state('light');

  // @ts-ignore
  const { send, receive } = crossfade({
    duration: 400,
    easing: cubicOut,
    fallback() {
      return {
        duration: 400,
        easing: cubicOut,
        css: (t) => `opacity: ${t}`
      };
    }
  });

  onMount(() => {
    const savedTheme = localStorage.getItem('theme');
    if (
      savedTheme === 'dark' ||
      (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      currentTheme = 'dark';
      document.documentElement.classList.add('dark');
    } else {
      currentTheme = 'light';
      document.documentElement.classList.remove('dark');
    }
    pollActions.orderByVotes();
  });

  $effect(() => {
    if (currentTheme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  });

  function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
  }

  function showPoll(poll, event) {
    clickPosition = { x: event.clientX, y: event.clientY };
    selectedPoll = poll;
  }

  function showAddPoll(event) {
    clickPosition = {
      x: event.clientX || window.innerWidth / 2,
      y: event.clientY || window.innerHeight / 2
    };
    addingPoll = true;
  }

  function closePoll() {
    selectedPoll = null;
    addingPoll = false;
  }
  function gettext(poll) {
    const optionId = pollActions.getUserVote(poll.id)
    const option = poll.options.find(o => o.id === optionId);
    console.log(option.text);
    return option ? option.text : '';
  }
</script>

<header class="border-b border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800">
  <nav class="h-16" aria-label="Main navigation">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 items-center justify-between">
        <div class="flex items-center gap-2">
          <a href="#main" class="text-2xl font-bold text-gray-800 dark:text-gray-200">Poll App</a>
          <FontAwesomeIcon class="text-2xl text-gray-600 dark:text-gray-300" icon={faPoll} />
        </div>
        <div class="flex items-center space-x-4">
          <ToggleButton {currentTheme} {toggleTheme} />
        </div>
      </div>
    </div>
  </nav>
</header>
<main
  class="relative min-h-[calc(100vh-4rem)] w-full bg-gradient-to-br from-gray-50 to-gray-200 p-6 transition-colors duration-300 sm:p-8
  dark:from-gray-900 dark:to-gray-800"
  id="main"
  aria-label="Main app"
>
  {#if !selectedPoll && !addingPoll}
    <h1 class="mb-8 text-center text-3xl font-extrabold text-gray-800 dark:text-gray-200">Polls</h1>
    <div class="mx-auto grid max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {#each $polls as poll (poll.id)}
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
        <div
          class="relative mx-auto flex w-full max-w-sm flex-col items-center justify-between rounded-lg border border-gray-200 bg-white p-6
              shadow-md transition-all duration-300 hover:-translate-y-1 hover:cursor-pointer hover:shadow-lg dark:border-gray-700 dark:bg-gray-800 
              hover:dark:shadow-lg gap-4"
          role="article"
          aria-labelledby={`poll-${poll.id}`}
          animate:flip={{ duration: 400, easing: cubicOut }}
          in:send={{ key: poll.id }}
          out:receive={{ key: poll.id }}
          onclick={(e) => {
            e.stopPropagation();
            showPoll(poll, e);
          }}
        >
          {#if pollActions.hasVoted(poll.id)}
            <div
              class="absolute -top-2 -right-2 flex items-center gap-1 rounded-full bg-green-500 px-3 py-1 text-xs font-bold text-white shadow-lg"
            >
              <FontAwesomeIcon icon={faCheckCircle} class="text-sm" />
              Voted
            </div>
          {/if}
          <div class="mb-4">
            <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100">
              {poll.question}
            </h3>

            {#if pollActions.hasVoted(poll.id)}
              <div class="mt-4 rounded-lg bg-green-50 p-2 dark:bg-green-900/30">
                <p class="text-sm text-green-700 dark:text-green-300 flex items-center justify-center gap-2">
                  <span class="font-semibold">Your choice:</span>
                  <span class="italic">{gettext(poll)}</span>
                </p>
              </div>
            {/if}
          </div>

          <div class="flex flex-col items-center justify-between gap-8">
            <div class="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <span class="flex items-center gap-1">
                <FontAwesomeIcon icon={faChartBar} />
                {poll.totalVotes} votes
              </span>
              <span>
                {poll.options.length} options
              </span>
            </div>

            {#if pollActions.hasVoted(poll.id)}
              <button
                class="rounded-lg bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300"
              >
                View Results
              </button>
            {:else}
              <button
        class=" text-primary-600 hover:bg-primary-700 dark:bg-primary-600 flex items-center justify-center
        gap-1 rounded-lg bg-gray-300 px-4 py-2 transition-colors duration-200 hover:cursor-pointer
        disabled:cursor-not-allowed disabled:opacity-50 dark:text-white"
              >
                <FontAwesomeIcon icon={faVoteYea} />
                 Vote Now
              </button>
            {/if}
          </div>
        </div>
      {/each}
      <div
        class="mx-auto flex w-full max-w-sm flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300
             bg-white p-6 shadow-md transition-all duration-300 hover:bg-gray-100 hover:shadow-lg dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700"
      >
        <button
          onclick={showAddPoll}
          class="group bg-primary-100 hover:bg-primary-200 dark:bg-primary-200 dark:hover:bg-primary-300 text-primary-700 flex w-full items-center justify-center gap-2
              rounded-lg px-4 py-3 font-semibold transition-all duration-300 dark:text-white"
          aria-label="Add a new poll"
        >
          <FontAwesomeIcon
            class="text-primary-600 text-2xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-90 dark:text-white"
            icon={faPlus}
          />
          <span>Add New Poll</span>
        </button>
      </div>
    </div>
  {/if}
  {#if selectedPoll}
    <ItemPoll {clickPosition} poll={selectedPoll} {closePoll} />
  {/if}
  {#if $polls.length === 0}
    <div
      class="mt-10 text-center text-gray-500 dark:text-gray-400"
      in:receive={{ key: 'no-polls' }}
      out:send={{ key: 'no-polls' }}
    >
      <p class="text-lg">No polls available. Please add a new poll.</p>
    </div>
  {/if}
  {#if addingPoll}
    <FormPoll bind:addingPoll {clickPosition} {closePoll} />
  {/if}
</main>
