<script>
	import {
		authModal,
		authFunctions,
		closeAuthModal,
		switchAuthModal
	} from '$lib/data/authStore.js';
	import { XIcon } from 'lucide-svelte';

	let loginData = $state({ email: '', password: '' });
	let signupData = $state({ username: '', email: '', password: '', confirmPassword: '' });

	let loginError = $state('');
	let signupError = $state('');
	let isLoading = $state(false);

	async function handleLogin(e) {
		e.preventDefault();
		isLoading = true;
		loginError = '';

		const result = await authFunctions.login(loginData.email, loginData.password);

		if (!result.success) {
			loginError = result.error;
		} else {
			loginData = { email: '', password: '' };
		}

		isLoading = false;
	}

	async function handleSignup(e) {
		e.preventDefault();
		isLoading = true;
		signupError = '';

		if (signupData.password !== signupData.confirmPassword) {
			signupError = 'Passwords do not match';
			isLoading = false;
			return;
		}

		const result = await authFunctions.signup({
			username: signupData.username,
			email: signupData.email,
			password: signupData.password
		});

		if (!result.success) {
			signupError = result.error;
		} else {
			signupData = { username: '', email: '', password: '', confirmPassword: '' };
		}

		isLoading = false;
	}

	function handleOverlayClick(e) {
		if (e.target === e.currentTarget) {
			closeAuthModal();
		}
	}

	function switchToSignup() {
		switchAuthModal('signup');
		loginError = '';
	}

	function switchToLogin() {
		switchAuthModal('login');
		signupError = '';
	}
</script>

