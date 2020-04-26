<template>
  <div>
    <MindTable
      :tableData="articles"
      @reloadData="reloadData"
    />
  </div>
</template>

<script>
import MindTable from '../components/MindTable';
import { req } from '../apis/util';
import errPush from '../components/ErrPush';

export default {
  name: 'ArticleTableView',
  components: { MindTable },
  data() {
    return {
      articles: [],
    };
  },
  methods: {
    reloadData() {
      req('/api/articles/', 'GET').then((res) => {
        this.articles = res.data;
      }).catch(() => {
        errPush(this, '4000', true);
      });
    },
  },
  mounted() {
    this.reloadData();
  },
};
</script>

<style scoped>

</style>
