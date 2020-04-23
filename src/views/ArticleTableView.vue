<template>
  <div>
    <MindTable :data="tableData"/>
  </div>
</template>

<script>
import _ from 'lodash';
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
  computed: {
    // eslint-disable-next-line vue/return-in-computed-property
    tableData() {
      let ret = [];
      _(this.articles).forEach((article) => {
        ret = _.concat(ret, {
          id: article.id,
          title: article.title,
          author: article.author,
          url: article.url,
          note: article.note,
          ref: article.ref, // array
        });
      });
      // console.log(ret.last());
      return ret;
    },
  },
  mounted() {
    req('/api/articles/', 'GET').then((res) => {
      this.articles = res.data;
    }).catch(() => {
      errPush(this, '4000', true);
    });
  },
};
</script>

<style scoped>

</style>
