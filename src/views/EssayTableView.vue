<template>
  <div>
    <EssayTable
      :tableData="essays"
      :essayTotal="essayTotal"
      @reloadData="reloadData"
    />
  </div>
</template>

<script>
import EssayTable from '../components/EssayTable';
import { reqSingle } from '../apis/util';
import { pushErr } from '../components/ErrPush';

export default {
  name: 'EssayTableView',
  components: { EssayTable },
  data() {
    return {
      essays: [],
      essayTotal: 0,
    };
  },
  methods: {
    reloadData(page) {
      if (page === undefined || page < 1) {
        // eslint-disable-next-line no-param-reassign
        page = 1;
      }
      // window.console.log('current page', page);
      reqSingle('/api/essays/', 'GET', { page }).then((res) => {
        // window.console.log('get page data', res);
        this.essays = res.data.results;
        this.essayTotal = res.data.count;
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
