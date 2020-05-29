<template>
  <div>
    <h2>
      文献总数
      <Icon type="md-copy" size="large"/>
      <u id="artTotalFont">{{articleTotal}}</u>
    </h2>
    <br><br>

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
    <br><br>

    <h2>作者统计
      <Icon type="md-people" size="large"/>
    </h2>
    <div style="float: right; margin-right: 30px">
      切换图表
      <i-switch
        @on-change="onChangeViewStyle"
        size="large"
        true-color="#19be6b"
        false-color="5cadff">
        <span slot="open">图</span>
        <span slot="close">表</span>
      </i-switch>
    </div>
    <br>
  </div>
</template>

<script>
import _ from 'lodash';
import { reqSingle } from '../apis/util';
import { pushErr } from '../components/ErrPush';

export default {
  name: 'ArticleStatistics',
  data() {
    return {
      articles: [],
      articleTotal: 0,
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
    };
  },
  methods: {
    onChangeViewStyle() {},
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
      });
      this.progress.tipContent = `${this.readState.read}已读 / ${this.readState.reading}在读
        / ${this.readState.unread}未读`;
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
