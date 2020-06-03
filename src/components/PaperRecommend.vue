<template>
  <div>
    <div v-if="newPapers.length === 0">
      <h1><center>你似乎来到了没有知识存在的荒原...</center></h1>
      <br>
      <h2 style="color: #5393eb"><center>快去个人档案里面添加一些兴趣方向吧~~</center></h2>
    </div>
    <div
      v-if="newPapers.length !== 0"
      v-for="(item,i) in newPapers"
      v-bind:key="i"
         style="background:#eee;padding: 10px;margin-right: 200px; margin-left: 100px">
      <Card :bordered="false">
        <Button
          slot="extra"
          @click="addPaper(
            item.title,
            item.authors.join(' and '),
            item.url)"
          type="info" ghost>
          加入文献库
        </Button>
        <div slot="title" style="margin-right: 100px">
          <h2><a :href="item.url">{{ item.title }} </a></h2>
          <p style="color: #7f7f7f"> {{ item.title_zh }}</p>
          <p style="color: #880000"> {{ item.authors.join(', ') }}</p>
          <div style="color: #008800">{{ item.updatedTime.slice(0,10) }}
            <a href='https://arxiv.org/' v-for="(tag, tagIndex) in item.tags"
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
import { createMTdata, getPaperCertainInterest, getUserDetails } from '../apis/MindTableEditorApis';
import { pushErr } from './ErrPush';

export default {
  name: 'PaperRecommend.vue',
  data() {
    return {
      newPapers: [],
      userInterest: [],
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
        'arXiv e-print',
        [])
        .catch((err) => {
          window.console.error(err);
        });
      this.$Message.success(`成功导入文章: ${title}`);
    },
  },
  mounted() {
    this.newPapers = [];
    getUserDetails().then((res) => {
      this.userInterest = res.data[0].interest.split(',');
      for (let i = 0; i < this.userInterest.length; i += 1) {
        const interest = this.userInterest[i];
        if (interest !== '' && interest !== undefined) {
          window.console.info(interest);
          getPaperCertainInterest(interest)
            .then((paperRes) => {
              _(paperRes.data)
                .forEach((item) => {
                  // http://fanyi.youdao.com/translate?&doctype=json&type=&i=
                  const jsonParser = JSON.parse(item.text);
                  // window.console.info(jsonParser);
                  this.newPapers.push(
                    {
                      title: jsonParser.paper_title,
                      url: jsonParser.paper_url,
                      authors: jsonParser.paper_authors,
                      updatedTime: jsonParser.paper_updated_time,
                      summary: jsonParser.paper_summary,
                      tags: jsonParser.paper_tags,
                      title_zh: unescape(jsonParser.paper_title_zh),
                    },
                  );
                });
            }).catch((err) => {
              pushErr(this, err, true);
            });
        }
      }
    }).catch((err) => {
      pushErr(this, err, true);
    });
  },
};
</script>

<style scoped>
.product_content>div label.red {
  color: #880000;
}
</style>
