<script>
  import { ChevronDownIcon } from '@heroicons/vue/20/solid';
  import { writable } from 'svelte/store';
	import { fly } from 'svelte/transition';
	import { authFunctions } from '$lib/data/authStore.js';
	import { Settings2Icon } from 'lucide-svelte';


  const isOpen = writable(false);
	const { user } = $props();

</script>

<div class="relative inline-block">
  <button
    onclick={() => $isOpen = !$isOpen}
    class="inline-flex w-full justify-center gap-x-1.5 rounded-full bg-white px-3 py-2 text-sm font-semibold hover:cursor-pointer text-gray-900 shadow-xs ring-1 ring-inset ring-gray-300 focus:ring-black hover:bg-gray-50"
  >
    <img src={user.profile_picture || '/media/person-icon-1684.jpg'} alt={user.username} class="h-8 w-8 rounded-full" />
    <ChevronDownIcon aria-hidden="true" class="-mr-1 size-5 text-gray-400" />
  </button>

  {#if $isOpen}
    <div
      class="absolute right-0 z-10 mt-2 w-56 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
      transition:fly={{ y: -10, duration: 150 }}
    >
      <div class="py-1 text-gray-700 text-sm">
				<a href="/profile" class="flex gap-10 p-6 items-center hover:bg-gray-100 hover:text-gray-900 w-full text-left">
					<img src={user.profile_picture || '/media/person-icon-1684.jpg'} alt={user.username} class="h-12 w-12 rounded-full" />
					<div class="ml-2">
						<p class="text-lg">{user.username}</p>
						<p class="text-xs text-gray-500">View Profile</p>
					</div>
				</a>
        <a href="#" class="flex gap-5 px-4 py-2 hover:bg-gray-100 hover:text-gray-900 w-full text-left">
					<img src="/Image/icons/drafts-icon.svg" alt="drafts">
					Drafts
				</a>
				<a href="#" class="flex gap-5 px-4 py-2  hover:bg-gray-100 hover:text-gray-900 w-full text-left">
					<img src="/Image/icons/settings-icon.svg" alt="settings">
					Settings
				</a>
				<button
						class="flex gap-5 px-4 py-2 hover:bg-gray-100 hover:text-gray-900 w-full text-left"
						onclick={() => {
							authFunctions.logout();
						}}
					>
					<img class="" src="/Image/icons/logout-icon.svg" alt="logout"/>
						<p>Sign Out</p>
				</button>
      </div>
    </div>
  {/if}
</div>
