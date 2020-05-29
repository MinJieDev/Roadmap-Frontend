<template>
  <div>
    <h2>
      文献总数
      <Icon type="md-copy" size="large"/>
    </h2>
    <Row :gutter="32">
      <Col span="8">
        <div id="artTotalFont">
          {{articleTotal}}}
        </div>
      </Col>
    </Row>
    <br>

    <h2>
      阅读进度
    </h2>
    <br>
    <Row :gutter="32">
      <Col span="24">
        <Tooltip :content="getProgressTipContent" style="width: 100%">
          <Progress
            :percent="progress.progressPercent"
            :success-percent="progress.successPercent" />
        </Tooltip>
      </Col>
    </Row>
  </div>
</template>

<script>
import _ from 'lodash';

export default {
  name: 'ArticleStatistics',
  props: {
    articles: {
      type: Array,
      required: true,
    },
    articleTotal: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      readState: {
        read: 0,
        reading: 0,
        unread: 0,
      },
      progress: {
        totalPercent: 100,
        progressPercent: 100,
        successPercent: 100,
      },
    };
  },
  methods: {
    getProgressTipContent() {
      return `${this.readState.read}已读 / ${this.readState.reading}在读
        / ${this.readState.unread}未读`;
    },
  },
  mounted() {
    _.forEach(this.articles, (item) => {
      if (item.read_state === 'read') {
        this.readState.read += 1;
      } else if (item.read_state === 'reading') {
        this.readState.reading += 1;
      } else {
        this.readState.unread += 1;
      }
    }).then(() => {
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
    });
  },
};
</script>

<style scoped>
  #artTotalFont{
    text-align:left;
    font-size: 19px;
  }
</style>