<!-- Login Modal -->
{#if $authModal.isOpen && $authModal.type === 'login'}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center p-6 backdrop-blur-sm"
		onclick={handleOverlayClick}
		role="presentation"
	>
		<div
			class="relative mx-auto w-full max-w-md rounded-2xl bg-white shadow-xl"
			role="dialog"
			aria-labelledby="login-title"
			aria-modal="true"
		>
			<div class="flex items-center justify-between border-b border-gray-200 p-6">
				<h2 id="login-title" class="text-2xl font-bold text-gray-900">Login</h2>
				<button
					class="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition-all hover:cursor-pointer hover:bg-gray-100 hover:text-gray-700"
					onclick={closeAuthModal}
					aria-label="Close modal"
				>
					<XIcon class="h-6 w-6" />
				</button>
			</div>

			<div class="p-6">
				{#if loginError}
					<div
						class="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
						role="alert"
					>
						{loginError}
					</div>
				{/if}

				<form onsubmit={handleLogin} class="space-y-4">
					<div>
						<label for="login-email" class="mb-2 block text-sm font-medium text-gray-700"
							>Email</label
						>
						<input
							id="login-email"
							type="email"
							bind:value={loginData.email}
							required
							disabled={isLoading}
							autocomplete="email"
							class="w-full rounded-xl border border-gray-300 px-4 py-3 transition-all focus:border-transparent focus:ring-2 focus:ring-gray-900 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-50"
						/>
					</div>

					<div>
						<label for="login-password" class="mb-2 block text-sm font-medium text-gray-700"
							>Password</label
						>
						<input
							id="login-password"
							type="password"
							bind:value={loginData.password}
							required
							disabled={isLoading}
							autocomplete="current-password"
							class="w-full rounded-xl border border-gray-300 px-4 py-3 transition-all focus:border-transparent focus:ring-2 focus:ring-gray-900 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-50"
						/>
					</div>

					<button
						type="submit"
						disabled={isLoading}
						class="flex w-full items-center justify-center gap-2 rounded-full bg-gray-900 px-6 py-4 font-medium text-white transition-all hover:-translate-y-0.5 hover:cursor-pointer hover:bg-black hover:shadow-lg disabled:transform-none disabled:cursor-not-allowed disabled:bg-gray-400"
					>
						{#if isLoading}
							<svg
								class="h-5 w-5 animate-spin text-white"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
							>
								<circle
									class="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									stroke-width="4"
								></circle>
								<path
									class="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								></path>
							</svg>
							Logging in...
						{:else}
							Login
						{/if}
					</button>
				</form>

				<div class="mt-6 text-center text-sm text-gray-600">
					Don't have an account?
					<button
						type="button"
						class="ml-1 font-medium text-gray-900 transition-colors hover:cursor-pointer hover:text-gray-700 disabled:cursor-not-allowed disabled:text-gray-400"
						onclick={switchToSignup}
						disabled={isLoading}
					>
						Sign up
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}

<!-- Signup Modal -->
{#if $authModal.isOpen && $authModal.type === 'signup'}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center p-6 backdrop-blur-sm"
		onclick={handleOverlayClick}
		role="presentation"
	>
		<div
			class="relative mx-auto w-full max-w-md rounded-2xl bg-white shadow-xl"
			role="dialog"
			aria-labelledby="signup-title"
			aria-modal="true"
		>
			<div class="flex items-center justify-between border-b border-gray-200 p-6">
				<h2 id="signup-title" class="text-2xl font-bold text-gray-900">Sign Up</h2>
				<button
					class="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition-all hover:cursor-pointer hover:bg-gray-100 hover:text-gray-700"
					onclick={closeAuthModal}
					aria-label="Close modal"
				>
					<XIcon class="h-6 w-6" />
				</button>
			</div>

			<div class="p-6">
				{#if signupError}
					<div
						class="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
						role="alert"
					>
						{signupError}
					</div>
				{/if}

				<form onsubmit={handleSignup} class="space-y-4">
					<div>
						<label for="signup-username" class="mb-2 block text-sm font-medium text-gray-700"
							>Username</label
						>
						<input
							id="signup-username"
							type="text"
							bind:value={signupData.username}
							required
							disabled={isLoading}
							autocomplete="username"
							class="w-full rounded-xl border border-gray-300 px-4 py-3 transition-all focus:border-transparent focus:ring-2 focus:ring-gray-900 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-50"
						/>
					</div>

					<div>
						<label for="signup-email" class="mb-2 block text-sm font-medium text-gray-700"
							>Email</label
						>
						<input
							id="signup-email"
							type="email"
							bind:value={signupData.email}
							required
							disabled={isLoading}
							autocomplete="email"
							class="w-full rounded-xl border border-gray-300 px-4 py-3 transition-all focus:border-transparent focus:ring-2 focus:ring-gray-900 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-50"
						/>
					</div>

					<div>
						<label for="signup-password" class="mb-2 block text-sm font-medium text-gray-700"
							>Password</label
						>
						<input
							id="signup-password"
							type="password"
							bind:value={signupData.password}
							required
							disabled={isLoading}
							autocomplete="new-password"
							minlength="6"
							class="w-full rounded-xl border border-gray-300 px-4 py-3 transition-all focus:border-transparent focus:ring-2 focus:ring-gray-900 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-50"
						/>
					</div>

					<div>
						<label for="signup-confirm" class="mb-2 block text-sm font-medium text-gray-700"
							>Confirm Password</label
						>
						<input
							id="signup-confirm"
							type="password"
							bind:value={signupData.confirmPassword}
							required
							disabled={isLoading}
							autocomplete="new-password"
							minlength="6"
							class="w-full rounded-xl border border-gray-300 px-4 py-3 transition-all focus:border-transparent focus:ring-2 focus:ring-gray-900 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-50"
						/>
					</div>

					<button
						type="submit"
						disabled={isLoading}
						class="flex w-full items-center justify-center gap-2 rounded-full bg-gray-900 px-6 py-4 font-medium text-white transition-all hover:-translate-y-0.5 hover:cursor-pointer hover:bg-black hover:shadow-lg disabled:transform-none disabled:cursor-not-allowed disabled:bg-gray-400"
					>
						{#if isLoading}
							<svg
								class="h-5 w-5 animate-spin text-white"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
							>
								<circle
									class="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									stroke-width="4"
								></circle>
								<path
									class="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								></path>
							</svg>
							Creating Account...
						{:else}
							Create Account
						{/if}
					</button>
				</form>

				<div class="mt-6 text-center text-sm text-gray-600">
					Already have an account?
					<button
						type="button"
						class="ml-1 font-medium text-gray-900 transition-colors hover:cursor-pointer hover:text-gray-700 disabled:cursor-not-allowed disabled:text-gray-400"
						onclick={switchToLogin}
						disabled={isLoading}
					>
						Login
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}
