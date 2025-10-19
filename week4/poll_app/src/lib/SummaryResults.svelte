<script>
  import { pollActions } from '../data/polls.svelte.js';
  import { fade } from 'svelte/transition';
  import { getContext } from 'svelte';
  import { faArrowLeft, faVoteYea } from '@fortawesome/free-solid-svg-icons';
  import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
  import { handleClickOutside } from '../actions.svelte.js';

  let {
    poll = $bindable(),
    userVotesData = $bindable({}),
    closePoll,
    selectedOption = $bindable([]),
    onRevote,
    votingDisabled = $bindable(false)
  } = $props();

  let tweens = getContext('tweens');
  let progressOptions = pollActions.progressOptions(poll.id);
  function handleRevote() {
    if (onRevote) {
      onRevote();
    }
  }
</script>

<button
  onclick={(e) => {
    e.preventDefault();
    closePoll();
  }}
  class="mb-8 ml-64 rounded-lg px-4 py-2 font-semibold text-gray-600 shadow transition-colors duration-200 dark:bg-gray-500 dark:text-white
      dark:hover:bg-gray-600"
>
  <FontAwesomeIcon icon={faArrowLeft} class="mr-2" /> Back to Polls
</button>
<div class="flex flex-col items-center gap-8 px-64" in:fade={{ duration: 300 }}>
  <h2
    class="mt-6 mb-8 border-b border-gray-200 pb-1 text-3xl font-semibold text-gray-800 dark:border-gray-600 dark:text-gray-200"
  >
    Poll Summary
  </h2>
  <ul class="w-3/4">
    {#each $progressOptions.sort((a, b) => b.votes - a.votes) as option, index (option.id)}
      <li
        class="mb-2 flex flex-col rounded-lg bg-gray-50 px-3 py-2 shadow-sm dark:bg-gray-700"
        in:fade={{ duration: 200, delay: index * 100 }}
      >
        <div class="mb-1 flex items-center justify-between">
          <span class="font-medium text-gray-700 dark:text-gray-300">{option.text}</span>
          <span
            class="bg-primary-100 dark:bg-primary-200 text-primary-700 dark:text-white rounded-full px-3 py-1 text-sm font-semibold"
          >
            {option.votes} votes
          </span>
        </div>
        <div class="h-2.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-600">
          <progress
            class="bg-primary-600 dark:bg-primary-500 h-2.5 w-full rounded-full transition-all duration-600 ease-out"
            class:bg-green-500={userVotesData[poll.id] === option.id}
            class:bg-gray-400={userVotesData[poll.id] !== option.id}
            value={tweens[option.id]?.current}
          ></progress>
        </div>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
          {Math.round((tweens[option.id]?.current || 0) * 100)}%
        </p>
      </li>
    {/each}
    <p class="text-primary-600 dark:text-white w-full pt-5 pr-5 text-end text-xl">{poll.totalVotes} Total Votes</p>
  </ul>
  <div class="mt-4 flex gap-2">
    <button
      onclick={handleRevote}
      disabled={votingDisabled}
      class="text-primary-600 hover:bg-primary-700 dark:bg-primary-600 mt-6 flex w-full
             items-center justify-center gap-2 rounded-lg bg-gray-300 px-4 py-2 font-semibold transition-colors duration-200
                hover:cursor-pointer dark:text-white"
      aria-label={`Vote on ${poll.question}`}
    >
      <FontAwesomeIcon icon={faVoteYea} class="text-primary-600 text-lg dark:text-white" />
      Change Vote
    </button>
  </div>
</div>
