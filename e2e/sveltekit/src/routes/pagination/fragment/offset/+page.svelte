<script lang="ts">
  import { paginatedFragment, graphql } from '$houdini';

  $: queryResult = graphql(`
    query UserFragmentOffsetQuery @load {
      user(id: "1", snapshot: "pagination-fragment-offset") {
        ...OffsetFragment
      }
    }
  `);

  $: fragmentResult = paginatedFragment(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    $queryResult.data!.user,
    graphql(`
      fragment OffsetFragment on User {
        friendsList(limit: 2) @paginate {
          name
        }
      }
    `)
  );
</script>

<div id="result">
  {$fragmentResult.data.friendsList.map((node) => node?.name).join(', ')}
</div>

<button id="next" on:click={() => fragmentResult?.loadNextPage()}>next</button>
