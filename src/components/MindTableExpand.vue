<template>
  <div>
    <Row class="expand-row">
      <Col span="24">
        <span class="expand-key">Authors: </span>
        <span class="expand-value">{{ row.author }}</span>
      </Col>
    </Row>
    <Row>
      <Col span="8">
        <span class="expand-key">Url: </span>
        <span class="expand-value">{{ row.url }}</span>
      </Col>
      <Col span="8">
        <span class="expand-key">Journal/Conference: </span>
        <span class="expand-value">{{ row.journal }}</span>
      </Col>
      <Col span="8">
        <span class="expand-key">Year: </span>
        <span class="expand-value">{{ row.year }}</span>
      </Col>
    </Row>
  </div>
</template>

<script>
export default {
  name: 'MindTableExpand',
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
