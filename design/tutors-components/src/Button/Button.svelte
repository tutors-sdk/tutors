<script>
    import clsx from 'clsx';
    export let disabled = false;
  </script>
  
  <button
    {disabled}
    class={clsx(
      'btn',
    )}
    on:click><slot /></button
  >
  