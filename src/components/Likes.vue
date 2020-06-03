<template>
  <div>
    <Row style="text-aligh:center; margin-left:auto;margin-right:auto">
      <Col span="12">
        <Card style="width:75px; height:75px;float:right" :bordered="false">
          <div style="text-align:center" >
            <Icon type="md-thumbs-up" size="25" style="margin-bottom: 5px"/>
            <div>喜欢</div>
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
export default {
  name: 'Likes',
  data() {
    return {
    };
  },
  methods: {
    handleClkShare() {
      this.$emit('on-share');
    },
  },
};
</script>
