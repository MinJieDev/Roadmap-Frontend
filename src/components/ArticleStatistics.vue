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
          type="success"
          @click="exportAuthorStat"
          style="margin-right: 9px; font-size: 16px;">
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
    <br><br>
    <div v-if="viewStyle==='chart'">
      <div id="chart">
        <schart
          class="wrapper"
          canvasId="canvas"
          :options="options"
        />
      </div>
    </div>
    <div v-else>
      <Table
        stripe
        :columns="columns"
        :data="tableData">
      </Table>
    </div>
    <Modal
      v-model="authExport.modal"
      title="导出全部文献作者频次"
      :styles="{top: '20px'}"
      @on-cancel="cancelAuthorExportModal">
      <p v-html="authExport.content"></p>
      <p slot="header" style="text-align:center">
        <Icon type="md-checkmark-circle-outline" />
        <span>导出成功</span>
        <i-switch
          size="large"
          true-color="#19be6b" false-color="#2db7f5"
          style="float: right; margin-right: 30px"
          @on-change="onChangeExportStyle">
          <span slot="open">姓名</span>
          <span slot="close">频次</span>
        </i-switch>
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
import Schart from 'vue-schart';
import { reqSingle } from '../apis/util';
import { pushErr } from '../components/ErrPush';
import ArticleStatisExpand from './ArticleStatisExpand';

export default {
  name: 'ArticleStatistics',
  components: { ArticleStatisExpand, Schart },
  data() {
    return {
      articles: [],
      articleTotal: 0,
      authorStat: {
        // data: [ {name: '', times: Number, articles: [] ]
        data: [],
      },
      authTimeDesc: [],
      tableData: [],
      authExport: {
        // view, times or name
        view: 'times',
        modal: false,
        content: '',
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
      options: {
        type: 'bar',
        title: {
          text: '作者统计图',
        },
        bgColor: '#fbfbfb',
        labels: [''],
        leftPadding: 120,
        xRorate: 15,
        datasets: [
          {
            label: '作者频次',
            fillColor: 'rgba(92 172 238)',
            data: [0],
          },
        ],
      },
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
          type: 'index',
          width: 60,
          align: 'center',
        },
        {
          title: '文献作者',
          key: 'name',
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
      _.forEach(this.authTimeDesc, (item) => {
        this.authExport.content = `${this.authExport.content}${_.toString(item.name)} - ${_.toString(item.times)}<br>`;
      });
      this.authExport.modal = true;
    },
    onChangeExportStyle() {
      if (this.authExport.view === 'times') {
        this.authExport.view = 'name';
      } else {
        this.authExport.view = 'times';
      }
      this.authExport.content = '';
      if (this.authExport.view === 'times') {
        _.forEach(this.authTimeDesc, (item) => {
          this.authExport.content = `${this.authExport.content}${_.toString(item.name)} - ${_.toString(item.times)}<br>`;
        });
      } else {
        _.forEach(this.authNameAsc, (item) => {
          this.authExport.content = `${this.authExport.content}${_.toString(item.name)} - ${_.toString(item.times)}<br>`;
        });
      }
    },
    cancelAuthorExportModal() {
      this.authorStat.modal = false;
      this.authExport.content = '';
    },
    copyAuthorStat() {
      this.authorStat.modal = false;
      this.$Notice.success({ title: '复制剪切板成功' });
    },
  },
  mounted() {
    reqSingle('api/articles/', 'GET').then((res) => {
      this.articles = res.data;
      this.articleTotal = this.articles.length;
      _.forEach(this.articles, (item) => {
        if (item.read_state === 'read') {
          this.readState.read += 1;
        } else if (item.read_state === 'reading') {
          this.readState.reading += 1;
        } else {
          this.readState.unread += 1;
        }
        // if (item.read_state === true) {
        //   this.readState.read += 1;
        // } else {
        //   this.readState.unread += 1;
        // }
        const newAuthors = _.split(item.author, ' and ');
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
      // window.console.log('Author statistics data', this.authorStat.data);
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
      }

      this.authTimeDesc = _.orderBy(this.authorStat.data, ['times', 'name'], ['desc', 'asc']);
      this.tableData = _.slice(this.authTimeDesc, 0, 10);
      let name = [];
      _.forEach(this.tableData, (item) => {
        name = _.concat(name, item.name);
      });
      this.options.labels = name;
      let times = [];
      _.forEach(this.tableData, (item) => {
        times = _.concat(times, _.toInteger(item.times));
      });
      this.options.datasets[0].data = times;
    }).catch((err) => {
      pushErr(this, err, true);
    });
  },
  computed: {
    authNameAsc() {
      return _.orderBy(this.authorStat.data, 'name', 'asc');
    },
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
  .wrapper{
    width: 850px;
    height: 500px;
  }
</style>
