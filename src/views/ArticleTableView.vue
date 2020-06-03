<template>
  <div>
    <MindTable
      :tableData="articles"
      :articleTotal="articleTotal"
      @reloadData="reloadData"
    />
  </div>
</template>

<script>
import MindTable from '../components/MindTable';
import { reqSingle } from '../apis/util';
import { pushErr } from '../components/ErrPush';

export default {
  name: 'ArticleTableView',
  components: { MindTable },
  data() {
    return {
      articles: [],
      articleTotal: 0,
    };
  },
  methods: {
    reloadData(page) {
      if (page === undefined || page < 1) {
        // eslint-disable-next-line no-param-reassign
        page = 1;
      }
      // window.console.log('current page', page);
      reqSingle('/api/articles/', 'GET', { page }).then((res) => {
        this.articles = res.data.results;
        this.articleTotal = res.data.count;
        // window.console.log('article total:', this.articleTotal);
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
