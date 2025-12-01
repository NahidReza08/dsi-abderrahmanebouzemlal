<script>
  import { writable } from 'svelte/store';
	import Modal from "./modal.svelte";

  export const showLogin = writable(false);
  export const showSignup = writable(false);

  let loginData = $state({ email: '', password: '' });
  let signupData = $state({ name: '', email: '', password: '', confirmPassword: '' });

  function openLogin() {
    showLogin.set(true);
  }

  function openSignup() {
    showSignup.set(true);
  }

  function closeLogin() {
    showLogin.set(false);
    loginData = { email: '', password: '' };
  }

  function closeSignup() {
    showSignup.set(false);
    signupData = { name: '', email: '', password: '', confirmPassword: '' };
  }

  async function handleLogin() {
    console.log('Login:', loginData);
    await fetch('/api/login', {

		})
    closeLogin();
  }

  async function handleSignup() {
    // Add your signup logic here
    console.log('Signup:', signupData);
    // await fetch('/api/signup', { ... })
    closeSignup();
  }

  function switchToSignup() {
    closeLogin();
    openSignup();
  }

  function switchToLogin() {
    closeSignup();
    openLogin();
  }
</script>

<!-- Trigger Buttons -->
<div class="auth-buttons">
  <button on:click={openLogin} class="btn btn-outline">Login</button>
  <button on:click={openSignup} class="btn btn-primary">Sign Up</button>
</div>

<!-- Login Modal -->
<Modal isOpen={$showLogin} title="Login" onclose={closeLogin}>
  <form on:submit|preventDefault={handleLogin} class="auth-form">
    <div class="form-group">
      <label for="login-email">Email</label>
      <input
        id="login-email"
        type="email"
        bind:value={loginData.email}
        required
        placeholder="Enter your email"
      />
    </div>

    <div class="form-group">
      <label for="login-password">Password</label>
      <input
        id="login-password"
        type="password"
        bind:value={loginData.password}
        required
        placeholder="Enter your password"
      />
    </div>

    <button type="submit" class="btn btn-primary btn-full">Login</button>

    <div class="auth-switch">
      Don't have an account?
      <button type="button" class="link-btn" onclick={switchToSignup}>Sign up</button>
    </div>
  </form>
</Modal>

<!-- Signup Modal -->
<Modal isOpen={$showSignup} title="Sign Up" onclose={closeSignup}>
  <form on:submit|preventDefault={handleSignup} class="auth-form">
    <div class="form-group">
      <label for="signup-name">Full Name</label>
      <input
        id="signup-name"
        type="text"
        bind:value={signupData.name}
        required
        placeholder="Enter your full name"
      />
    </div>

    <div class="form-group">
      <label for="signup-email">Email</label>
      <input
        id="signup-email"
        type="email"
        bind:value={signupData.email}
        required
        placeholder="Enter your email"
      />
    </div>

    <div class="form-group">
      <label for="signup-password">Password</label>
      <input
        id="signup-password"
        type="password"
        bind:value={signupData.password}
        required
        placeholder="Create a password"
      />
    </div>

    <div class="form-group">
      <label for="signup-confirm">Confirm Password</label>
      <input
        id="signup-confirm"
        type="password"
        bind:value={signupData.confirmPassword}
        required
        placeholder="Confirm your password"
      />
    </div>

    <button type="submit" class="btn btn-primary btn-full">Create Account</button>

    <div class="auth-switch">
      Already have an account?
      <button type="button" class="link-btn" on:click={switchToLogin}>Login</button>
    </div>
  </form>
</Modal>

<style>
  .auth-buttons {
    display: flex;
    gap: 10px;
  }

  .btn {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.3s ease;
  }

  .btn-primary {
    background: #3b82f6;
    color: white;
  }

  .btn-primary:hover {
    background: #2563eb;
  }

  .btn-outline {
    background: transparent;
    border: 1px solid #3b82f6;
    color: #3b82f6;
  }

  .btn-outline:hover {
    background: #3b82f6;
    color: white;
  }

  .btn-full {
    width: 100%;
    margin: 10px 0;
  }

  .auth-form {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  label {
    font-weight: 500;
    color: #374151;
  }

  input {
    padding: 10px;
    border: 1px solid #d1d5db;
    border-radius: 5px;
    font-size: 14px;
  }

  input:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  .auth-switch {
    text-align: center;
    margin-top: 15px;
    color: #6b7280;
  }

  .link-btn {
    background: none;
    border: none;
    color: #3b82f6;
    cursor: pointer;
    text-decoration: underline;
  }

  .link-btn:hover {
    color: #2563eb;
  }
</style>