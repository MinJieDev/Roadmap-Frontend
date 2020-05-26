<template>
  <div>
    <Row class="expand-row">
      <Col span="24">
        <span class="expand-key">Abstract: </span>
        <span class="expand-value">{{ row.abstract }}</span>
      </Col>
    </Row>
  </div>
</template>

<script>
export default {
  name: 'MDeditorTableExpand',
  props: {
    row: Object,
  },
};
</script>

<style scoped>
  .expand-row{
    margin-bottom: 16px;
  }
</style>
