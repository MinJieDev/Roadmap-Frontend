<template>
  <div>
    <h2>
      文献总数
      <Icon type="md-copy" size="large"/>
      <u id="artTotalFont">{{articleTotal}}</u>
    </h2>
    <br><br><br>

    <h2>
      阅读进度
      <Icon type="md-checkmark-circle-outline" size="large"/>
    </h2>
    <br>
    <Row :gutter="32">
      <Col span="24">
        <div
          style="margin-left: 40px; margin-top: 3px; margin-bottom: 8px; font-size: 18px;">
          {{progress.tipContent}}
        </div>
        <Progress
          :percent="progress.progressPercent"
          :success-percent="progress.successPercent" />
      </Col>
    </Row>
    <br><br><br>

    <h2>作者统计
      <Icon type="md-people" size="large"/>
    </h2>
    <div style="float: right; margin-right: 40px; font-size: 15px">
      <Tooltip content="导出全部文献作者出现频次" placement="bottom">
        <Button
          type="text" size="large"
          @click="exportAuthorStat"
          style="margin-right: 9px">
          数据导出
        </Button>
      </Tooltip>
      切换图表
      <i-switch
        size="large"
        true-color="#19be6b" false-color="#2db7f5"
        style="margin-left: 9px;"
        @on-change="onChangeViewStyle">
        <span slot="open">图</span>
        <span slot="close">表</span>
      </i-switch>
    </div>
    <br>
    <div v-if="this.viewStyle==='chart'">

    </div>
    <div v-else>
      <Table
        stripe
        :columns="columns"
        :data="getTableData">
      </Table>
    </div>
    <Modal
      v-model="authorStat.modal"
      title="导出全部文献作者频次"
      :styles="{top: '20px'}"
      @on-cancel="cancelAuthorExportModal">
      <p v-html="authorStat.content"></p>
      <p slot="header" style="text-align:center">
        <Icon type="md-checkmark-circle-outline" />
        <span>导出成功</span>
      </p>
      <div slot="footer">
        <Button
          type="primary"
          @click="copyAuthorStat">
          复制作者频次
        </Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import _ from 'lodash';
// import Schart from 'vue-schart';
import { reqSingle } from '../apis/util';
import { pushErr } from '../components/ErrPush';
import ArticleStatisExpand from './ArticleStatisExpand';

export default {
  name: 'ArticleStatistics',
  data() {
    return {
      articles: [],
      articleTotal: 0,
      authorStat: {
        modal: false,
        content: '',
        // data: [ {name: '', times: Number, articles: [] ]
        data: [],
      },
      // view: chart or table
      viewStyle: 'chart',
      readState: {
        read: 0,
        reading: 0,
        unread: 0,
      },
      progress: {
        totalPercent: 100,
        progressPercent: 100,
        successPercent: 100,
        tipContent: '',
      },
      authTimeDesc: [],
      authNameAsc: [],
      columns: [
        {
          type: 'expand',
          width: 50,
          render: (h, params) => h(ArticleStatisExpand, {
            props: {
              row: params.row,
            },
          }),
        },
        {
          title: '文献作者',
          key: 'author',
        },
        {
          title: '频次',
          key: 'times',
        },
      ],
    };
  },
  methods: {
    onChangeViewStyle() {
      if (this.viewStyle === 'chart') {
        this.viewStyle = 'table';
      } else {
        this.viewStyle = 'chart';
      }
      this.$Notice.success({ title: '图表转换成功' });
    },
    exportAuthorStat() {
      this.authorStat.modal = true;
    },
    cancelAuthorExportModal() {
      this.authorStat.modal = false;
    },
    copyAuthorStat() {
      this.authorStat.modal = false;
      this.$Notice.success({ title: '复制剪切板成功' });
    },
    getTableData() {

    },
  },
  mounted() {
    reqSingle('api/articles/', 'GET').then((res) => {
      this.articles = res.data;
      this.articleTotal = this.articles.length;
      _.forEach(this.articles, (item) => {
        // TODO: wait for backEnd
        // if (item.read_state === 'read') {
        //   this.readState.read += 1;
        // } else if (item.read_state === 'reading') {
        //   this.readState.reading += 1;
        // } else {
        //   this.readState.unread += 1;
        // }
        if (item.read_state === true) {
          this.readState.read += 1;
        } else {
          this.readState.unread += 1;
        }
        const newAuthors = _.split(item.author, 'and');
        _.forEach(newAuthors, (newAuth) => {
          const findRes = _.find(this.authorStat.data, stAuth => stAuth.name === newAuth);
          if (findRes === undefined) {
            this.authorStat.data = _.concat(this.authorStat.data, {
              name: newAuth,
              times: 1,
              articles: [item],
            });
          } else {
            findRes.times += 1;
            findRes.articles = _.concat(findRes.articles, item);
          }
        });
      });
      window.console.log('Author statistics data', this.authorStat.data);
      this.progress.tipContent = `${this.readState.read}已读 / ${this.readState.reading}在读
        / ${this.readState.unread}未读`;
      if (this.articleTotal === 0) {
        this.progress.progressPercent = 100;
        this.progress.successPercent = 100;
      } else {
        const progressNum = this.readState.reading + this.readState.read;
        // eslint-disable-next-line max-len,no-mixed-operators
        this.progress.progressPercent = _.toInteger(progressNum / this.articleTotal * this.progress.totalPercent);
        // eslint-disable-next-line max-len,no-mixed-operators
        this.progress.successPercent = _.toInteger(this.readState.read / this.articleTotal * this.progress.totalPercent);
        if (progressNum === this.articleTotal) {
          this.progress.progressPercent = 100;
        }
        if (this.readState.read === this.articleTotal) {
          this.progress.successPercent = 100;
        }
        this.authTimeDesc = _.orderBy(this.authorStat.data, ['times', 'name'], ['desc', 'asc']);
        this.authNameAsc = _.orderBy(this.authorStat.data, 'name', 'asc');
        window.console.log('time desc ', this.authTimeDesc);
        window.console.log('name asc', this.authNameAsc);
      }
    }).catch((err) => {
      pushErr(this, err, true);
    });
  },
};
</script>

<style scoped>
  #artTotalFont{
    text-align:left;
    margin-left: 20px;
    font-size: 21px;
    font-weight: bold;
  }
</style>
