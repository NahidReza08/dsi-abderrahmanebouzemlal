<script>
  export let progress = 0;
  export let showPercentage = true;
</script>

<div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-xl">
  <div class="flex items-center justify-between mb-3">
    <span class="text-white font-semibold">Progress</span>
    {#if showPercentage}
      <span class="text-blue-200 font-semibold">{Math.round(progress)}%</span>
    {/if}
  </div>
  <div class="w-full bg-white/10 rounded-full h-3 overflow-hidden">
    <div 
      class="bg-blue-500 h-full rounded-full transition-all duration-500 ease-out"
      style="width: {progress}%"
    ></div>
  </div>
</div>