<template>
  <div>
    <Row style="text-aligh:center; margin-left:auto;margin-right:auto">
      <Col span="12">
        <Card style="width:75px; height:75px;float:right">
          <div style="text-align:center" >
            <Icon type="md-thumbs-up" size="25" style="margin-bottom: 5px"/>
            <div>喜欢</div>
          </div>
        </Card>
      </Col>
      <Col span="12">
        <Card style="width:75px; height:75px;margin-left: 5px; background-color: #19be6b">
          <div style="text-align:center">
            <Icon type="ios-share" size="25" style="margin-bottom: 5px"/>
            分享
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
  },
};
</script>
