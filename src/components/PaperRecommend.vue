<template>
  <div>
    <div
      v-for="(item,i) in newPapers"
      v-bind:key="i"
         style="background:#eee;padding: 10px;margin-right: 200px; margin-left: 100px">
      <Card :bordered="false">
        <Button
          slot="extra"
          @click="addPaper(item.title, item.authors.join(', '), item.url)"
          type="info" ghost>
          加入文献库
        </Button>
        <div slot="title" style="margin-right: 100px">
          <h2>{{ item.title }}</h2>
          <p style="color: #7f7f7f">中文</p>
          <p style="color: #880000"> {{ item.authors.join(', ') }}</p>
          <div style="color: #008800">{{ item.updatedTime.slice(0,10) }}
            <a href="tag.scheme" v-for="(tag, tagIndex) in item.tags"
                 v-bind:key="tagIndex">{{ tag.term }} </a>
          </div>
        </div>
        <p>{{ item.summary }}</p>
      </Card>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import { createMTdata, getAllNewPapers } from '../apis/MindTableEditorApis';
import { pushErr } from './ErrPush';

export default {
  name: 'PaperRecommend.vue',
  data() {
    return {
      newPapers: [],
    };
  },
  methods: {
    addPaper(title, author, url) {
      // window.console.info('in addpaper');
      createMTdata(
        title,
        author,
        url,
        '',
        '',
        [])
        .catch((err) => {
          window.console.error(err);
        });
    },
  },
  mounted() {
    this.newPapers = [];
    getAllNewPapers().then((res) => {
      // window.console.info(res);
      _(res.data).forEach((item) => {
        // http://fanyi.youdao.com/translate?&doctype=json&type=&i=
        // window.console.info('debug', item);
        const jsonParser = JSON.parse(item.text);
        this.newPapers.push(
          {
            title: jsonParser.paper_title,
            url: jsonParser.paper_url,
            authors: jsonParser.paper_authors,
            updatedTime: jsonParser.paper_updated_time,
            summary: jsonParser.paper_summary,
            tags: jsonParser.paper_tags,
          },
        );
      });
    }).catch((err) => {
      pushErr(this, err, true);
    });
    window.console.info('newpaepre, ', this.newPapers);
  },

};
</script>

<style scoped>
.product_content>div label.red {
  color: #880000;
}
</style>
