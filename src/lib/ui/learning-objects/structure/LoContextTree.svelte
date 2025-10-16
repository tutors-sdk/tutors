<script lang="ts">
  import type { Lo } from "@tutors/tutors-model-lib";
  import { TreeView, createTreeViewCollection, useTreeView } from "@skeletonlabs/skeleton-svelte";
  import { onMount } from "svelte";
  import LoReference from "./LoReference.svelte";
  import Icon from "$lib/ui/components/Icon.svelte";

  let { lo }: { lo: Lo } = $props();

  type Node = { id: string; name: string; lo?: Lo; children?: Node[] };

  function mapLoToNode(item: any, parentPath: string, index: number): Node {
    const thisPath = `${parentPath}/${index}`;
    const children = ((item?.toc as any[] | undefined) || []).map((child, i) => mapLoToNode(child, thisPath, i));
    return {
      id: item.id,
      name: item?.title || "",
      lo: item as Lo,
      children
    };
  }

  const rootChildren = ((lo as any)?.toc as any[] | undefined)?.map((child, i) => mapLoToNode(child, 'root', i)) || [];

  const collection = createTreeViewCollection<Node>({
    nodeToValue: (node) => node.id,
    nodeToString: (node) => node.name,
    rootNode: { id: "root", name: "", children: rootChildren, lo }
  });

  const id = $props.id();
  const treeView = useTreeView({ id, collection });

  onMount(() => {
    // Expand all branches by default
    treeView().expand();
    allExpanded = true;
  });

  let allExpanded = $state(true);
  function toggleExpandAll() {
    if (allExpanded) {
      treeView().collapse();
    } else {
      treeView().expand();
    }
    allExpanded = !allExpanded;
  }
</script>

<div class="flex w-full justify-center items-center gap-2 mb-2">
  <button class="btn btn-sm preset-filled" onclick={toggleExpandAll}>
    {#if allExpanded}
      <Icon type="expanded" tip="Collapse all"/>
    {:else}
      <Icon type="compacted" tip="Expand all"/>
    {/if}
  </button>
</div>

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
              <LoReference lo={node.lo} />
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
          <LoReference lo={node.lo} />
        {/if}
      </TreeView.Item>
    {/if}
  </TreeView.NodeProvider>
{/snippet}
