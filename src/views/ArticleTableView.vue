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
      let newPage = page;
      if (newPage === undefined || newPage < 1) {
        const routePage = this.$route.query.pageCurrent;
        if (routePage !== undefined && routePage > 1) {
          newPage = routePage;
        } else {
          newPage = 1;
        }
      }
      // window.console.log('reload page', newPage);
      reqSingle('/api/articles/', 'GET', { page: newPage }).then((res) => {
        this.articles = res.data.results;
        this.articleTotal = res.data.count;
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
