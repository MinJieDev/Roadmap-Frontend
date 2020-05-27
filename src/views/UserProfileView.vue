<template>
  <Row>
    <Col span="8">
      <Menu theme="light">
        <MenuItem name="1">
          <Icon type="md-list-box" />
          档案管理
        </MenuItem>
        <MenuItem name="2">
          <Icon type="md-aperture" />
          兴趣管理
        </MenuItem>
        <Submenu name="3">
          <template slot="title">
            <Icon type="ios-stats" />
            内容统计
          </template>
          <MenuItem name="2-1">文献统计</MenuItem>
          <MenuItem name="2-2">路书统计</MenuItem>
          <MenuItem name="2-3">随笔统计</MenuItem>
        </Submenu>
      </Menu>
    </Col>
  </Row>
</template>

<script>
export default {
  name: 'UserProfileView',
};
</script>

<style scoped>

</style>

