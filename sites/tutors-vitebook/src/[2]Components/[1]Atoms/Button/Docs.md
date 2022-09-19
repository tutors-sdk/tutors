<script>
  import { Icon } from "tutors-ui";
  import { Button } from "tutors-ui";
</script>

# Button

This is the documentation page for the `<Button />` component.

## Usage

```svelte{1}
<Button colour={colour} size={size} href={href} target={target}>{content}</Button>
```

## Example

```svelte{1}
<Button colour="primary">My Button</Button>
```

<Button colour="primary">My Button</Button>

```svelte{1}
<Button colour="neutral" size="sm"><Icon icon="fluent:presenter-24-filled" colour="info" /></button>
```

<Button colour="neutral" size="sm"><Icon icon="fluent:presenter-24-filled" colour="info" /></button>
