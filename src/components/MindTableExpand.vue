<template>
  <div style="font-size: 14.5px">
    <Row class="expand-row">
      <Col span="24">
        <span class="expand-key">题名: </span>
        <span class="expand-value">{{ row.title }}</span>
      </Col>
    </Row>
    <Row class="expand-row">
      <Col span="24">
        <span class="expand-key">作者: </span>
        <span class="expand-value">{{ row.author }}</span>
      </Col>
    </Row>
    <Row class="expand-row">
      <Col span="8">
        <span class="expand-key">链接: </span>
        <span class="expand-value">{{ row.url }}</span>
      </Col>
      <Col span="8">
        <span class="expand-key">年份: </span>
        <span class="expand-value">{{ row.years }}</span>
      </Col>
    </Row>
    <Row class="expand-row">
      <Col span="8">
        <span class="expand-key">期刊/会议: </span>
        <span class="expand-value">{{ row.journal }}</span>
      </Col>
      <Col span="8">
        <span class="expand-key">卷号: </span>
        <span class="expand-value">{{ row.volume }}</span>
      </Col>
      <Col span="8">
        <span class="expand-key">页面: </span>
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
