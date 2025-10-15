<script lang="ts">
  import type { Lo } from "@tutors/tutors-model-lib";
  import { TreeView, createTreeViewCollection, useTreeView } from "@skeletonlabs/skeleton-svelte";
  import { onMount } from "svelte";
  import LoReference from "./LoReference.svelte";

  let { lo, expandState = "expanded" }: { lo: Lo; expandState?: "expanded" | "collapsed" | "auto" } = $props();

  type Node = { id: string; name: string; lo?: Lo; children?: Node[] };

  function mapLoToNode(item: any): Node {
    const children = (item?.toc as any[] | undefined)?.map(mapLoToNode);
    return {
      id: item?.route || item?.title,
      name: item?.title || "",
      lo: item as Lo,
      children
    };
  }

  const rootChildren = ((lo as any)?.toc as any[] | undefined)?.map(mapLoToNode) || [];

  const collection = createTreeViewCollection<Node>({
    nodeToValue: (node) => node.id,
    nodeToString: (node) => node.name,
    rootNode: { id: "root", name: "", children: rootChildren, lo }
  });

  const id = $props.id();
  const treeView = useTreeView({ id, collection });

  onMount(() => {
    if (expandState === "expanded") {
      treeView().expand();
    } else if (expandState === "collapsed") {
      treeView().collapse();
    } else {
      // 'auto' -> leave default behavior
    }
  });
</script>

<TreeView.Provider value={treeView}>
  <TreeView.Tree>
    {#each collection.rootNode.children || [] as node, index (node)}
      {@render treeNode(node, [index])}
    {/each}
  </TreeView.Tree>
</TreeView.Provider>

{#snippet treeNode(node: Node, indexPath: number[])}
  <TreeView.NodeProvider value={{ node, indexPath }}>
    {#if node.children?.length}
      <TreeView.Branch>
        <TreeView.BranchControl>
          <TreeView.BranchIndicator />
          <TreeView.BranchText class="py-0.5">
            {#if node.lo}
              <LoReference lo={node.lo} indent={indexPath.length * 1} />
            {/if}
          </TreeView.BranchText>
        </TreeView.BranchControl>
        <TreeView.BranchContent>
          <TreeView.BranchIndentGuide />
          {#each node.children as childNode, childIndex (childNode)}
            {@render treeNode(childNode, [...indexPath, childIndex])}
          {/each}
        </TreeView.BranchContent>
      </TreeView.Branch>
    {:else}
      <TreeView.Item class="py-0.5">
        {#if node.lo}
          <LoReference lo={node.lo} indent={indexPath.length * 1} />
        {/if}
      </TreeView.Item>
    {/if}
  </TreeView.NodeProvider>
{/snippet}
