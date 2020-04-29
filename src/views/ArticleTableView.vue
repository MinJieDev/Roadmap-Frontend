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
import { pushErr } from '../components/ErrPush';

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
      }).catch((err) => {
        pushErr(this, err, true);
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
