<script>
  import { pollActions } from '../data/polls.svelte.js';
  import { fade } from 'svelte/transition';
  import { positionAwareScale } from './transition.js';
  import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
  import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';

  let { addingPoll = $bindable(), closePoll, clickPosition } = $props();
  let countOptions = $state(2);
  let pollType = $state('multiple');
  let question = $state('');
  let options = $state(['', '']);
  let errorMessage = $state('');

  $effect(() => {
    if (options.length < countOptions) {
      options = [...options, ''];
    } else if (options.length > countOptions) {
      options = options.slice(0, countOptions);
    }
  });

  function handleCreating(event) {
    event.preventDefault();
    if (!question.trim()) {
      errorMessage = 'Please enter a poll question.';
      return;
    }
    if (options.some((opt) => !opt.trim())) {
      errorMessage = 'Please fill in all option fields.';
      return;
    }
    if (countOptions < 2) {
      errorMessage = 'A poll must have at least two options.';
      return;
    }
    pollActions.addPoll(question, options, pollType);
    addingPoll = false;
    closePoll();
  }

  function addOption(event) {
    event.preventDefault();
    if (countOptions < 10) {
      countOptions += 1;
    } else {
      errorMessage = 'Maximum 10 options allowed.';
    }
  }

  function removeOption(event, index) {
    event.preventDefault();
    if (countOptions > 2) {
      countOptions -= 1;
      options = options.filter((_, i) => i !== index);
    } else {
      errorMessage = 'A poll must have at least two options.';
    }
  }
</script>

<button
  onclick={(e) => {
    addingPoll = false;
    e.preventDefault();
    closePoll();
  }}
  class="mb-8 ml-64 rounded-lg px-4 py-2 font-semibold text-gray-600 shadow transition-colors duration-200 dark:bg-gray-500 dark:text-white
    dark:hover:bg-gray-600"
>
  <FontAwesomeIcon icon={faArrowLeft} class="mr-2" /> Back to Polls
</button>
<div
  in:positionAwareScale={{ duration: 500, startScale: 0.5, clickPosition }}
  class="flex min-h-full max-w-md min-w-full flex-col items-center p-6 transition-colors duration-300 dark:border-gray-700"
  role="dialog"
  aria-labelledby="add-poll-title"
>
  <div class="flex w-1/3 flex-col gap-5">
    <h2 id="add-poll-title" class="mb-4 text-2xl font-bold text-gray-800 dark:text-gray-200">
      Add New Poll
    </h2>
    {#if errorMessage}
      <p
        class="mb-4 animate-pulse text-sm text-red-600 dark:text-red-400"
        role="alert"
        in:fade={{ duration: 300 }}
      >
        {errorMessage}
      </p>
    {/if}
    <form onsubmit={handleCreating} class="flex flex-col gap-4">
      <input
        type="text"
        bind:value={question}
        placeholder="Poll Question"
        class="focus:ring-primary-500 dark:focus:ring-primary-400 w-full rounded-lg border border-gray-300 bg-white p-2 text-gray-800 transition-colors duration-200 focus:ring-2 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
        aria-label="Poll question"
      />
      <div class="mb-4 flex flex-wrap gap-4">
        <label class="font-semibold text-gray-700 dark:text-gray-300" for="type">Poll Type:</label>
        <div class="flex items-center gap-2">
          <input
            type="radio"
            id="multiple"
            name="type"
            value="multiple"
            bind:group={pollType}
            class="text-primary-600 dark:text-primary-500 focus:ring-primary-500 dark:focus:ring-primary-400 h-4 w-4"
          />
          <label for="multiple" class="text-gray-700 dark:text-gray-300">Multiple Choice</label>
        </div>
        <div class="flex items-center gap-2">
          <input
            type="radio"
            id="single"
            name="type"
            value="single"
            bind:group={pollType}
            class="text-primary-600 dark:text-primary-500 focus:ring-primary-500 dark:focus:ring-primary-400 h-4 w-4"
          />
          <label for="single" class="text-gray-700 dark:text-gray-300">Single Choice</label>
        </div>
      </div>
      {#each Array(countOptions) as _, index (index)}
        <div class="flex items-center gap-2" in:fade={{ duration: 200, delay: index * 100 }}>
          <input
            type="text"
            placeholder={`Option ${index + 1}`}
            bind:value={options[index]}
            class="focus:ring-primary-500 dark:focus:ring-primary-400 w-full rounded-lg border border-gray-300 bg-white p-2 text-gray-800 transition-colors duration-200 focus:ring-2 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200"
            aria-label={`Option ${index + 1}`}
          />
          <button
            onclick={(e) => removeOption(e, index)}
            class="rounded-lg bg-red-600 px-2 py-1 text-white transition-colors duration-200 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
            aria-label={`Remove option ${index + 1}`}
            disabled={countOptions <= 2}
          >
            Remove
          </button>
        </div>
      {/each}
      <button
        onclick={addOption}
        class="rounded-lg border-2 border-dashed border-slate-600 bg-slate-100 px-4 py-2 font-semibold text-slate-700 transition-colors duration-200 hover:cursor-pointer hover:bg-slate-200 dark:bg-slate-200 dark:text-slate-800 dark:hover:bg-slate-300"
        aria-label="Add another option"
      >
        Add Another Option
      </button>
      <div class="mt-4 flex gap-2">
        <button
          type="submit"
          class="hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 w-full rounded-lg bg-gray-700 px-4 py-2 font-semibold text-white transition-colors duration-200 hover:cursor-pointer hover:ring-2 hover:ring-black hover:dark:ring-white"
          aria-label="Create poll"
        >
          Create Poll
        </button>
      </div>
    </form>
  </div>
</div>
