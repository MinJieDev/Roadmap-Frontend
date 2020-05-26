<template>
  <div>
    <Table row-key="id"
           :columns="columns"
           :data="data"
           border
           ref="selection">
    </Table>
  </div>
</template>

<script>
export default {
  name: 'MarkdownEditorTable',
  props: {

  },
  data() {
    return {
      columns: [],
    };
  },
};
</script>

<style scoped>

</style>
