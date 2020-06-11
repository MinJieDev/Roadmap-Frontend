<template>
  <div>
    <Row style="text-aligh:center; margin-left:auto;margin-right:auto">
      <Col span="12">
        <Card style="width:75px; height:75px;float:right" :bordered="false"
              @click.native="handleClkLike">
          <div style="text-align:center" >
            <Icon type="md-thumbs-up" size="25" style="margin-bottom: 5px"/>
            <div v-if="canLike">喜欢{{like.length}}</div>
            <div v-else>取消{{like.length}}</div>
          </div>
        </Card>
      </Col>
      <Col span="12">
        <Card style="width:75px; height:75px;margin-left: 5px;"
              :bordered="false" @click.native="handleClkShare">
          <div style="text-align:center">
            <Icon type="ios-share" size="25" style="margin-bottom: 5px"/>
            <div>分享</div>
          </div>
        </Card>
      </Col>
    </Row>
  </div>
</template>
<script>
import _ from 'lodash';

export default {
  name: 'Likes',
  props: ['like', 'me'],
  data() {
    return {
    };
  },
  computed: {
    canLike() {
      if (!this.me) return true;
      return !(_(this.like).includes(this.me[0].id));
    },
  },
  methods: {
    handleClkShare() {
      this.$emit('on-share');
    },
    handleClkLike() {
      if (this.canLike) {
        this.$emit('on-like');
      } else {
        this.$emit('on-unlike');
      }
    },
  },
};
</script>
