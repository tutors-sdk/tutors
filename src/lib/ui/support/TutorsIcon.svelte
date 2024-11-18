<script lang="ts">
  interface Props {
    widthPlease?: string;
  }
  let { widthPlease = "40px" }: Props = $props();
</script>

<svg width={widthPlease} viewBox="0 0 54.5 39.4" xml:space="preserve">
  <defs />
  <g>
    <path fill="#37919b" d="M51.5,0H3C1.4,0,0,1.4,0,3v33.3c0,1.7,1.4,3,3,3h48.5c1.7,0,3-1.4,3-3V3C54.5,1.4,53.1,0,51.5,0z M50,34.8H4.5 V4.5H50V34.8z" />
    <g>
      <rect fill="#37919b" x="29" y="26.5" width="12.1" height="4.2" />
      <g> <path fill="#37919b" d="M13.4,13.5V8.7h19.1v4.8H26v17.2h-5.9V13.5H13.4z" /> </g>
    </g>
  </g>
</svg>
