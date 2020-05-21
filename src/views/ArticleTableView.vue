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
import { reqSingle } from '../apis/util';
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
    reloadData(page) {
      if (page === undefined) {
        // eslint-disable-next-line no-param-reassign
        page = 1;
      }
      reqSingle('/api/articles/', 'GET', { page }).then((res) => {
        window.console.log('get page data', res);
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
