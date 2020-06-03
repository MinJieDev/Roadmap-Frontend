<template>
  <div style="font-size: 14.5px">
    <Row class="expand-row">
      <Col span="24">
        <span class="expand-key">Title: </span>
        <span class="expand-value">{{ row.title }}</span>
      </Col>
    </Row>
    <Row class="expand-row">
      <Col span="24">
        <span class="expand-key">Authors: </span>
        <span class="expand-value">{{ row.author }}</span>
      </Col>
    </Row>
    <Row class="expand-row">
      <Col span="8">
        <span class="expand-key">Url: </span>
        <span class="expand-value">{{ row.url }}</span>
      </Col>
      <Col span="8">
        <span class="expand-key">Year: </span>
        <span class="expand-value">{{ row.years }}</span>
      </Col>
    </Row>
    <Row class="expand-row">
      <Col span="8">
        <span class="expand-key">Journal/Conference: </span>
        <span class="expand-value">{{ row.journal }}</span>
      </Col>
      <Col span="8">
        <span class="expand-key">Volume: </span>
        <span class="expand-value">{{ row.volume }}</span>
      </Col>
      <Col span="8">
        <span class="expand-key">Page: </span>
        <span class="expand-value">{{ row.pages }}</span>
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
