<script>
  // @ts-ignore
  import SummaryResults from './SummaryResults.svelte';
  import { positionAwareScale } from './transition.js';
  import { pollActions, userVotes } from '../data/polls.svelte.js';
  import { Tween } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';
  import { setContext, onMount, onDestroy } from 'svelte';
  import { faArrowLeft, faVoteYea } from '@fortawesome/free-solid-svg-icons';
  import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';

  let { closePoll, poll = $bindable(), clickPosition } = $props();

  // State
  let selectedOption = $state(null);
  let userVotesData = $state({});
  let votingDisabled = $state(false);
  let errorMessage = $state('');
  let tweens = $state({});

  let hasVoted = $derived(userVotesData.hasOwnProperty(poll.id));

  let progressOptions = pollActions.progressOptions(poll.id);
  let unsubVotes;
  let unsubProgress;

  onMount(() => {
    unsubVotes = userVotes.subscribe((value) => {
      userVotesData = value;

      if (value[poll.id] && selectedOption === null) {
        selectedOption = value[poll.id];
      }
    });

    unsubProgress = progressOptions.subscribe(() => {
      updateTweens();
    });
  });

  onDestroy(() => {
    if (unsubVotes) unsubVotes();
    if (unsubProgress) unsubProgress();
  });

  $effect(() => {
    if ($progressOptions) {
      updateTweens();
    }
  });

  setContext('tweens', tweens);

  function updateTweens() {
    if (!$progressOptions) return;

    $progressOptions.forEach((option) => {
      if (!tweens[option.id]) {
        tweens[option.id] = new Tween(0, { duration: 600, easing: cubicOut });
      }
      tweens[option.id].target = option.progress || 0;
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    errorMessage = '';

    if (selectedOption === null) {
      errorMessage = 'Please select an option before voting.';
      votingDisabled = true;
      setTimeout(() => {
        votingDisabled = false;
      }, 2000);
      return;
    }

    votingDisabled = true;

    try {
      if (hasVoted) {
        pollActions.changeVote(poll.id, selectedOption);
      } else {
        pollActions.vote(poll.id, selectedOption);

        if (typeof pollActions.pushToEnd === 'function') {
          pollActions.pushToEnd(poll.id);
        }
      }
    } catch (error) {
      errorMessage = error.message;
    } finally {
      setTimeout(() => {
        votingDisabled = false;
      }, 500);
    }
  }

  function handleRevote() {
    if (userVotesData[poll.id]) {
      pollActions.unvote(poll.id, selectedOption);
      selectedOption = null;
      pollActions.pushToEnd(poll.id);
    }
  }
  function handleDelete() {
    if (userVotesData[poll.id]) {
      pollActions.unvote(poll.id, selectedOption);
      selectedOption = null;
    }
    pollActions.deletePoll(poll.id);
    closePoll();
  }
</script>

<main
  in:positionAwareScale={{
    duration: 500,
    startScale: 0.5,
    clickPosition: clickPosition || { x: 0, y: 0 }
  }}
  class="min-h-screen min-w-full"
>
  {#if !hasVoted}
    <button
      onclick={(e) => {
        e.preventDefault();
        closePoll();
      }}
      class="mb-8 ml-64 rounded-lg px-4 py-2 font-semibold text-gray-600 shadow transition-colors duration-200 dark:bg-gray-500 dark:text-white dark:hover:bg-gray-600"
    >
      <FontAwesomeIcon icon={faArrowLeft} class="mr-2" /> Back to Polls
    </button>

    <form
      action="vote"
      onsubmit={handleSubmit}
      class="mb-4 flex flex-col items-center gap-8 px-64 py-10"
    >
      <label for="options" class="mb-6 text-3xl font-bold text-gray-800 dark:text-gray-200">
        {poll.question}
      </label>

      {#if errorMessage}
        <p class="mt-2 animate-pulse text-sm text-red-600 dark:text-red-400" role="alert">
          {errorMessage}
        </p>
      {/if}

      <div
        class="mt-4 flex w-3/4 flex-col rounded-lg border border-gray-400 p-4 dark:border-gray-600"
      >
        {#each poll.options as option, index (option.id)}
          <div class="flex items-center py-1">
            {#if poll.type === 'multiple'}
              <input
                type="checkbox"
                name="options"
                id={`option-${index}`}
                value={option.id}
                bind:group={selectedOption}
                disabled={votingDisabled}
                class="text-primary-600 dark:text-primary-500 dark:focus:ring-primary-400 mr-2 h-4 w-4 focus:ring-gray-500"
                aria-labelledby={`label-${index}`}
              />
            {:else}
              <input
                type="radio"
                name="options"
                id={`option-${index}`}
                value={option.id}
                bind:group={selectedOption}
                disabled={votingDisabled}
                class="text-primary-600 dark:text-primary-500 focus:ring-primary-500 dark:focus:ring-primary-400 peer mr-2 h-4 w-4 hover:cursor-pointer disabled:cursor-not-allowed"
                aria-labelledby={`label-${index}`}
              />
            {/if}
            <label
              id={`label-${index}`}
              for={`option-${index}`}
              class="peer-checked:bg-primary-100 dark:peer-checked:bg-primary-900 w-full cursor-pointer rounded px-3 py-2 text-gray-700 transition-colors duration-200 peer-hover:bg-gray-200 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              {option.text}
            </label>
          </div>
        {/each}
      </div>

      <button
        type="submit"
        disabled={votingDisabled}
        class=" text-primary-600 hover:bg-primary-700 dark:bg-primary-600 mt-6 flex items-center justify-center
        gap-2 rounded-lg bg-gray-300 px-4 py-2 font-semibold transition-colors duration-200 hover:cursor-pointer
        disabled:cursor-not-allowed disabled:opacity-50 dark:text-white"
        aria-label={`Vote on ${poll.question}`}
      >
        <FontAwesomeIcon icon={faVoteYea} class="text-primary-600 text-lg dark:text-white" />
        {votingDisabled ? 'Submitting...' : 'Vote'}
      </button>
      <button
        type="button"
        onclick={handleDelete}
        class="mt-4 rounded-lg bg-red-600 px-4 py-2 font-semibold text-white shadow transition-colors duration-200 hover:cursor-pointer hover:bg-red-700
         dark:bg-red-500 dark:text-white dark:hover:bg-gray-600"
      >
        delete
      </button>
    </form>
  {:else}
    <SummaryResults
      {poll}
      {selectedOption}
      {closePoll}
      onRevote={handleRevote}
      {userVotesData}
      {votingDisabled}
    />
  {/if}
</main>
