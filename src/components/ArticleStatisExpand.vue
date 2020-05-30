<template>
  <div>
    <Row class="expand-row">
      <Col span="24">
        <span class="expand-key">出现文献: </span>
        <span class="expand-value" v-html="artContent"></span>
      </Col>
    </Row>
  </div>
</template>

<script>
export default {
  name: 'ArticleStatisExpand',
  props: {
    row: Object,
  },
  data() {
    return {
      artContent: '',
    };
  },
  mounted() {
  },
};
</script>

<style scoped>
  .expand-row{
    margin-bottom: 16px;
  }
</style>

