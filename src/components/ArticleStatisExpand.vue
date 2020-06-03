<template>
  <div>
    <Row class="expand-row">
      <Col span="24">
        <span class="expand-key">出现文献: </span>
        <span
          class="expand-value"
          v-html="artContent">
        </span>
      </Col>
    </Row>
  </div>
</template>

<script>
import _ from 'lodash';

export default {
  name: 'ArticleStatisExpand',
  props: {
    row: Object,
  },
  computed: {
    artContent() {
      // window.console.log('row', this.row);
      let content = '';
      let count = 1;
      _.forEach(this.row.articles, (item) => {
        content = `${content}<br>${count}. ${item.title}`;
        count += 1;
      });
      return content;
    },
  },
};
</script>

<style scoped>
  .expand-row{
    margin-bottom: 16px;
  }
</style>

